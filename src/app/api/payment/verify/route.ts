import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { authority, amount } = await req.json();

    const res = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount,
        authority,
      }),
    });

    const data = await res.json();
    const code = data.data?.code;

    if (code !== 100 && code !== 101) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed", details: data.errors ?? data },
        { status: 402 }
      );
    }

    return NextResponse.json({
      success: true,
      refId: data.data.ref_id,
      alreadyVerified: code === 101,
    });
  } catch (err) {
    console.error("[payment/verify]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
