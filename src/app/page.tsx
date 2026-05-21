
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-gray-100 px-4 py-8 text-slate-900 sm:px-6">
      <div className="w-full max-w-2xl space-y-8 rounded-3xl border border-white/40 bg-white/55 p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
            Gen Z Survey
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Share what matters next.
          </h1>

          <p className="mx-auto max-w-md text-sm leading-7 text-gray-600 sm:text-base">
            Help us understand your generation better.
          </p>
        </div>

        <Link href="/login">
          <button className="rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-[0_8px_24px_rgba(14,165,233,0.24)] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sky-200">
            Start Survey
          </button>
        </Link>
      </div>
    </main>
  );
}
