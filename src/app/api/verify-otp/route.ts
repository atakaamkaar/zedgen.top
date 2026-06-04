import { NextResponse } from "next/server";

export const runtime = "nodejs";

type StoredOtp = {
  code: string;
  expiresAt: number;
};

declare global {
  var otpStore: Map<string, StoredOtp> | undefined;
}

function normalizeDigits(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u06f0-\u06f9]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x06f0),
    )
    .replace(/[\u0660-\u0669]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x0660),
    )
    .replace(/\D/g, "");
}

function normalizeIranPhone(value: unknown) {
  const digits = normalizeDigits(value);

  if (digits.startsWith("98")) {
    return `0${digits.slice(2)}`;
  }

  return digits;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeIranPhone(body.phone);
    const otp = normalizeDigits(body.otp);
    const otpStore = globalThis.otpStore;

    if (!phone || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number and OTP are required",
        },
        {
          status: 400,
        },
      );
    }

    const storedOtp = otpStore?.get(phone);

    if (!storedOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "No OTP request found. Please resend the OTP.",
        },
        {
          status: 400,
        },
      );
    }

    if (storedOtp.expiresAt < Date.now()) {
      otpStore?.delete(phone);

      return NextResponse.json(
        {
          success: false,
          message: "OTP expired. Please resend the OTP.",
        },
        {
          status: 400,
        },
      );
    }

    if (storedOtp.code !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP code.",
        },
        {
          status: 401,
        },
      );
    }

    otpStore?.delete(phone);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "OTP verification failed",
      },
      {
        status: 500,
      },
    );
  }
}
