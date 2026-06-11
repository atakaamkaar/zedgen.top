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
    return `${data.message || "ارسال کد ورود ناموفق بود"}: ${providerDetail}`;
  }

  if (data.providerStatus) {
    return `${data.message || "ارسال کد ورود ناموفق بود"} (${data.providerStatus})`;
  }

  return data.message || "ارسال کد ورود ناموفق بود";
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
      setError("لطفا شماره موبایل خود را وارد کنید.");
      return;
    }

    try {
      setLoading(true);
      setStatus("در حال درخواست کد ورود...");

      const response = await fetch("/api/send-otp", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: cleanPhone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem("surveyPhone", data.phone || cleanPhone);
        setStatus("کد ورود ارسال شد. در حال انتقال...");
        window.location.href = `/verify?phone=${encodeURIComponent(
          data.phone || cleanPhone,
        )}`;
      } else {
        setError(getOtpErrorMessage(data));
        setStatus("");
      }
    } catch (error) {
      console.error(error);
      setError("ارسال کد ورود ناموفق بود.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      lang="fa"
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-100 via-blue-50 to-slate-100 px-4 py-8 text-slate-900 sm:px-6"
    >
      <section className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-6 text-center shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
        <form className="space-y-6" onSubmit={handleSendOtp}>
          <div className="space-y-3">
            <p className="text-sm font-bold text-sky-700">ورود امن</p>

            <h1 className="text-2xl font-bold leading-10 text-slate-950 sm:text-3xl">
              دریافت کد ورود
            </h1>

            <p className="mx-auto max-w-xs text-[15px] leading-8 text-slate-600">
              کارت اختصاصی خودت آماده شده... برای مشاهده، دانلود و ورود به دنیای
              بی پایان ضد شماره‌ت رو ثبت کن
            </p>
          </div>

          <div className="space-y-3 text-right">
            <label className="block text-sm font-semibold text-slate-700">
              شماره موبایل
            </label>

            <input
              type="tel"
              inputMode="tel"
              placeholder="09123456789"
              value={phone}
              onChange={(e) => setPhone(normalizePhoneInput(e.target.value))}
              required
              dir="ltr"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-center text-lg text-slate-900 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          {status ? (
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">
              {status}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-linear-to-r from-sky-400 to-blue-600 px-5 font-bold text-white shadow-[0_12px_30px_rgba(14,165,233,0.26)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "در حال ارسال کد..." : "ارسال کد ورود"}
          </button>

          <p className="text-center text-xs leading-6 text-slate-500">
            اگر پیامک را دریافت نکردید، در مرحله بعد می‌توانید دوباره کد بگیرید.
          </p>
        </form>
      </section>
    </main>
  );
}
