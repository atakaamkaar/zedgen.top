"use client";

import { useState } from "react";

const maxCharacters = 500;

export default function SurveyPage() {
  const [text, setText] = useState("");

  return (
    <main
      dir="rtl"
      lang="fa"
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-gray-100 px-4 py-8 text-slate-900 sm:px-6"
    >
      <section className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
        <div className="mb-7 space-y-3 text-center">
          <p className="text-sm font-bold text-sky-700">مرحله پایانی</p>
          <h1 className="text-2xl font-bold leading-10 text-slate-950 sm:text-3xl">
            اطلاعات تکمیلی
          </h1>
          <p className="mx-auto max-w-md text-sm leading-7 text-slate-600">
            متن کوتاه خود را وارد کنید و در صورت نیاز رزومه یا فایل رسانه‌ای
            خود را بارگذاری کنید.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="entry"
                className="text-sm font-semibold text-slate-700"
              >
                متن شما
              </label>
              <span className="text-xs font-medium text-slate-500">
                {text.length}/{maxCharacters}
              </span>
            </div>

            <textarea
              id="entry"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={maxCharacters}
              placeholder="متن خود را اینجا بنویسید..."
              className="min-h-40 w-full resize-none rounded-2xl border border-slate-200 bg-white p-5 text-right text-base leading-8 text-slate-900 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="resume"
              className="block text-sm font-semibold text-slate-700"
            >
              بارگذاری فایل
            </label>

            <input
              id="resume"
              type="file"
              aria-label="Upload your resume"
              accept=".pdf,.doc,.docx,.txt,.rtf,image/*,audio/*,video/*,.mp3,.mp4"
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm file:ml-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-sky-400 file:to-blue-600 file:px-4 file:py-2 file:font-bold file:text-white focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
            />

            <p className="text-xs leading-6 text-slate-500">
              Upload your resume. فایل‌های رزومه، تصویر، MP3، MP4 و سایر
              فایل‌های صوتی یا ویدیویی قابل انتخاب هستند.
            </p>
          </div>

          <button
            type="submit"
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 px-5 font-bold text-white shadow-[0_12px_30px_rgba(14,165,233,0.26)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            ارسال
          </button>
        </form>
      </section>
    </main>
  );
}
