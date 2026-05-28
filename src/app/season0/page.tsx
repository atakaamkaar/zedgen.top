import Link from "next/link";

const seasonText = `[Z-Season0]🧿
May2024-April2025

🧢Z0 LeadershipTeam:5
Sssheka
Plus
Fotokad
Red3y3s
Metolin

🏴‍☠️Z0 Artists:5
Toofan - Z01=Crysal
Omega - Z02=Moshtarek
Tiger -  Z03=Ghost
Re3y3s x Arsh - Z04=ComingSoon
Plus - Z05=Stesnaeii

Z0 Guest Artists:
Rawmin + Moghatell + Atom + Lucifer + AmirHo3in
Mehdiii + Viper + MatinZero + Hani + Tvc`;

export default function Season0Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.22),transparent_34%),linear-gradient(145deg,#020617_0%,#0f172a_50%,#111827_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:38px_38px]" />

      <section className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <pre className="w-full max-w-2xl whitespace-pre-wrap text-left font-sans text-base font-black leading-7 text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.45)] sm:text-xl sm:leading-8">
          {seasonText}
        </pre>

        <Link
          href="/"
          className="mt-9 inline-flex h-14 items-center justify-center rounded-xl bg-white px-7 text-base font-black text-slate-950 shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-50"
        >
          Return
        </Link>
      </section>
    </main>
  );
}
