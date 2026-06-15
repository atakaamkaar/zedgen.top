"use client";

import { useState } from "react";

type Tab = "email" | "phone";
type EmailStatus = "idle" | "loading" | "success" | "error";
type PhoneStatus = "idle" | "loading" | "error";
type PhoneStep = "input" | "otp";
type UserType = "new" | "existing" | null;

const inputCls =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100";
const btnCls =
  "mt-1 h-12 w-full rounded-2xl bg-linear-to-r from-sky-400 to-blue-600 font-bold text-white shadow-[0_8px_24px_rgba(14,165,233,0.28)] transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";
const errCls =
  "rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>("email");

  // ── Email tab ──
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [userType, setUserType] = useState<UserType>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailError, setEmailError] = useState("");

  // ── Phone tab ──
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("input");
  const [phoneStatus, setPhoneStatus] = useState<PhoneStatus>("idle");
  const [phoneError, setPhoneError] = useState("");

  // ── Email tab handlers ──
  async function handleEmailBlur() {
    if (!email || !email.includes("@")) return;
    setCheckingEmail(true);
    try {
      const res = await fetch(
        `/api/auth/check-email?email=${encodeURIComponent(email)}`,
      );
      const data = await res.json();
      setUserType(data.exists ? "existing" : "new");
    } catch {
      // silently ignore — form submit will surface errors
    } finally {
      setCheckingEmail(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus("loading");
    setEmailError("");

    try {
      const payload =
        userType === "existing"
          ? { email }
          : { name, email, phone: regPhone };

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setEmailError(data.message ?? "Something went wrong. Please try again.");
        setEmailStatus("error");
        return;
      }
      setEmailStatus("success");
    } catch {
      setEmailError("Could not reach the server. Check your connection.");
      setEmailStatus("error");
    }
  }

  // ── Phone tab handlers ──
  async function handlePhoneSend(e: React.FormEvent) {
    e.preventDefault();
    setPhoneStatus("loading");
    setPhoneError("");

    try {
      const res = await fetch("/api/auth/phone-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setPhoneError(data.message ?? "Something went wrong. Please try again.");
        setPhoneStatus("error");
        return;
      }
      setPhoneStep("otp");
      setPhoneStatus("idle");
    } catch {
      setPhoneError("Could not reach the server. Check your connection.");
      setPhoneStatus("error");
    }
  }

  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    setPhoneStatus("loading");
    setPhoneError("");

    try {
      const res = await fetch("/api/auth/phone-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, otp }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setPhoneError(data.message ?? "Invalid code. Please try again.");
        setPhoneStatus("error");
        return;
      }
      window.location.href = "/dashboard";
    } catch {
      setPhoneError("Could not reach the server. Check your connection.");
      setPhoneStatus("error");
    }
  }

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setEmailError("");
    setPhoneError("");
  }

  const showNewUserFields = userType !== "existing";

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-100 via-blue-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">

        {emailStatus === "success" ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-3xl">
              ✉️
            </div>
            <h2 className="text-xl font-bold text-slate-900">Check your email!</h2>
            <p className="text-[15px] leading-7 text-slate-600">
              We sent a sign-in link to{" "}
              <span className="font-semibold text-sky-600">{email}</span>.
              <br />
              It expires in 15 minutes.
            </p>
            <p className="text-xs text-slate-400">
              Don&apos;t see it? Check your spam folder.
            </p>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="mb-6 space-y-1">
              <p className="text-sm font-bold text-sky-600">Secure sign-in</p>
              <h1 className="text-2xl font-bold text-slate-900">
                Sign in or create account
              </h1>
            </div>

            {/* ── Tab switcher ── */}
            <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
              {(["email", "phone"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchTab(tab)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab === "email" ? "Email" : "Phone"}
                </button>
              ))}
            </div>

            {/* ── Email tab ── */}
            {activeTab === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-5" noValidate>
                <p className="text-sm leading-6 text-slate-500">
                  {userType === "existing"
                    ? "Welcome back! We'll send a sign-in link to your inbox."
                    : "Enter your details and we'll email you a magic link — no password needed."}
                </p>

                {/* Email (always shown) */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setUserType(null);
                      }}
                      onBlur={handleEmailBlur}
                      placeholder="alex@example.com"
                      required
                      autoComplete="email"
                      className={inputCls}
                    />
                    {checkingEmail && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="block h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                      </span>
                    )}
                  </div>
                  {userType === "existing" && (
                    <p className="text-xs text-sky-600 font-medium">
                      We found your account.
                    </p>
                  )}
                </div>

                {/* Name + Phone — visible only for new users, animated */}
                <div
                  style={{
                    maxHeight: showNewUserFields ? "200px" : "0",
                    opacity: showNewUserFields ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.35s ease, opacity 0.25s ease",
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Johnson"
                      required={showNewUserFields}
                      autoComplete="name"
                      className={inputCls}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+98 912 000 0000"
                      required={showNewUserFields}
                      autoComplete="tel"
                      className={inputCls}
                    />
                  </div>
                </div>

                {emailStatus === "error" && (
                  <div className={errCls}>{emailError}</div>
                )}

                <button
                  type="submit"
                  disabled={emailStatus === "loading"}
                  className={btnCls}
                >
                  {emailStatus === "loading"
                    ? "Sending link…"
                    : "Send me a sign-in link"}
                </button>

                <p className="text-center text-xs text-slate-400">
                  By continuing you agree to our terms of service.
                </p>
              </form>
            )}

            {/* ── Phone tab ── */}
            {activeTab === "phone" && (
              <>
                {phoneStep === "input" ? (
                  <form onSubmit={handlePhoneSend} className="space-y-5" noValidate>
                    <p className="text-sm leading-6 text-slate-500">
                      Enter your registered phone number and we&apos;ll send a
                      one-time verification code.
                    </p>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-700">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+98 912 000 0000"
                        required
                        autoComplete="tel"
                        className={inputCls}
                      />
                    </div>

                    {phoneStatus === "error" && (
                      <div className={errCls}>{phoneError}</div>
                    )}

                    <button
                      type="submit"
                      disabled={phoneStatus === "loading"}
                      className={btnCls}
                    >
                      {phoneStatus === "loading"
                        ? "Sending code…"
                        : "Send verification code"}
                    </button>

                    <p className="text-center text-xs text-slate-400">
                      By continuing you agree to our terms of service.
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="space-y-5" noValidate>
                    <p className="text-sm leading-6 text-slate-500">
                      We sent a 6-digit code to{" "}
                      <span className="font-semibold text-slate-700">
                        {phoneNumber}
                      </span>
                      . It expires in 5 minutes.
                    </p>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-700">
                        Verification code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="123456"
                        required
                        autoComplete="one-time-code"
                        className={`${inputCls} text-center text-2xl tracking-[0.5em]`}
                      />
                    </div>

                    {phoneStatus === "error" && (
                      <div className={errCls}>{phoneError}</div>
                    )}

                    <button
                      type="submit"
                      disabled={phoneStatus === "loading"}
                      className={btnCls}
                    >
                      {phoneStatus === "loading" ? "Verifying…" : "Verify & sign in"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPhoneStep("input");
                        setOtp("");
                        setPhoneError("");
                        setPhoneStatus("idle");
                      }}
                      className="w-full text-center text-sm text-slate-500 transition hover:text-slate-700"
                    >
                      Didn&apos;t receive the code? Go back
                    </button>
                  </form>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
