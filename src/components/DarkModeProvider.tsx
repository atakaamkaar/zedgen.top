"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export default function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <>
      {/* Page content — rendered without any filter so position:fixed children
          are never trapped in a stacking context. Dark mode is handled by the
          overlay div below, which sits above content but below all fixed UI. */}
      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
        {children}
      </div>

      {/* Dark mode overlay — pointer-events:none so it never blocks clicks.
          z-40 keeps it below the header (z-50), mobile menu (z-70), and
          the support / toggle buttons (z-80 / z-90). */}
      <div
        className="pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-500"
        style={{ opacity: isDark ? 0.45 : 0 }}
      />

      {/* Toggle button — compact icon-only pill */}
      <button
        onClick={() => setIsDark((v) => !v)}
        aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
        className={`fixed bottom-6 left-5 z-50 flex size-9 items-center justify-center rounded-full cursor-pointer transition-all duration-300 select-none active:scale-95 hover:scale-110 ${isDark ? "bg-white shadow-[0_4px_16px_rgba(255,255,255,0.2)]" : "bg-black/70 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"}`}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </>
  );
}

function SunIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
