import https from "node:https";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FALLBACK_OTP_TOKEN = "d380e0dc3f3c4827a713830e6a5094dc";

type ProviderResult = {
  statusCode: number;
  data: unknown;
  raw: string;
};

function normalizeIranPhone(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const englishDigits = value
    .replace(/[\u06f0-\u06f9]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x06f0),
    )
    .replace(/[\u0660-\u0669]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x0660),
    );

  let phone = englishDigits.replace(/[^\d+]/g, "");

  if (phone.startsWith("+98")) {
    phone = `0${phone.slice(3)}`;
  } else if (phone.startsWith("98")) {
    phone = `0${phone.slice(2)}`;
  }

  return phone;
}

function parseProviderBody(raw: string) {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function sendOtpWithMelipayamak(phone: string, token: string) {
  return new Promise<ProviderResult>((resolve, reject) => {
    const data = JSON.stringify({
      to: phone,
    });

    const request = https.request(
      {
        hostname: "console.melipayamak.com",
        family: 4,
        port: 443,
        path: `/api/send/otp/${token}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
        timeout: 15000,
      },
      (response) => {
        let raw = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          resolve({
            statusCode: response.statusCode || 500,
            data: parseProviderBody(raw),
            raw,
          });
        });
      },
    );

    request.on("timeout", () => {
      request.destroy(new Error("OTP provider timed out"));
    });
    request.on("error", reject);
    request.write(data);
    request.end();
  });
}

function hasProviderCode(data: unknown) {
  return Boolean(
    data &&
      typeof data === "object" &&
      "code" in data &&
      String((data as { code?: unknown }).code || "").trim(),
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeIranPhone(body.phone);

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid Iranian mobile number, like 09123456789",
        },
        {
          status: 400,
        },
      );
    }

    const token = process.env.MELIPAYAMAK_OTP_TOKEN || FALLBACK_OTP_TOKEN;
    const provider = await sendOtpWithMelipayamak(phone, token);

    if (provider.statusCode < 200 || provider.statusCode >= 300) {
      return NextResponse.json(
        {
          success: false,
          message: `OTP provider rejected the request with status ${provider.statusCode}`,
          providerStatus: provider.statusCode,
          data: provider.data,
          raw: provider.raw,
        },
        {
          status: provider.statusCode,
        },
      );
    }

    if (!hasProviderCode(provider.data)) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP provider did not return a verification code",
          providerStatus: provider.statusCode,
          data: provider.data,
          raw: provider.raw,
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json({
      success: true,
      phone,
      data: provider.data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "OTP sending failed",
      },
      {
        status: 500,
      },
    );
  }
}
