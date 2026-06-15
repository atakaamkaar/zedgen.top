import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, phone: true, createdAt: true },
  });

  if (!user) redirect("/login");

  const joinedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* Background: radial glow + grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(139,92,246,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_80%,rgba(14,165,233,0.08),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-950/80 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 pt-32 pb-24 space-y-8">

        {/* Greeting */}
        <div className="mb-2">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-purple-400 mb-2">Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Welcome back,{" "}
            <span className="bg-linear-to-r from-purple-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              {user.name.split(" ")[0]}
            </span>
          </h1>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_64px_rgba(0,0,0,0.4)] p-7">
          <div className="flex items-center gap-3 mb-7">
            {/* Avatar initials */}
            <div className="flex items-center justify-center size-12 rounded-xl bg-linear-to-br from-purple-500/30 to-sky-500/30 border border-white/10 text-lg font-black text-white/80 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-black text-white">{user.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 mt-0.5">Z Member</p>
            </div>
            {/* Verified badge */}
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">Verified</span>
            </div>
          </div>

          <div className="space-y-0 divide-y divide-white/[0.06]">
            <DetailRow
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
              label="Full Name"
              value={user.name}
            />
            <DetailRow
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
              label="Email"
              value={user.email}
            />
            <DetailRow
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              }
              label="Phone"
              value={user.phone ?? "—"}
            />
            <DetailRow
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              label="Member Since"
              value={joinedDate}
            />
          </div>
        </div>

        {/* Z Services section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400 mb-1">Marketplace</p>
              <h2 className="text-xl font-black text-white">Z Services</h2>
            </div>
            <Link
              href="/store"
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/40 hover:text-white transition-colors"
            >
              View All
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ServiceCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              }
              name="Studio Recording"
              price="$299"
              accent="purple"
            />
            <ServiceCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
                  <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              }
              name="Spotify Promotion"
              price="$299"
              accent="sky"
            />
            <ServiceCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                  <line x1="5" y1="20" x2="19" y2="20" />
                </svg>
              }
              name="VIP Artist Package"
              price="$5,000+"
              accent="amber"
            />
          </div>
        </div>

        {/* CTA banner */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-500/10 via-sky-500/5 to-purple-500/10 p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(139,92,246,0.12),transparent_65%)]" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-400 mb-2">Your next move</p>
              <h3 className="text-xl font-black text-white leading-snug">
                Ready to level up?
              </h3>
              <p className="text-sm text-white/40 mt-1.5 max-w-xs leading-relaxed">
                From studio sessions to viral campaigns — everything you need is in the store.
              </p>
            </div>
            <Link
              href="/store"
              className="inline-flex items-center justify-center gap-2 shrink-0 px-7 py-3.5 rounded-xl bg-linear-to-r from-purple-500 to-sky-500 text-white text-sm font-black uppercase tracking-[0.15em] shadow-[0_8px_28px_rgba(139,92,246,0.4)] hover:shadow-[0_12px_36px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Go to Store
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sign out */}
        <div className="pt-2">
          <LogoutButton />
        </div>

      </div>
    </main>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2.5 text-white/35 shrink-0">
        {icon}
        <span className="text-xs font-bold text-white/40">{label}</span>
      </div>
      <span className="text-sm font-bold text-white/80 text-right truncate max-w-[55%]">{value}</span>
    </div>
  );
}

function ServiceCard({
  icon,
  name,
  price,
  accent,
}: {
  icon: React.ReactNode;
  name: string;
  price: string;
  accent: "purple" | "sky" | "amber";
}) {
  const accentMap = {
    purple: {
      icon: "text-purple-400 bg-purple-400/10 border-purple-400/20",
      price: "text-purple-400",
      btn: "border-purple-400/25 bg-purple-400/10 text-purple-300 hover:bg-purple-400 hover:text-white hover:border-purple-400",
    },
    sky: {
      icon: "text-sky-400 bg-sky-400/10 border-sky-400/20",
      price: "text-sky-400",
      btn: "border-sky-400/25 bg-sky-400/10 text-sky-300 hover:bg-sky-400 hover:text-slate-950 hover:border-sky-400",
    },
    amber: {
      icon: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      price: "text-amber-400",
      btn: "border-amber-400/25 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400",
    },
  };

  const c = accentMap[accent];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-5 hover:border-white/14 hover:bg-white/[0.07] hover:-translate-y-0.5 transition-all duration-200">
      <div className={`flex items-center justify-center size-10 rounded-xl border ${c.icon}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-black text-white leading-snug">{name}</p>
        <p className={`text-base font-black mt-1 ${c.price}`}>{price}</p>
      </div>
      <Link
        href="/store"
        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-[0.16em] transition-all duration-200 ${c.btn}`}
      >
        Get Started
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}
