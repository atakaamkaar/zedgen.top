const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX = 5;

type Entry = { count: number; resetAt: number };

// Shared store — single Map per Node.js process.
// With multiple server instances each has its own map (acceptable for basic protection).
const store = new Map<string, Entry>();

export function rateLimit(
  ip: string,
  endpoint: string,
): { allowed: boolean; retryAfterSecs: number } {
  const key = `${endpoint}:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSecs: 0 };
  }

  if (entry.count >= MAX) {
    return { allowed: false, retryAfterSecs: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSecs: 0 };
}

export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  );
}
