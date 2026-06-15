export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { fullName, phone, username, analysis, cardUrl, formAnswers } =
    body as {
      fullName?: string;
      phone?: string;
      username?: string;
      analysis?: string;
      cardUrl?: string;
      formAnswers?: unknown;
    };

  if (!fullName || !phone || !username || !analysis) {
    return NextResponse.json(
      { error: "Missing required fields: fullName, phone, username, analysis" },
      { status: 400 },
    );
  }

  await prisma.zGameEntry.create({
    data: {
      fullName,
      phone,
      username,
      analysis,
      cardUrl: cardUrl ?? null,
      formAnswers: formAnswers ?? undefined,
    },
  });

  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const params = new URLSearchParams({ username, analysis });
  if (cardUrl) params.set("cardUrl", cardUrl);
  const redirectUrl = `${base}/success?${params.toString()}`;

  return NextResponse.json({
    success: true,
    username,
    analysis,
    cardUrl: cardUrl ?? null,
    redirectUrl,
  });
}
