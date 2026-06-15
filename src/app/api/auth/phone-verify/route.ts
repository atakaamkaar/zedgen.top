import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_COOKIE = "session";
const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

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

  const record = await prisma.magicToken.findFirst({
    where: {
      userId: user.id,
      token: otp,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired code. Please try again." },
      { status: 400 },
    );
  }

  await prisma.magicToken.update({
    where: { id: record.id },
    data: { used: true },
  });

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
