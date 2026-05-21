import Link from "next/link";

export default function SurveyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-gray-100 px-4 py-8 text-slate-900 sm:px-6">
      <div className="w-full max-w-2xl space-y-8 rounded-3xl border border-white/40 bg-white/55 p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
            Final step
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">Survey Form</h1>

          <p className="mx-auto max-w-sm text-sm leading-6 text-gray-600">
            Please answer the following questions.
          </p>
        </div>

        <form className="space-y-6 text-center">
          <div className="space-y-3">
            <label className="font-medium text-slate-700">
              What is your biggest career goal?
            </label>

            <textarea
              className="w-full min-h-32 rounded-2xl border border-gray-200 bg-white/70 p-5 text-center text-slate-900 shadow-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200"
              placeholder="Write your answer..."
            />
          </div>

          <div className="space-y-3">
            <label className="font-medium text-slate-700">
              Upload Your Resume
            </label>

            <input
              type="file"
              className="w-full rounded-2xl border border-gray-200 bg-white/70 p-4 text-center text-slate-700 shadow-sm transition-all duration-300 file:mr-4 file:rounded-2xl file:border-0 file:bg-gradient-to-r file:from-sky-400 file:to-blue-500 file:px-4 file:py-2 file:font-semibold file:text-white focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200"
            />
          </div>

          <Link href="/success">
            <button
              type="button"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 py-4 font-bold text-white shadow-[0_8px_24px_rgba(14,165,233,0.24)] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              Submit Survey
            </button>
          </Link>
        </form>
      </div>
    </main>
  );
}
