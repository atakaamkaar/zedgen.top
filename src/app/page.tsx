import Image from "next/image";
import Link from "next/link";
import desktopComingSoon from "../../movies/v1 desktop background.jpg";
import mobileComingSoon from "../../z Images/chmob.jpg";
import Countdown from "../components/Countdown";

const seasonButtons = [
  { href: "/season0", label: "Z SEASON0" },
  { href: "/season1", label: "Z SEASON1" },
  { href: "https://survey.porsline.ir/s/XuWiZEMV", label: "Enter the game" },
];

function SeasonButtonGroup({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${className}`}>
      {seasonButtons.map((season) => {
        const isEnterGame = season.label === "Enter the game";

        return (
          <Link
            key={season.href}
            href={season.href}
            className="inline-flex h-14 items-center justify-center rounded-xl px-7 text-base font-black transition duration-300 bg-linear-to-r from-pink-100 via-sky-100 to-blue-200 text-slate-950 shadow-[0_18px_45px_rgba(14,165,233,0.28)] hover:-translate-y-0.5 hover:from-pink-200 hover:via-sky-100 hover:to-blue-300"
          >
            {season.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1F3960] text-white">
      {/* Desktop background — starts 110px below top so the character is visible above the header */}
      <div className="absolute inset-x-0 bottom-0 top-27.5 hidden sm:block">
        <Image
          src={desktopComingSoon}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 38%" }}
        />
      </div>

      {/* Mobile background — same 110px offset */}
      <div className="absolute inset-x-0 bottom-0 top-27.5 sm:hidden">
        <Image
          src={mobileComingSoon}
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 100vw, 0vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-slate-950/88 via-slate-950/18 to-slate-950/5 sm:bg-linear-to-l sm:from-slate-950/76 sm:via-slate-950/18 sm:to-slate-950/5" />

      <section className="relative z-10 mt-27.5 flex min-h-screen items-end px-5 pb-9 pt-47.5 sm:grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:items-center sm:gap-8 sm:px-10 sm:pb-12 sm:pt-47.5 lg:px-16 lg:pt-47.5">
        <div className="hidden max-w-lg self-center sm:block">
          <p className="mt-5 text-3xl font-black uppercase leading-tight text-sky-50 drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)] lg:text-4xl">
            We built something different.
          </p>

          <SeasonButtonGroup />
        </div>

        <div className="w-full max-w-md text-left sm:ml-auto sm:max-w-xl sm:self-start sm:pt-10 sm:text-right lg:pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-100 sm:text-sm">
            ZAD is warming up
          </p>

          <Countdown />

          <SeasonButtonGroup className="sm:hidden" />
        </div>
      </section>
    </main>
  );
}
