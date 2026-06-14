"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Could not reach the server. Check your connection.");
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-100 via-blue-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">

        {status === "success" ? (
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
          /* ── Form state ── */
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1">
              <p className="text-sm font-bold text-sky-600">Secure sign-in</p>
              <h1 className="text-2xl font-bold text-slate-900">
                Sign in or create account
              </h1>
              <p className="text-sm leading-6 text-slate-500">
                Enter your details and we&apos;ll email you a magic link — no password needed.
              </p>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                required
                autoComplete="name"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                autoComplete="email"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                required
                autoComplete="tel"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Error banner */}
            {status === "error" && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-1 h-12 w-full rounded-2xl bg-linear-to-r from-sky-400 to-blue-600 font-bold text-white shadow-[0_8px_24px_rgba(14,165,233,0.28)] transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "loading" ? "Sending link…" : "Send me a sign-in link"}
            </button>

            <p className="text-center text-xs text-slate-400">
              By continuing you agree to our terms of service.
            </p>
          </form>
        )}

      </div>
    </main>
  );
}
