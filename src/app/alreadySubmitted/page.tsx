export default function AlreadySubmittedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-gray-100 px-4 py-8 text-slate-900 sm:px-6">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-white/40 bg-white/55 p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
        <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
          Already done
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Already Submitted</h1>

        <p className="text-sm leading-7 text-gray-600 sm:text-base">
          This phone number has already completed the survey.
        </p>
      </div>
    </main>
  );
}
