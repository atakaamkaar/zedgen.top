import Image from "next/image";
import Link from "next/link";
import desktopComingSoon from "../../movies/v1 desktop background.jpg";
import mobileComingSoon from "../../movies/v1 mobile background.jpg";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Images */}
      <Image
        src={desktopComingSoon}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover sm:block"
        style={{ objectPosition: "center 30%" }}
      />

      <Image
        src={mobileComingSoon}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center sm:hidden"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/88 via-slate-950/18 to-slate-950/5 sm:bg-linear-to-l sm:from-slate-950/76 sm:via-slate-950/18 sm:to-slate-950/5" />

      {/* Content Section */}
      <section className="relative z-10 flex min-h-screen items-end px-5 pb-9 pt-24 sm:grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:items-center sm:gap-8 sm:px-10 sm:pb-12 sm:pt-20 lg:px-16">
        {/* Desktop Left Side */}
        <div className="hidden max-w-lg self-center sm:block">
          <p className="text-4xl font-black uppercase leading-tight text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)] lg:text-5xl">
            &ldquo;Coming soon&rdquo;
            <br />
            is boring.
          </p>
          <p className="mt-5 text-3xl font-black uppercase leading-tight text-sky-50 drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)] lg:text-4xl">
            We built something different.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-white px-7 text-base font-black text-slate-950 shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-50"
          >
            Continue with OTP
          </Link>
        </div>

        {/* Mobile + Right Side */}
        <div className="w-full max-w-md text-left sm:ml-auto sm:max-w-xl sm:self-start sm:pt-10 sm:text-right lg:pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-100 sm:text-sm">
            ZAD is warming up
          </p>

          <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.38)] sm:text-6xl lg:text-7xl">
            You found us too early.
          </h1>

          <p className="mt-5 max-w-sm text-2xl font-black uppercase leading-tight text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)] sm:hidden">
            &ldquo;Coming soon&rdquo;
            <br />
            is boring.
          </p>

          <p className="mt-5 max-w-sm text-xl font-black uppercase leading-tight text-sky-50 drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)] sm:hidden">
            We built something different.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-white px-7 text-base font-black text-slate-950 shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-50 sm:hidden"
          >
            Continue with OTP
          </Link>
        </div>
      </section>
    </main>
  );
}
