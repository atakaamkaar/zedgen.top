"use client";

import { useState } from "react";

type VerifyFormProps = {
  initialPhone: string;
};

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
    return `${data.message || "Failed to resend OTP"}: ${providerDetail}`;
  }

  if (data.providerStatus) {
    return `${data.message || "Failed to resend OTP"} (${data.providerStatus})`;
  }

  return data.message || "Failed to resend OTP";
}

export default function VerifyForm({ initialPhone }: VerifyFormProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const maskedPhone = initialPhone
    ? `${initialPhone.slice(0, 4)} ${initialPhone.slice(4, 7)} ${initialPhone.slice(7)}`
    : "";

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setError("Please enter the OTP code.");
      return;
    }

    if (!/^\d{4,8}$/.test(cleanOtp)) {
      setError("OTP must be 4 to 8 digits.");
      return;
    }

    try {
      setLoading(true);
      sessionStorage.setItem("surveyOtpVerified", "true");
      window.location.href = "/survey";
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");

    if (!initialPhone) {
      setError("Please go back and enter your phone number first.");
      return;
    }

    try {
      setResending(true);

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: initialPhone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("A new OTP was sent.");
      } else {
        setError(getOtpErrorMessage(data));
      }
    } catch (error) {
      console.error(error);
      setError("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-gray-100 px-4 py-8 text-slate-900 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-white/40 bg-white/55 p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 text-2xl font-bold text-sky-700 shadow-sm">
            #
          </div>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Enter OTP</h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600">
            We sent a one-time password to your phone.
          </p>

          {maskedPhone ? (
            <p className="mt-2 text-sm font-semibold text-slate-700">
              {maskedPhone}
            </p>
          ) : null}
        </div>

        <form className="space-y-6 text-center" onSubmit={handleVerifyOtp}>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              OTP code
            </label>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={8}
              required
              className="h-16 w-full rounded-2xl border border-gray-200 bg-white/70 px-4 text-center text-3xl font-semibold tracking-[0.35em] text-slate-900 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm font-medium text-sky-800 shadow-sm">
              {message}
            </div>
          ) : null}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 px-5 font-bold text-white shadow-[0_8px_24px_rgba(14,165,233,0.24)] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Submitting..." : "Submit OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="h-14 w-full rounded-2xl border border-gray-200 bg-white/60 px-5 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
