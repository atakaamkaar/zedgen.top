"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessContent() {
  const params = useSearchParams();
  const username = params.get("username") ?? "";
  const analysis = params.get("analysis") ?? "";
  const cardUrl = params.get("cardUrl") ?? "";

  async function handleDownload() {
    if (!cardUrl) return;
    try {
      const res = await fetch(cardUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${username || "z-game"}-card.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(cardUrl, "_blank");
    }
  }

  return (
    <main
      dir="rtl"
      lang="fa"
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-[500px] rounded-full bg-violet-900/15 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-16 sm:py-24">

        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.42em] text-purple-400">
            ◆&ensp;Z GAME&ensp;◆
          </p>
          <h1 className="text-4xl font-black uppercase leading-[1.08] tracking-[0.06em] text-white drop-shadow-[0_4px_28px_rgba(168,85,247,0.45)] sm:text-6xl">
            Welcome to the<br />Z-Game
          </h1>
        </div>

        {/* ── Username box ── */}
        {username && (
          <div className="mb-6 rounded-2xl border border-purple-500/30 bg-purple-950/40 px-6 py-5 text-center shadow-[0_0_48px_rgba(168,85,247,0.18)] backdrop-blur-sm">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.32em] text-purple-400">
              یوزرنیم اختصاصی تو
            </p>
            <p className="font-mono text-3xl font-black tracking-widest text-white sm:text-4xl">
              {username}
            </p>
          </div>
        )}

        {/* ── Card image ── */}
        {cardUrl && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_48px_rgba(0,0,0,0.55)]">
            <Image
              src={cardUrl}
              alt="کارت اختصاصی"
              width={800}
              height={600}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        )}

        {/* ── Analysis card ── */}
        {analysis && (
          <div className="mb-6 rounded-2xl border border-white/8 bg-white/5 px-5 py-4 text-right backdrop-blur-sm">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-purple-400">
              تحلیل شخصیت
            </p>
            <p className="text-sm leading-8 text-white/75">{analysis}</p>
          </div>
        )}

        {/* ── Fixed Persian body text ── */}
        <div className="mb-8 rounded-2xl border border-violet-800/30 bg-violet-950/25 px-5 py-4 text-right backdrop-blur-sm">
          <p className="text-sm leading-8 text-white/80">
            کارت اختصاصی‌ات توی جنبش ضد و تحلیل زاد از شخصیتت اینجاست. از همین لحظه به بعد تو یکی از مایی و هر زمان لایقش باشی، زاد برای بازی میاد سراغت. همیشه آماده باش. رشد کن و ضد نسخه قبلی خودت شو.
          </p>
        </div>

        {/* ── Buttons ── */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {cardUrl && (
            <button
              onClick={handleDownload}
              className="flex h-14 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-linear-to-r from-purple-600 via-violet-600 to-fuchsia-600 px-6 font-black text-white shadow-[0_8px_30px_rgba(168,85,247,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_rgba(168,85,247,0.52)] active:scale-95"
            >
              دانلود کارت اختصاصی من
            </button>
          )}
          <Link
            href="/"
            className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/6 px-6 font-black uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white/12 hover:text-white active:scale-95"
          >
            Back to Territory
          </Link>
        </div>

      </div>
    </main>
  );
}
