"use client";

import { useState } from "react";

function normalizePhoneInput(value: string) {
  const englishDigits = value
    .replace(/[\u06f0-\u06f9]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x06f0),
    )
    .replace(/[\u0660-\u0669]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x0660),
    );

  return englishDigits.replace(/[^\d+]/g, "");
}

function getOtpErrorMessage(data: {
  message?: string;
  providerStatus?: number;
  data?: unknown;
  raw?: string;
}) {
  const providerDetail =
    typeof data.raw === "string" && data.raw.trim()
      ? data.raw.trim()
      : typeof data.data === "string"
        ? data.data
        : data.data
          ? JSON.stringify(data.data)
          : "";

  if (providerDetail) {
    return `${data.message || "Failed to send OTP"}: ${providerDetail}`;
  }

  if (data.providerStatus) {
    return `${data.message || "Failed to send OTP"} (${data.providerStatus})`;
  }

  return data.message || "Failed to send OTP";
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");

    const cleanPhone = normalizePhoneInput(phone);

    if (!cleanPhone) {
      setError("Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Requesting your secure code...");

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: cleanPhone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem("surveyPhone", data.phone || cleanPhone);
        setStatus("OTP sent. Opening verification...");
        window.location.href = `/verify?phone=${encodeURIComponent(
          data.phone || cleanPhone,
        )}`;
      } else {
        setError(getOtpErrorMessage(data));
        setStatus("");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to send OTP");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-100 via-blue-50 to-gray-100 px-4 py-8 text-slate-900 sm:px-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-white/55 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl md:grid-cols-[1fr_1.1fr]">
        <div className="bg-linear-to-br from-sky-400 via-blue-400 to-blue-600 p-7 text-white sm:p-8 md:p-10">
          <div className="flex h-full min-h-80 flex-col justify-between gap-10">
            <div>
              <p className="inline-flex rounded-full border border-white/30 bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur-md">
                Gen Z Survey
              </p>

              <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
                One quick step before you begin.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/90">
                We will send a secure one-time password to verify your mobile
                number and continue your experience.
              </p>
            </div>

            <div className="grid gap-4 text-sm">
              <div className="flex items-center gap-4 rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur-md">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white font-bold text-sky-600 shadow-sm">
                  1
                </span>
                <span>Enter your mobile number</span>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur-md">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white font-bold text-blue-600 shadow-sm">
                  2
                </span>
                <span>Receive OTP by SMS</span>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur-md">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white font-bold text-slate-700 shadow-sm">
                  3
                </span>
                <span>Continue to the survey</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-white/70 p-7 backdrop-blur-2xl sm:p-8 md:p-10">
          <form className="w-full space-y-6 text-center" onSubmit={handleSendOtp}>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
                Secure Login
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Send OTP
              </h2>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-gray-600">
                Use an Persian mobile number. Persian and English digits are
                both accepted.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Mobile Number
              </label>

              <input
                type="tel"
                inputMode="tel"
                placeholder="09123456789"
                value={phone}
                onChange={(e) => setPhone(normalizePhoneInput(e.target.value))}
                required
                className="h-14 w-full rounded-2xl border border-gray-200 bg-white/70 px-5 text-center text-lg text-slate-900 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
                {error}
              </div>
            ) : null}

            {status ? (
              <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm font-medium text-sky-800 shadow-sm">
                {status}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-linear-to-r from-sky-400 to-blue-500 px-5 font-bold text-white shadow-[0_8px_24px_rgba(14,165,233,0.24)] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="text-center text-xs leading-6 text-gray-500">
              If the SMS does not arrive, you can resend it on the next screen.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
