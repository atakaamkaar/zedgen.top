import https from "node:https";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProviderResult = {
  statusCode: number;
  data: unknown;
  raw: string;
  headers: Record<string, string | string[] | undefined>;
};

type StoredOtp = {
  code: string;
  expiresAt: number;
};

declare global {
  var otpStore: Map<string, StoredOtp> | undefined;
}

const OTP_TTL_MS = 10 * 60 * 1000;
const otpStore = globalThis.otpStore ?? new Map<string, StoredOtp>();
globalThis.otpStore = otpStore;

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

function createOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getProviderUrl() {
  return new URL(
    process.env.MELIPAYAMAK_OTP_URL ||
      "https://console.melipayamak.com/api/send/otp/d380e0dc3f3c4827a713830e6a5094dc",
  );
}

function parseProviderBody(raw: string) {
  if (!raw.trim()) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function findOtpCode(value: unknown): string | null {
  if (typeof value === "string") {
    const match = value.match(/\b\d{4,8}\b/);
    return match ? match[0] : null;
  }

  if (typeof value !== "object" || value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const code = findOtpCode(item);

      if (code) {
        return code;
      }
    }

    return null;
  }

  const preferredKeys = ["otp", "code", "pin", "password", "token"];
  const record = value as Record<string, unknown>;

  for (const key of preferredKeys) {
    const exactKey = Object.keys(record).find(
      (candidate) => candidate.toLowerCase() === key,
    );

    if (exactKey) {
      const code = findOtpCode(record[exactKey]);

      if (code) {
        return code;
      }
    }
  }

  for (const item of Object.values(record)) {
    const code = findOtpCode(item);

    if (code) {
      return code;
    }
  }

  return null;
}

function sendOtpWithMelipayamak({
  phone,
}: {
  phone: string;
}) {
  return new Promise<ProviderResult>((resolve, reject) => {
    const providerUrl = getProviderUrl();
    const data = JSON.stringify({
      to: phone,
    });

    const request = https.request(
      {
        hostname: providerUrl.hostname,
        family: 4,
        port: 443,
        path: `${providerUrl.pathname}${providerUrl.search}`,
        method: "POST",
        timeout: 15000,
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          Pragma: "no-cache",
        },
      },
      (response) => {
        let raw = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          const parsedBody = parseProviderBody(raw);

          resolve({
            statusCode: response.statusCode || 500,
            data: parsedBody,
            raw,
            headers: response.headers,
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

    const provider = await sendOtpWithMelipayamak({
      phone,
    });
    const providerOtp = findOtpCode(provider.data);
    const code = providerOtp || createOtpCode();

    if (provider.statusCode < 200 || provider.statusCode >= 300) {
      return NextResponse.json(
        {
          success: false,
          message: `OTP provider rejected the request with status ${provider.statusCode}`,
          providerStatus: provider.statusCode,
          data: provider.data,
          raw: provider.raw,
          headers: provider.headers,
        },
        {
          status: provider.statusCode,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    otpStore.set(phone, {
      code,
      expiresAt: Date.now() + OTP_TTL_MS,
    });

    return NextResponse.json(
      {
        success: true,
        message: providerOtp
          ? "OTP provider returned a code and it was stored for verification."
          : "OTP request was accepted. The provider did not return a readable OTP code.",
        phone,
        providerStatus: provider.statusCode,
        data: provider.data,
        raw: provider.raw,
        headers: provider.headers,
        canVerifyLocally: Boolean(providerOtp),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
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
