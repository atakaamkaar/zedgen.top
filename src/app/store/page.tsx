"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  {
    id: "studio-recording",
    name: "Studio Recording",
    desc: "Professional studio sessions with top-tier engineers and premium gear",
    price: 299,
    category: "Production",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    id: "mixing-mastering",
    name: "Mixing & Mastering",
    desc: "Industry-standard mix and master to make your tracks radio-ready",
    price: 199,
    category: "Production",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    id: "dj-remix",
    name: "DJ Remix",
    desc: "Club-ready custom remixes and edits engineered to move crowds",
    price: 149,
    category: "Production",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    id: "music-video",
    name: "Music Video",
    desc: "Cinematic production from concept to final cut — stories that stick",
    price: 499,
    category: "Visual",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: "cover-art",
    name: "Cover Art",
    desc: "Striking artwork designed to make your release impossible to scroll past",
    price: 99,
    category: "Visual",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: "youtube-setup",
    name: "YouTube Setup",
    desc: "Full channel branding, SEO optimisation, and first-week content strategy",
    price: 149,
    category: "Platform",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  {
    id: "youtube-shorts",
    name: "YouTube Shorts",
    desc: "Vertical short-form content engineered for maximum reach and virality",
    price: 199,
    category: "Platform",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" strokeLinecap="round" />
        <polygon points="9 9 15 12 9 15 9 9" />
      </svg>
    ),
  },
  {
    id: "spotify-promotion",
    name: "Spotify Promotion",
    desc: "Editorial and independent playlist pitching plus algorithm-driven growth",
    price: 299,
    category: "Promo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    id: "soundcloud-promotion",
    name: "SoundCloud Promotion",
    desc: "Organic play growth and community-building on SoundCloud",
    price: 199,
    category: "Promo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a2.5 2.5 0 0 0 0-5c-.17 0-.34.02-.5.05V12a6 6 0 0 1 11.96-.88" />
        <path d="M17 17H7" />
        <path d="M15.5 12a4.5 4.5 0 1 1 0 9H7" />
      </svg>
    ),
  },
  {
    id: "tiktok-promotion",
    name: "TikTok Promotion",
    desc: "Viral campaign strategy, sound seeding, and influencer outreach",
    price: 249,
    category: "Promo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: "artist-branding",
    name: "Artist Branding",
    desc: "Complete visual identity — logo, colour palette, press kit and bio",
    price: 399,
    category: "Brand",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "social-media-management",
    name: "Social Media Management",
    desc: "Monthly management of all channels with a curated content calendar",
    price: 599,
    category: "Brand",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "vip-artist-package",
    name: "VIP Artist Package",
    desc: "The full stack: recording, mixing, video, promotion, and branding in one",
    price: 4999,
    category: "VIP",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <line x1="5" y1="20" x2="19" y2="20" />
      </svg>
    ),
  },
];

const categoryColors: Record<string, string> = {
  Production: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  Visual: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  Platform: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Promo: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  Brand: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  VIP: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const packages = [
  {
    name: "Starter",
    range: "$99–299",
    price: "$199",
    desc: "For independent artists ready to launch their first release",
    features: [
      "1 Studio Session (2 hrs)",
      "Cover Art Design",
      "1 Platform Setup",
      "Basic Mix & Master",
    ],
    cta: "Get Started",
    accent: "from-slate-700 to-slate-800",
    highlight: false,
  },
  {
    name: "Growth",
    range: "$499–999",
    price: "$699",
    desc: "For artists serious about building a real, loyal audience",
    features: [
      "3 Studio Sessions",
      "Cover Art + Branding Kit",
      "YouTube + Spotify Setup",
      "Professional Mix & Master",
      "30-Day Social Strategy",
    ],
    cta: "Choose Growth",
    accent: "from-green-500 to-green-400",
    highlight: true,
  },
  {
    name: "Fame",
    range: "$1,999+",
    price: "$2,499",
    desc: "Full-stack artist development for rapid, measurable growth",
    features: [
      "10 Studio Sessions",
      "Music Video Production",
      "All Platform Setup + SEO",
      "Spotify + TikTok Campaign",
      "3 Months Social Management",
      "Complete Artist Branding",
    ],
    cta: "Go for Fame",
    accent: "from-slate-700 to-slate-800",
    highlight: false,
  },
  {
    name: "VIP",
    range: "$5,000+",
    price: "$7,500",
    desc: "The complete superstar package — unlimited access, zero limits",
    features: [
      "Unlimited Studio (1 month)",
      "Full Music Video + BTS",
      "All Platforms Setup & SEO",
      "6-Month Multi-Platform Promo",
      "6 Months Social Management",
      "Full Branding & Press Kit",
      "Priority 24/7 Support",
    ],
    cta: "Go VIP",
    accent: "from-slate-700 to-slate-800",
    highlight: false,
  },
];

const faqs = [
  {
    q: "How do I get started after purchasing a service?",
    a: "Our team reaches out within 24 hours to schedule your first session and gather any assets we need. Everything runs through your dedicated project manager.",
  },
  {
    q: "Can I customise a package to fit my needs?",
    a: "Absolutely. All packages are fully modular — contact us to swap services, add extras, or build a completely bespoke bundle.",
  },
  {
    q: "How long does delivery take?",
    a: "Cover Art and Mixing typically take 3–5 business days. Music Videos and full packages range from 2–4 weeks depending on scope and revisions.",
  },
  {
    q: "Do you work with independent artists or only signed acts?",
    a: "We work with everyone — bedroom producers, SoundCloud artists, independent acts, and major label talent across all genres.",
  },
  {
    q: "What does Spotify Promotion actually include?",
    a: "We pitch your track to editorial and independent playlist curators, run targeted streaming ads, and provide a weekly analytics report for the campaign duration.",
  },
  {
    q: "Is there a refund policy?",
    a: "100% satisfaction guarantee. If we can't deliver to the agreed scope after revisions, we'll issue a full refund — no questions asked.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: typeof services[0] }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: service.id, name: service.name, price: service.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/16 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* Icon + category */}
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center size-11 rounded-xl bg-white/8 border border-white/10 text-white/70 group-hover:text-amber-400 transition-colors duration-300">
          {service.icon}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border ${categoryColors[service.category]}`}>
          {service.category}
        </span>
      </div>

      {/* Name + desc */}
      <div className="flex-1">
        <h3 className="text-sm font-black text-white leading-snug">{service.name}</h3>
        <p className="mt-1.5 text-xs text-white/45 leading-relaxed">{service.desc}</p>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/6">
        <div>
          <span className="text-xl font-black text-amber-400">${service.price.toLocaleString()}</span>
          {service.id === "social-media-management" && (
            <span className="text-[10px] text-white/30 ml-1">/mo</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.12em] transition-all duration-200 ${
            added
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
              : "bg-amber-400/12 border border-amber-400/25 text-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:shadow-[0_6px_20px_rgba(245,158,11,0.35)]"
          }`}
        >
          {added ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: typeof packages[0] }) {
  const { addItem } = useCart();
  const id = `pkg-${pkg.name.toLowerCase()}`;

  const handleAdd = () => {
    const priceNum = parseInt(pkg.price.replace(/[$,]/g, ""), 10);
    addItem({ id, name: `${pkg.name} Package`, price: priceNum });
  };

  return (
    <div className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
      pkg.highlight
        ? "border-green-400/40 bg-linear-to-b from-green-400/8 to-green-400/3 shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_20px_60px_rgba(34,197,94,0.15)]"
        : "border-white/10 bg-white/4 hover:border-white/18"
    }`}>
      {pkg.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-green-400 text-slate-950 text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_4px_16px_rgba(34,197,94,0.45)]">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4">
        <p className={`text-[9px] font-black uppercase tracking-[0.28em] mb-1 ${pkg.highlight ? "text-green-400" : "text-white/35"}`}>
          {pkg.range}
        </p>
        <h3 className="text-2xl font-black text-white">{pkg.name}</h3>
        <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{pkg.desc}</p>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-black text-white">{pkg.price}</span>
      </div>

      <ul className="space-y-2.5 flex-1 mb-7">
        {pkg.features.map(f => (
          <li key={f} className="flex items-start gap-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`shrink-0 mt-0.5 ${pkg.highlight ? "text-green-400" : "text-white/40"}`}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-xs text-white/60 leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleAdd}
        className={`w-full py-3 rounded-xl text-sm font-black uppercase tracking-[0.14em] transition-all duration-200 ${
          pkg.highlight
            ? "bg-linear-to-r from-green-500 to-green-400 text-slate-950 shadow-[0_6px_24px_rgba(34,197,94,0.4)] hover:shadow-[0_10px_32px_rgba(34,197,94,0.55)] hover:-translate-y-0.5"
            : "bg-white/8 border border-white/12 text-white/70 hover:bg-white/14 hover:text-white"
        }`}
      >
        {pkg.cta}
      </button>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-white/6 last:border-0 transition-colors ${open ? "border-white/10" : ""}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-bold text-white/75 leading-snug group-hover:text-white transition-colors">
          {q}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round"
          className={`shrink-0 mt-0.5 text-white/30 transition-transform duration-200 ${open ? "rotate-45 text-amber-400" : ""}`}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 pb-5" : "max-h-0"}`}>
        <p className="text-sm text-white/45 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StorePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-36 pb-24 px-5 md:px-10 lg:px-16">
        {/* Background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_-10%,rgba(245,158,11,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_80%,rgba(14,165,233,0.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(2,6,23,1)_100%)]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/8 mb-8">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-400">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
              Premium Music Services
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="text-white">Build Your</span>
            <br />
            <span className="bg-linear-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Music Empire
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
            From studio sessions to viral campaigns — every service you need to go from unknown to unforgettable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-linear-to-r from-amber-500 to-yellow-400 text-slate-950 text-sm font-black uppercase tracking-[0.15em] shadow-[0_8px_32px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.55)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Services
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href="#packages"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/12 bg-white/6 text-white/70 text-sm font-black uppercase tracking-[0.15em] hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              View Packages
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-white/6">
            {[
              { value: "500+", label: "Artists Served" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "24hr", label: "Response Time" },
              { value: "13", label: "Core Services" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-amber-400">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="px-5 md:px-10 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-3">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Services</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map(s => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="px-5 md:px-10 lg:px-16 py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-3">Bundles</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Pricing Packages</h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Complete bundles designed to take you further for less. All packages include full project management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {packages.map(pkg => (
              <PackageCard key={pkg.name} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="px-5 md:px-10 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                    <line x1="5" y1="20" x2="19" y2="20" />
                  </svg>
                ),
                title: "Industry Professionals",
                desc: "Every service is delivered by verified industry veterans — not freelancers, not bots.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: "Fast Turnaround",
                desc: "Most services delivered in 3–5 days. Rush options available for every service.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "100% Guarantee",
                desc: "Not satisfied? We revise until you are — or we refund you in full. Simple.",
              },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-start gap-4 p-6 rounded-2xl border border-white/8 bg-white/3">
                <div className="flex items-center justify-center size-11 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{item.title}</h3>
                  <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-5 md:px-10 lg:px-16 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-3">Got Questions?</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">FAQ</h2>
          </div>

          <div className="divide-y divide-white/0">
            {faqs.map(faq => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-5 md:px-10 lg:px-16 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(245,158,11,0.08),transparent_65%)]" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Level Up?
          </h2>
          <p className="text-sm text-white/45 mb-10 leading-relaxed">
            Pick a service, build your cart, and our team will be in touch within 24 hours to kick things off.
          </p>
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-linear-to-r from-amber-500 to-yellow-400 text-slate-950 text-sm font-black uppercase tracking-[0.15em] shadow-[0_8px_32px_rgba(245,158,11,0.4)] hover:shadow-[0_14px_44px_rgba(245,158,11,0.55)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Building Your Cart
          </a>
        </div>
      </section>

    </main>
  );
}
