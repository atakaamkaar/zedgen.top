import Link from "next/link";

const leadershipTeam = [
  { name: "Sssheka", role: "Founder & Dev" },
  { name: "Mh", role: "Chief Operations Officer" },
  { name: "Keshavarz", role: "Audio Content Lead" },
  { name: "4xai", role: "Visual Content Lead" },
  { name: "Ata", role: "Programmer" },
  { name: "Adib", role: "External Relations Manager" },
  { name: "Kallani", role: "Zgen Artist Relations" },
];

const liveGameHosts = [
  { name: "Saghi", show: "Zcipher host" },
  { name: "Fly", show: "Zmagic host" },
  { name: "Keshavarz", show: "Zstudio host" },
  { name: "Y", show: "Zbar host" },
  { name: "Toofaan", show: "Zmagic host" },
];

const hosts = ["Adib", "4xai"];

const artists = ["Dadar", "Caca", "Lucifer", "Sharif", "Papa", "Vruy", "Mani30ya"];

export default function Season1Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 pt-47.5 text-white md:pt-47.5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.22),transparent_34%),linear-gradient(145deg,#020617_0%,#0f172a_50%,#111827_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[38px_38px]" />

      <section className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="w-full max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-100">
            March 2026 - Loading
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.45)] sm:text-6xl">
            Z Season1
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/12 px-3 py-2 text-xs font-black uppercase text-sky-100">
              Last update: 17 May 2026
            </span>
            <span className="rounded-full bg-linear-to-r from-pink-200 via-sky-100 to-blue-300 px-3 py-2 text-xs font-black uppercase text-slate-950">
              Winner reward: 700$
            </span>
          </div>

          <div className="mt-8 grid gap-4">
            <section className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.28)] backdrop-blur">
              <h2 className="mb-4 text-lg font-black uppercase text-white">
                Artists
              </h2>

              <ol className="grid gap-3 sm:grid-cols-2">
                {artists.map((artist, index) => (
                  <li
                    key={artist}
                    className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-lg border border-white/10 bg-slate-950/48 p-3"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-linear-to-br from-pink-200 via-sky-100 to-blue-300 text-sm font-black text-slate-950">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="truncate text-base font-black text-white">
                      {artist}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.28)] backdrop-blur">
              <h2 className="mb-4 text-lg font-black uppercase text-white">
                Leadership Team
              </h2>

              <div className="grid gap-3">
                {leadershipTeam.map((member) => (
                  <div
                    key={member.name}
                    className="rounded-lg border border-white/10 bg-slate-950/42 p-3"
                  >
                    <p className="text-base font-black text-white">
                      {member.name}
                    </p>
                    <p className="text-sm font-bold text-sky-100">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.28)] backdrop-blur">
                <h2 className="mb-4 text-lg font-black uppercase text-white">
                  Live Game Hosts
                </h2>

                <div className="grid gap-3">
                  {liveGameHosts.map((host) => (
                    <div
                      key={`${host.name}-${host.show}`}
                      className="rounded-lg border border-white/10 bg-slate-950/42 p-3"
                    >
                      <p className="text-base font-black text-white">
                        {host.name}
                      </p>
                      <p className="text-sm font-bold text-sky-100">
                        {host.show}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.28)] backdrop-blur">
                <h2 className="mb-4 text-lg font-black uppercase text-white">
                  Hosts
                </h2>

                <div className="flex flex-wrap gap-2">
                  {hosts.map((host) => (
                    <span
                      key={host}
                      className="rounded-full bg-white px-3 py-2 text-sm font-black text-slate-950"
                    >
                      {host}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-linear-to-r from-pink-100 via-sky-100 to-blue-200 p-4 text-slate-950">
                  <p className="text-sm font-black uppercase">Z1 RapGame</p>
                  <p className="mt-2 text-lg font-black leading-6">
                    Live & real street life of Persian Zgen rappers.
                  </p>
                  <p className="mt-3 text-sm font-black uppercase">
                    Coming soon
                  </p>
                </div>
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
