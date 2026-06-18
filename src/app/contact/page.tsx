const contacts = [
  {
    platform: "Telegram",
    handle: "@zedgenofficial",
    label: "Open Telegram",
    href: "https://t.me/zedgenofficial",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.67l-2.94-.918c-.638-.203-.653-.638.136-.944l11.5-4.434c.535-.194 1.002.131.828.847z" />
      </svg>
    ),
    accent: "sky",
  },
  {
    platform: "Instagram",
    handle: "@zed.gen",
    label: "Open Instagram",
    href: "https://instagram.com/zed.gen",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
    accent: "rose",
  },
  {
    platform: "WhatsApp",
    handle: "+98 992 427 8163",
    label: "Open WhatsApp",
    href: "https://wa.me/989924278163",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.335-1.505A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.066 16.62c-.253.711-1.476 1.36-2.03 1.407-.553.046-1.072.265-3.615-.754-3.034-1.222-4.97-4.324-5.12-4.524-.148-.2-1.21-1.608-1.21-3.067 0-1.46.764-2.176 1.034-2.472.27-.296.59-.37.787-.37.197 0 .394.002.566.01.182.008.426-.069.666.508.25.597.847 2.064.92 2.213.073.15.122.323.024.52-.098.197-.147.32-.294.492-.147.173-.309.387-.44.52-.147.147-.3.307-.13.602.171.295.762 1.258 1.636 2.038 1.123 1.001 2.07 1.31 2.364 1.458.295.147.466.123.638-.074.172-.197.736-.857.933-1.152.197-.295.394-.246.664-.148.27.099 1.714.808 2.008.956.295.147.492.221.566.344.074.123.074.71-.18 1.42z" />
      </svg>
    ),
    accent: "green",
  },
  {
    platform: "Direct Call",
    handle: "+98 992 427 8163",
    label: "Call Now",
    href: "tel:+989924278163",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z" />
      </svg>
    ),
    accent: "white",
  },
];

const accentMap: Record<string, { icon: string; glow: string; btn: string }> = {
  sky: {
    icon: "text-sky-400",
    glow: "bg-sky-400/10 border-sky-400/20",
    btn: "bg-sky-500/15 border border-sky-400/30 text-sky-300 hover:bg-sky-500/25 hover:text-sky-200",
  },
  rose: {
    icon: "text-rose-400",
    glow: "bg-rose-400/10 border-rose-400/20",
    btn: "bg-rose-500/15 border border-rose-400/30 text-rose-300 hover:bg-rose-500/25 hover:text-rose-200",
  },
  green: {
    icon: "text-green-400",
    glow: "bg-green-400/10 border-green-400/20",
    btn: "bg-green-500/15 border border-green-400/30 text-green-300 hover:bg-green-500/25 hover:text-green-200",
  },
  white: {
    icon: "text-white/70",
    glow: "bg-white/6 border-white/12",
    btn: "bg-white/8 border border-white/15 text-white/70 hover:bg-white/14 hover:text-white",
  },
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(14,165,233,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,rgba(14,165,233,0.06),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pt-24 pb-16 md:pt-28">

        {/* Title */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.36em] text-sky-400">
            Z GAME · Get in Touch
          </p>
          <h1 className="text-5xl font-black leading-none tracking-tight text-white md:text-6xl">
            Find Us
          </h1>
          <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-xs mx-auto">
            Reach us on any platform — we&apos;re active across all of them.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {contacts.map((c) => {
            const a = accentMap[c.accent];
            return (
              <div
                key={c.platform}
                className="flex flex-col gap-5 rounded-2xl border border-white/8 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/14"
              >
                {/* Icon bubble */}
                <div className={`flex size-12 items-center justify-center rounded-xl border ${a.glow} ${a.icon}`}>
                  {c.icon}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                    {c.platform}
                  </p>
                  <p className="text-base font-black text-white">{c.handle}</p>
                </div>

                {/* Action button */}
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-11 w-full items-center justify-center rounded-xl text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-0.5 ${a.btn}`}
                >
                  {c.label}
                  <svg className="ml-2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>

      </section>
    </main>
  );
}
