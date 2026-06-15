"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Questions ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    key: "q1",
    text: "What's your raw material?",
    sub: "What do you create with?",
    options: [
      "Bars / Lyrics — every word is a weapon",
      "Beats / Production — the sound is the message",
      "Visuals / Direction — I paint the picture",
      "All three — I control the whole vision",
    ],
  },
  {
    key: "q2",
    text: "Your creative energy peaks when:",
    sub: "Pick what's most true.",
    options: [
      "It's 3AM and the city is silent",
      "The beat drops and I feel it in my chest",
      "I've got something to prove to someone",
      "Life is going wrong and I need to say it",
    ],
  },
  {
    key: "q3",
    text: "In the game, you are the:",
    sub: "One role. Be honest.",
    options: [
      "Strategist — planning every move",
      "Disruptor — breaking every rule",
      "Artist — letting the work speak",
      "Connector — bringing people together",
    ],
  },
  {
    key: "q4",
    text: "Your biggest competition is:",
    sub: "Who are you really up against?",
    options: [
      "The version of myself from last year",
      "Everyone else in the scene",
      "The industry's gatekeepers",
      "My own doubt",
    ],
  },
  {
    key: "q5",
    text: "Fame for you means:",
    sub: "Define your end goal.",
    options: [
      "Respect from people who know the craft",
      "Cultural impact beyond music",
      "Financial freedom and independence",
      "A platform to say what others can't",
    ],
  },
  {
    key: "q6",
    text: "When your music hits, you want people to feel:",
    sub: "The one emotion you chase.",
    options: [
      "Like something shifted inside them",
      "Like they're not alone",
      "Like they want to move",
      "Like they're watching history",
    ],
  },
  {
    key: "q7",
    text: "Your relationship with the underground:",
    sub: "Where do you stand?",
    options: [
      "That's where real art lives — I stay here",
      "A starting point before going mainstream",
      "Where I test, grow, and sharpen",
      "The underground IS the mainstream to me",
    ],
  },
  {
    key: "q8",
    text: "Your Z Game weapon:",
    sub: "One tool. Choose wisely.",
    options: [
      "Lyricism — every syllable counts",
      "Sound design — the feel is everything",
      "Storytelling — I paint with words",
      "Energy — I command the room",
    ],
  },
];

// Slide 0 = intro (name + phone), slides 1-8 = questions
const TOTAL_SLIDES = 9; // 0..8

// ─── Component ────────────────────────────────────────────────────────────────

export default function CollabPage() {
  const router = useRouter();

  const [slide, setSlide] = useState(0);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [introError, setIntroError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const progress = (slide / (TOTAL_SLIDES - 1)) * 100;
  const currentQ = slide > 0 ? QUESTIONS[slide - 1] : null;
  const currentAnswer = currentQ ? answers[currentQ.key] : null;
  const isLastSlide = slide === TOTAL_SLIDES - 1;

  // ── Navigation ──────────────────────────────────────────────────────────────

  function handleIntroNext() {
    if (!fullName.trim()) { setIntroError("Please enter your full name."); return; }
    if (!phone.trim()) { setIntroError("Please enter your phone number."); return; }
    setIntroError("");
    setSlide(1);
  }

  function selectOption(option: string) {
    if (!currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.key]: option }));
  }

  function goNext() {
    if (!currentAnswer) return;
    if (isLastSlide) {
      handleSubmit();
    } else {
      setSlide(s => s + 1);
    }
  }

  function goBack() {
    setSlide(s => Math.max(0, s - 1));
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setSubmitError("");
    setLoading(true);

    try {
      const res = await fetch("/api/n8n/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), phone: phone.trim(), answers }),
      });

      const data = await res.json();

      if (!res.ok || !data.username || !data.analysis) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        username: data.username,
        analysis: data.analysis,
      });
      if (data.cardUrl) params.set("cardUrl", data.cardUrl);

      router.push(`/success?${params.toString()}`);
    } catch {
      setSubmitError("Connection error. Please check your internet and try again.");
      setLoading(false);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex items-center justify-center px-4 py-8">

      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.18),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_90%,rgba(14,165,233,0.08),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-950/70 pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg">

        {/* Header: logo + progress */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-purple-400">
              Z GAME · Entry Form
            </p>
            <span className="text-[10px] font-black text-white/30 tabular-nums">
              {slide === 0 ? "intro" : `${slide} / ${TOTAL_SLIDES - 1}`}
            </span>
          </div>
          <div className="h-[2px] w-full rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-purple-500 to-sky-500 transition-all duration-500"
              style={{ width: `${slide === 0 ? 0 : progress}%` }}
            />
          </div>
        </div>

        {/* Slide 0 — Intro */}
        {slide === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <div className="mb-8">
              <h1 className="text-3xl font-black leading-tight text-white mb-2">
                Enter the<br />
                <span className="bg-linear-to-r from-purple-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                  Z Game
                </span>
              </h1>
              <p className="text-sm text-white/45 leading-relaxed">
                Tell us who you are. The AI will read your answers and assign your identity in the movement.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleIntroNext()}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/6 text-sm text-white placeholder-white/20 outline-none focus:border-purple-500/50 focus:bg-white/8 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleIntroNext()}
                  placeholder="09xxxxxxxxx"
                  autoComplete="tel"
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/6 text-sm text-white placeholder-white/20 outline-none focus:border-purple-500/50 focus:bg-white/8 transition-colors"
                />
              </div>

              {introError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {introError}
                </p>
              )}

              <button
                onClick={handleIntroNext}
                className="w-full h-12 rounded-xl bg-linear-to-r from-purple-500 to-sky-500 text-white text-sm font-black uppercase tracking-[0.15em] shadow-[0_8px_24px_rgba(139,92,246,0.35)] hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Let's Go
                <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Slides 1-8 — Questions */}
        {slide > 0 && currentQ && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            {/* Question header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center size-7 rounded-lg bg-purple-500/20 border border-purple-500/30 text-[11px] font-black text-purple-400">
                  {slide}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25">
                  of {TOTAL_SLIDES - 1}
                </span>
              </div>
              <h2 className="text-xl font-black text-white leading-snug mb-1">{currentQ.text}</h2>
              <p className="text-xs text-white/35">{currentQ.sub}</p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-7">
              {currentQ.options.map((option, i) => {
                const selected = currentAnswer === option;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(option)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm font-bold leading-snug transition-all duration-150 ${
                      selected
                        ? "border-purple-400/50 bg-purple-500/15 text-white shadow-[0_0_0_1px_rgba(139,92,246,0.25)]"
                        : "border-white/8 bg-white/[0.03] text-white/55 hover:border-white/16 hover:bg-white/[0.07] hover:text-white/80"
                    }`}
                  >
                    <span className={`shrink-0 flex items-center justify-center size-5 rounded-md border text-[10px] font-black mt-0.5 transition-colors ${
                      selected ? "border-purple-400 bg-purple-500/30 text-purple-300" : "border-white/15 text-white/25"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Submit error */}
            {isLastSlide && submitError && (
              <div className="mb-4 px-4 py-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-xs text-rose-400">
                {submitError}
              </div>
            )}

            {/* Nav */}
            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="flex items-center justify-center size-12 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>

              <button
                onClick={goNext}
                disabled={!currentAnswer || loading}
                className={`flex-1 h-12 rounded-xl text-sm font-black uppercase tracking-[0.15em] transition-all duration-200 flex items-center justify-center gap-2 ${
                  currentAnswer && !loading
                    ? isLastSlide
                      ? "bg-linear-to-r from-purple-500 to-sky-500 text-white shadow-[0_8px_24px_rgba(139,92,246,0.35)] hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
                      : "bg-white/8 border border-white/12 text-white hover:bg-white/14"
                    : "bg-white/4 border border-white/6 text-white/20 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Submitting…
                  </>
                ) : isLastSlide ? (
                  <>
                    Submit to Z Game
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                ) : (
                  <>
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="mt-6 text-center text-[10px] text-white/18 tracking-wider">
          Your answers are analysed by the Z AI agent · Results are permanent
        </p>
      </div>
    </main>
  );
}
