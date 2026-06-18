import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export type SessionPayload = {
  userId: string;
  email: string;
};

function verifyToken(token: string): SessionPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[auth] JWT_SECRET is not set");
    return null;
  }
  try {
    const payload = jwt.verify(token, secret) as SessionPayload;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

/**
 * For Route Handlers and middleware — pass the NextRequest directly.
 */
export function getSession(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * For Server Components and server actions — reads the cookie from the
 * Next.js async cookies store instead of a request object.
 *
 * Must be called inside an async Server Component, a server action,
 * or any other async server context (not in Client Components or middleware).
 *
 * Usage:
 *   const session = await getSessionFromCookies();
 *   if (!session) redirect("/login");
 */
export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Canonical helper for protected Server Components.
 * Reads and verifies the session cookie; returns the payload or null.
 *
 * Usage:
 *   const user = await getSessionUser();
 *   if (!user) redirect("/login");
 */
export const getSessionUser = getSessionFromCookies;
