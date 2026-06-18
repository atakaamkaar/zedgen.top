"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const navLeft = [
  { href: "/collab", label: "Contact Us" },
  { href: "https://survey.porsline.ir/s/XuWiZEMV", label: "Tests" },
  { href: "/contact", label: "Contact" },
];

const navRight = [
  { href: "/store", label: "Store" },
  { href: "/login", label: "Login" },
];

const navAll = [...navLeft, ...navRight];
const navMobile = [navRight[1], ...navLeft, navRight[0]];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count, setIsOpen: openCart } = useCart();

  return (
    <>
      {/* Floating glass card header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 md:px-6 lg:px-10">
        <div className="rounded-2xl border border-[#2a4a7f]/50 bg-[#1F3455]/70 px-5 py-3 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_6px_36px_rgba(0,0,0,0.36)] backdrop-blur-xl md:px-7 lg:px-9">

          {/* ── Desktop & Tablet ── */}
          <nav className="hidden md:flex items-center justify-between">

            {/* Task 1: Logo moved to the left */}
            <Link href="/" className="group flex flex-col items-center gap-0.5 shrink-0">
              <div className="size-7 lg:size-8 overflow-hidden rounded-xl ring-1 ring-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Z"
                  width={40}
                  height={40}
                  priority
                  className="size-full object-cover"
                />
              </div>
              {/* Task 4: refined logo label */}
              <span className="text-[7px] font-black uppercase tracking-[0.36em] text-white/40 transition-colors duration-200 group-hover:text-white/65">
                Z&thinsp;GAME
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {navAll.map((item, i) => (
                  <div key={item.href} className="flex items-center">
                    {i > 0 && (
                      <span className="mx-5 text-[5px] text-white/20 select-none">◆</span>
                    )}
                    <Link
                      href={item.href}
                      className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Cart icon */}
              <button
                onClick={() => openCart(true)}
                aria-label="Open cart"
                className="relative ml-3 flex items-center justify-center size-9 rounded-xl border border-white/15 bg-white/8 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.66 16h9.72a2 2 0 0 0 1.96-1.61L23 6H6" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-4 rounded-full bg-amber-400 text-[9px] font-black text-slate-950 leading-none">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* ── Mobile bar ── */}
          <div className="flex md:hidden items-center justify-between">
            <Link href="/" className="group">
              <div className="size-9 overflow-hidden rounded-xl ring-1 ring-white/20 shadow-lg transition-transform duration-200 group-hover:scale-105">
                <Image src="/logo.png" alt="Z" width={36} height={36} className="size-full object-cover" />
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {/* Mobile cart icon */}
              <button
                onClick={() => openCart(true)}
                aria-label="Open cart"
                className="relative flex items-center justify-center size-9 rounded-xl border border-white/15 bg-white/10 text-white/60 transition-colors hover:bg-white/18 hover:text-white"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.66 16h9.72a2 2 0 0 0 1.96-1.61L23 6H6" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-4 rounded-full bg-amber-400 text-[9px] font-black text-slate-950 leading-none">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              <button
                onClick={() => setOpen(true)}
                aria-label="Open navigation menu"
                className="flex flex-col justify-center items-center gap-1.25 size-9 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/18"
              >
                <span className="block h-[1.5px] w-4.5 rounded-full bg-white" />
                <span className="block h-[1.5px] w-4.5 rounded-full bg-white" />
                <span className="block h-[1.5px] w-4.5 rounded-full bg-white" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ── Mobile Mega Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-70 transition-all duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-slate-950/97 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(14,165,233,0.11),transparent_65%)]" />

        <div className="relative flex flex-col h-full">
          <div className="flex items-center justify-between px-6 pt-5">
            <Link href="/" onClick={() => setOpen(false)} className="group">
              <div className="size-9 overflow-hidden rounded-xl ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
                <Image src="/logo.png" alt="Z" width={36} height={36} className="size-full object-cover" />
              </div>
            </Link>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/55 transition-colors hover:bg-white/18 hover:text-white"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col justify-center flex-1 px-8 gap-1">
            {navMobile.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-5 py-5 w-full border-b border-white/[0.07] last:border-0"
              >
                <span className="text-[11px] font-black text-white/22 tracking-widest tabular-nums min-w-5.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl font-black uppercase tracking-[0.08em] text-white/60 transition-colors duration-200 group-hover:text-white">
                  {item.label}
                </span>
                <svg className="ml-auto text-white/15 transition-colors group-hover:text-white/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ))}
          </nav>

          <div className="px-8 pb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/18">
              Z GAME © 2026
            </p>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
