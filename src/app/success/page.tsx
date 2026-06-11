"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import cardImage from "../../../z Images/bazargani kart.jpg";
import finalCarddesk from "../../../z Images/chdesk.jpg";
import finalCardmob from "../../../z Images/chmob.jpg";

export default function SuccessPage() {
  const router = useRouter();

  function handleDownload() {
    window.setTimeout(() => {
      router.push("/");
    }, 700);
  }

  return (
    <main
      dir="rtl"
      lang="fa"
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-100 via-blue-50 to-gray-100 px-4 py-8 text-slate-900 sm:px-6"
    >
      <section className="w-full max-w-xl space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 text-center shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-bold text-sky-700">ورود موفق</p>
          <h1 className="text-2xl font-bold leading-10 text-slate-950 sm:text-3xl">
            WELCOME TO THE Z GAME
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            بعد از دانلود کارت، به مرحله ارسال اطلاعات منتقل می‌شوید.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Image
            src={finalCardmob}
            alt="کارت بازرگانی"
            className="h-auto w-full"
            priority
          />
        </div>

        <a
          href={finalCardmob.src}
          download="bazargani-kart.jpg"
          onClick={handleDownload}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-linear-to-r from-sky-400 to-blue-600 px-6 font-bold text-white shadow-[0_12px_30px_rgba(14,165,233,0.26)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-200"
        >
          دانلود کارت
        </a>
      </section>
    </main>
  );
}
