import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { amount, description, email, mobile, callbackUrl } = await req.json();

    const res = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount,
        description,
        callback_url: callbackUrl,
        metadata: { email, mobile },
      }),
    });

    const data = await res.json();

    if (data.data?.code !== 100) {
      return NextResponse.json(
        { error: "ZarrinPal request failed", details: data.errors ?? data },
        { status: 502 }
      );
    }

    const authority = data.data.authority;
    const paymentUrl = `https://www.zarinpal.com/pg/StartPay/${authority}`;

    return NextResponse.json({ authority, paymentUrl });
  } catch (err) {
    console.error("[payment/create]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
