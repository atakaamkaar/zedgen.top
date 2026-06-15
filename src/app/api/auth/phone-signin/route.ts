import crypto from "node:crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const { phone } = body as { phone?: string };

  if (!phone) {
    return NextResponse.json(
      { success: false, message: "Phone number is required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findFirst({ where: { phone } });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "No account found. Please sign up with email first." },
      { status: 404 },
    );
  }

  const otp = String(crypto.randomInt(100000, 1000000));

  await prisma.magicToken.create({
    data: {
      token: otp,
      userId: user.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  const smsRes = await fetch(
    "https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.MELIPAYAMAK_USERNAME,
        password: process.env.MELIPAYAMAK_PASSWORD,
        to: phone,
        bodyId: Number(process.env.MELIPAYAMAK_BODY_ID),
        text: [otp],
      }),
    },
  );

  if (!smsRes.ok) {
    console.error("[phone-signin] Melipayamak error:", smsRes.status, await smsRes.text());
    return NextResponse.json(
      { success: false, message: "Failed to send SMS. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
