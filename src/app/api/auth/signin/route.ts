import crypto from "node:crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Resend client — instantiated once per module load (reused across requests)
const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function buildMagicLinkEmail(magicUrl: string, name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sign in</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:12px;padding:48px 40px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#111827;">
                  Hi ${name},
                </p>
                <p style="margin:0 0 32px;font-size:15px;color:#6b7280;line-height:1.6;">
                  Click the button below to sign in — the link expires in
                  <strong style="color:#111827;">15 minutes</strong> and can only be used once.
                </p>

                <!-- Magic link button -->
                <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                  <tr>
                    <td style="border-radius:8px;background:#111827;">
                      <a href="${magicUrl}"
                        target="_blank"
                        style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;
                               color:#ffffff;text-decoration:none;border-radius:8px;">
                        Sign in to your account →
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
                  If the button doesn't work, copy and paste this URL into your browser:
                </p>
                <p style="margin:0 0 32px;font-size:12px;color:#6b7280;word-break:break-all;">
                  ${magicUrl}
                </p>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />
                <p style="margin:0;font-size:12px;color:#9ca3af;">
                  If you didn't request this email, you can safely ignore it.
                  No account changes were made.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(req: Request) {
  // ── Rate limit ───────────────────────────────────────────────────────────
  const { allowed, retryAfterSecs } = rateLimit(getIp(req), "signin");
  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please wait 15 minutes." },
      { status: 429, headers: { "Retry-After": String(retryAfterSecs) } },
    );
  }

  // ── Env-var guard ────────────────────────────────────────────────────────
  const missingVars: string[] = [];
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("USER:PASSWORD"))
    missingVars.push("DATABASE_URL");
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_api_key_here")
    missingVars.push("RESEND_API_KEY");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "your_super_secret_random_string_here")
    missingVars.push("JWT_SECRET");
  if (!process.env.NEXT_PUBLIC_APP_URL)
    console.warn("[auth/signin] NEXT_PUBLIC_APP_URL not set — magic link will use http://localhost:3000");

  if (missingVars.length > 0) {
    console.error("[auth/signin] Missing or placeholder env vars:", missingVars.join(", "));
    return NextResponse.json(
      { success: false, message: "Server is not configured yet. Check .env.local." },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const { name, email, phone } = body as {
      name?: string;
      email?: string;
      phone?: string;
    };

    if (!email) {
      return NextResponse.json(
        { success: false, message: "email is required" },
        { status: 400 },
      );
    }

    // Step 1: look up or create user
    console.log("[auth/signin] step 1 — looking up user:", email);
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      if (!name || !phone) {
        return NextResponse.json(
          { success: false, message: "name and phone are required for new accounts" },
          { status: 400 },
        );
      }
      user = await prisma.user.create({ data: { name, email, phone } });
    }
    console.log("[auth/signin] step 1 done — userId:", user.id);

    // Step 3: generate token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Step 4: persist token
    console.log("[auth/signin] step 4 — saving magic token");
    await prisma.magicToken.create({
      data: {
        token: rawToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    console.log("[auth/signin] step 4 done");

    // Step 5: send email
    const magicUrl = `${APP_URL}/api/auth/verify?token=${rawToken}`;
    console.log("[auth/signin] step 5 — sending email to:", email);
    console.log("[auth/signin] magic link URL:", magicUrl);

    const { error: resendError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: email,
      subject: "Your sign-in link (expires in 15 minutes)",
      html: buildMagicLinkEmail(magicUrl, user.name),
    });

    if (resendError) {
      console.error("[auth/signin] Resend error:", JSON.stringify(resendError));
      return NextResponse.json(
        { success: false, message: "Failed to send sign-in email" },
        { status: 502 },
      );
    }

    console.log("[auth/signin] step 5 done — email sent");
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[auth/signin] unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
