"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    // POST to the signout route which clears the cookie and redirects.
    // We use a plain fetch + manual redirect so the full-page navigation
    // ensures all in-memory client state is wiped along with the cookie.
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/8 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-rose-400 transition-all hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        "Signing out…"
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </>
      )}
    </button>
  );
}
