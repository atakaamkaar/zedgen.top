import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_COOKIE = "session";
const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60;
const MAX_OTP_ATTEMPTS = 5;

// Per-token wrong-attempt counter. Keyed by MagicToken.id.
// In-memory is fine: tokens expire in 5 min; DB invalidation (used: true)
// is the durable safety net across restarts / instances.
const otpAttempts = new Map<string, number>();

export async function POST(req: Request) {
  const body = await req.json();
  const { phone, otp } = body as { phone?: string; otp?: string };

  if (!phone || !otp) {
    return NextResponse.json(
      { success: false, message: "Phone and code are required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findFirst({ where: { phone } });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "No account found." },
      { status: 404 },
    );
  }

  // Look up the active token WITHOUT filtering by OTP value so we can
  // track wrong guesses before the correct one is known.
  // Expiry check: expiresAt > now (5-minute window set at issuance).
  const activeToken = await prisma.magicToken.findFirst({
    where: {
      userId: user.id,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: "desc" },
  });

  if (!activeToken) {
    return NextResponse.json(
      { success: false, message: "No active code found. Please request a new one." },
      { status: 400 },
    );
  }

  // Guard: token already hit the limit (race-condition safety net — normally
  // the token would be marked used and filtered out above).
  const attempts = otpAttempts.get(activeToken.id) ?? 0;
  if (attempts >= MAX_OTP_ATTEMPTS) {
    await invalidate(activeToken.id);
    otpAttempts.delete(activeToken.id);
    console.warn(
      `[phone-verify] BLOCKED — token ${activeToken.id} exceeded attempt limit — phone: ${phone} — ${new Date().toISOString()}`,
    );
    return tooManyAttempts();
  }

  // Wrong OTP
  if (activeToken.token !== otp) {
    const newAttempts = attempts + 1;
    otpAttempts.set(activeToken.id, newAttempts);
    console.warn(
      `[phone-verify] wrong OTP attempt ${newAttempts}/${MAX_OTP_ATTEMPTS} — phone: ${phone} — ${new Date().toISOString()}`,
    );

    if (newAttempts >= MAX_OTP_ATTEMPTS) {
      await invalidate(activeToken.id);
      otpAttempts.delete(activeToken.id);
      return tooManyAttempts();
    }

    return NextResponse.json(
      { success: false, message: "Invalid code. Please try again." },
      { status: 400 },
    );
  }

  // Correct OTP — consume the token
  otpAttempts.delete(activeToken.id);
  await invalidate(activeToken.id);

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[phone-verify] JWT_SECRET is not set");
    return NextResponse.json(
      { success: false, message: "Server misconfiguration." },
      { status: 500 },
    );
  }

  const sessionToken = jwt.sign(
    { userId: user.id, email: user.email },
    secret,
    { expiresIn: JWT_EXPIRY_SECONDS },
  );

  const isProd = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: JWT_EXPIRY_SECONDS,
    path: "/",
  });

  return response;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function invalidate(tokenId: string) {
  return prisma.magicToken.update({
    where: { id: tokenId },
    data: { used: true },
  });
}

function tooManyAttempts() {
  return NextResponse.json(
    { success: false, message: "Too many wrong attempts. Request a new code." },
    { status: 429 },
  );
}
