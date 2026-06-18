import Link from "next/link";

const leadershipTeam = ["Sssheka", "Plus", "Fotokad", "Red3y3s", "Metolin"];

const artists = [
  { name: "Toofan", code: "Z01", track: "Crysal" },
  { name: "Omega", code: "Z02", track: "Moshtarek" },
  { name: "Tiger", code: "Z03", track: "Ghost" },
  { name: "Re3y3s x Arsh", code: "Z04", track: "Coming Soon" },
  { name: "Plus", code: "Z05", track: "Stesnaeii" },
];

const guestArtists = [
  "Rawmin",
  "Moghatell",
  "Atom",
  "Lucifer",
  "AmirHo3in",
  "Mehdiii",
  "Viper",
  "MatinZero",
  "Hani",
  "Tvc",
];

export default function Season0Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 pt-47.5 text-white md:pt-47.5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.22),transparent_34%),linear-gradient(145deg,#020617_0%,#0f172a_50%,#111827_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[38px_38px]" />

      <section className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="w-full max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-100">
            May 2024 - April 2025
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.45)] sm:text-6xl">
            Z Season0
          </h1>

          <div className="mt-8 grid gap-4">
            <section className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.28)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black uppercase text-white">
                  Leadership Team
                </h2>
                <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-black text-sky-100">
                  {leadershipTeam.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {leadershipTeam.map((member) => (
                  <span
                    key={member}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.28)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black uppercase text-white">
                  Artists
                </h2>
                <span className="rounded-full bg-linear-to-r from-pink-200 via-sky-100 to-blue-300 px-3 py-1 text-xs font-black text-slate-950">
                  {artists.length}
                </span>
              </div>

              <ol className="grid gap-3">
                {artists.map((artist) => (
                  <li
                    key={artist.code}
                    className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-lg border border-white/10 bg-slate-950/48 p-3"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-linear-to-br from-pink-200 via-sky-100 to-blue-300 text-sm font-black text-slate-950">
                      {artist.code}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-base font-black text-white">
                        {artist.name}
                      </p>
                      <p className="truncate text-sm font-bold text-sky-100">
                        {artist.track}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.28)] backdrop-blur">
              <h2 className="mb-4 text-lg font-black uppercase text-white">
                Guest Artists
              </h2>

              <div className="flex flex-wrap gap-2">
                {guestArtists.map((artist) => (
                  <span
                    key={artist}
                    className="rounded-full bg-white px-3 py-2 text-sm font-black text-slate-950"
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        <Link
          href="/"
          className="mt-9 inline-flex h-14 items-center justify-center rounded-xl bg-linear-to-r from-pink-100 via-sky-100 to-blue-200 px-7 text-base font-black text-slate-950 shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:from-pink-200 hover:via-sky-100 hover:to-blue-300"
        >
          Return
        </Link>
      </section>
    </main>
  );
}
