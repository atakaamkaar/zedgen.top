import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Routes that require a valid session to access.
// Defined as a prefix — anything under /dashboard is protected.
const PROTECTED_PREFIX = "/dashboard";

// Routes the middleware must never redirect (would cause a redirect loop).
const PUBLIC_PATHS = ["/login", "/api/auth"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

/**
 * Next.js Middleware
 *
 * WHAT IT IS:
 *   Middleware is a thin layer that runs on every matching request BEFORE
 *   the page or API route is executed. It lives at the Edge — meaning it
 *   runs in a lightweight V8 isolate close to the user, not in a full
 *   Node.js process. This makes it extremely fast (no cold-start, no DB)
 *   but also limits it: no Node.js built-ins, no Prisma, no jsonwebtoken.
 *
 * WHY PROTECTING ROUTES MATTERS:
 *   Without middleware, a user who manually navigates to /dashboard and
 *   has no cookie would either get an unhandled error or see protected data
 *   if the page forgets to check auth. Middleware makes the check impossible
 *   to forget — it is enforced at the infrastructure level, not left to
 *   each individual page component.
 *
 * WHY NOT JUST CHECK IN THE PAGE COMPONENT?
 *   - It's easy to forget on new pages.
 *   - The page renders briefly before the redirect fires (flash of content).
 *   - Server Components can't set cookies or issue redirects as cleanly.
 *   Middleware solves all three: one place, zero flash, runs before rendering.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let login, /api/auth/*, and other public paths through unconditionally.
  if (!pathname.startsWith(PROTECTED_PREFIX) || isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;
  const loginUrl = new URL("/login", req.url);

  // No cookie at all — definitely not logged in.
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[middleware] JWT_SECRET is not set");
    return NextResponse.redirect(loginUrl);
  }

  try {
    // jwtVerify comes from "jose" — the only JWT library that works in the
    // Edge runtime. It uses the Web Crypto API instead of Node.js crypto.
    // It throws if the signature is invalid, the token is expired, or the
    // token is malformed — we treat every failure the same way: send to login.
    await jwtVerify(
      token,
      // jose requires the secret as a Uint8Array, not a raw string.
      new TextEncoder().encode(secret),
    );

    // Token is valid — let the request through to the actual page.
    return NextResponse.next();
  } catch {
    // Invalid or expired JWT — clear the stale cookie and redirect to login.
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("session");
    return response;
  }
}

/**
 * The matcher tells Next.js which paths to run this middleware on.
 * Excluding /_next/static, /_next/image, and /favicon.ico avoids running
 * auth logic on static assets — those never need session checks and excluding
 * them keeps the middleware fast.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
