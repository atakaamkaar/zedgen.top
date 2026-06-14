import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_COOKIE = "session";
const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

function redirectInvalid(reason: string) {
  // Send the user back to login with a generic error flag.
  // We never expose the real reason (expired vs. used vs. not found) to the
  // browser — that would let an attacker distinguish between token states.
  console.warn("[auth/verify] invalid token:", reason);
  return NextResponse.redirect(new URL("/login?error=invalid", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
}

export async function GET(req: NextRequest) {
  try {
  // ─── Step 1: Extract the token from the query string ─────────────────────
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return redirectInvalid("missing token param");
  }

  // ─── Step 2: Look up the token and eagerly load the related user ──────────
  // We need the user's email to embed in the JWT, so we join in one query
  // rather than a separate prisma.user.findUnique afterward.
  const record = await prisma.magicToken.findUnique({
    where: { token },
    include: { user: true },
  });

  // ─── Step 3: Validate — must exist, unused, and not expired ──────────────
  if (!record) {
    return redirectInvalid("token not found");
  }

  if (record.used) {
    return redirectInvalid("token already used");
  }

  if (record.expiresAt < new Date()) {
    return redirectInvalid("token expired");
  }

  // ─── Step 4: Burn the token — mark it used so it can never be replayed ───
  // Even if the redirect below somehow fires twice, this UPDATE is atomic:
  // only one request can flip used from false → true.
  await prisma.magicToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  // ─── Step 5: Issue a signed JWT ───────────────────────────────────────────
  // The JWT contains the minimal claims needed server-side: userId and email.
  // It is signed with JWT_SECRET so any tampering invalidates the signature.
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[auth/verify] JWT_SECRET is not set");
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  const sessionToken = jwt.sign(
    { userId: record.userId, email: record.user.email },
    secret,
    { expiresIn: JWT_EXPIRY_SECONDS },
  );

  // ─── Step 6: Set the JWT as an HttpOnly cookie ────────────────────────────
  //
  // WHY HttpOnly?
  //   A regular cookie (without HttpOnly) is readable by any JavaScript
  //   running on the page — including injected scripts from XSS attacks.
  //   HttpOnly tells the browser: "never expose this cookie to document.cookie
  //   or fetch/XHR from JS". Only the browser's HTTP layer sees it, meaning
  //   even a successful XSS attack cannot steal the session token.
  //
  // WHY Secure?
  //   The Secure flag makes the browser send the cookie only over HTTPS,
  //   preventing it from being intercepted over a plain HTTP connection.
  //   We relax this in development (localhost doesn't use HTTPS).
  //
  // WHY SameSite=Lax?
  //   Lax blocks the cookie from being sent on cross-site POST requests
  //   (CSRF attacks), while still allowing it on normal top-level navigations
  //   like clicking a link. Strict would break magic-link clicks from emails.
  //
  const isProd = process.env.NODE_ENV === "production";

  const response = NextResponse.redirect(
    new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  );

  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,               // not accessible from JavaScript — blocks XSS token theft
    secure: isProd,               // HTTPS only in production; allow HTTP on localhost
    sameSite: "lax",              // blocks CSRF POST; allows redirect from email link
    maxAge: JWT_EXPIRY_SECONDS,   // browser clears it after 7 days automatically
    path: "/",                    // sent with every request to this origin
  });

  // ─── Step 7: Redirect to the dashboard ───────────────────────────────────
  // The Set-Cookie header rides along with the 302 redirect response.
  // The browser stores the cookie, follows the redirect, and includes the
  // cookie in every subsequent request — the user is now authenticated.
  return response;
  } catch (err) {
    // Any unexpected error (DB down, JWT misconfiguration, etc.) sends the
    // user to the invalid-link page rather than showing a raw 500.
    console.error("[auth/verify] unexpected error:", err);
    return redirectInvalid("unexpected error");
  }
}
