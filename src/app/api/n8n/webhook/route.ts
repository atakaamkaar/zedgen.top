export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const N8N_WEBHOOK_URL =
  "https://zad-agent.app.n8n.cloud/webhook/zed-ai-agent";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { fullName, phone, answers } = body as {
    fullName?: string;
    phone?: string;
    answers?: Record<string, string>;
  };

  if (!fullName || !phone || !answers) {
    return NextResponse.json(
      { error: "Missing required fields: fullName, phone, answers" },
      { status: 400 },
    );
  }

  // Forward to n8n and wait for the AI response
  let n8nData: { username?: string; analysis?: string; cardUrl?: string };
  try {
    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, ...answers }),
    });

    if (!n8nRes.ok) {
      const text = await n8nRes.text().catch(() => "");
      console.error("[n8n/webhook] n8n returned", n8nRes.status, text);
      return NextResponse.json(
        { error: "AI agent failed", details: text },
        { status: 502 },
      );
    }

    n8nData = await n8nRes.json();
  } catch (err) {
    console.error("[n8n/webhook] fetch to n8n failed:", err);
    return NextResponse.json(
      { error: "Could not reach AI agent" },
      { status: 502 },
    );
  }

  const { username, analysis, cardUrl } = n8nData;

  if (!username || !analysis) {
    console.error("[n8n/webhook] incomplete n8n response:", n8nData);
    return NextResponse.json(
      { error: "AI agent returned incomplete data" },
      { status: 502 },
    );
  }

  // Persist entry
  try {
    await prisma.zGameEntry.create({
      data: {
        fullName,
        phone,
        username,
        analysis,
        cardUrl: cardUrl ?? null,
        formAnswers: answers,
      },
    });
  } catch (err) {
    // Log but don't fail the request — the user should still get their result
    console.error("[n8n/webhook] DB write failed:", err);
  }

  return NextResponse.json({ username, analysis, cardUrl: cardUrl ?? null });
}
