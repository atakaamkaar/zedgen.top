"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

const PROMO_CODES: Record<string, number> = {
  ZMUSIC: 0.10,
  VIP2026: 0.20,
  ZFAME: 0.15,
};

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, count, isOpen, setIsOpen } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState("");

  const discountAmount = total * discount;
  const finalTotal = total - discountAmount;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoApplied(code);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code.");
      setDiscount(0);
      setPromoApplied("");
    }
  };

  const removePromo = () => {
    setDiscount(0);
    setPromoApplied("");
    setPromoInput("");
    setPromoError("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[90] h-full w-full max-w-[420px] bg-slate-950 border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.66 16h9.72a2 2 0 0 0 1.96-1.61L23 6H6" />
            </svg>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Your Cart
            </span>
            {count > 0 && (
              <span className="flex items-center justify-center size-5 rounded-full bg-amber-400/20 text-[10px] font-black text-amber-400">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="size-16 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/25">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.66 16h9.72a2 2 0 0 0 1.96-1.61L23 6H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white/40">Your cart is empty</p>
                <p className="text-xs text-white/20 mt-1">Add a service to get started</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:bg-amber-400/20"
              >
                Browse Services
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/8"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white leading-snug truncate">{item.name}</p>
                  <p className="text-xs text-amber-400 font-bold mt-0.5">${item.price.toLocaleString()}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex items-center justify-center size-7 rounded-lg bg-white/8 border border-white/10 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="text-sm font-black text-white w-5 text-center tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex items-center justify-center size-7 rounded-lg bg-white/8 border border-white/10 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>

                {/* Line total + remove */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <p className="text-xs font-black text-white/80 tabular-nums">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center justify-center size-5 rounded-md text-white/25 transition-colors hover:text-red-400"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: promo + totals + checkout */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/8 space-y-4">
            {/* Promo code */}
            <div>
              {promoApplied ? (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-400/10 border border-amber-400/25">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-[0.1em]">{promoApplied}</span>
                    <span className="text-xs text-amber-400/60">— {Math.round(discount * 100)}% off</span>
                  </div>
                  <button onClick={removePromo} className="text-white/30 hover:text-white/60 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => { setPromoInput(e.target.value); setPromoError(""); }}
                    onKeyDown={e => e.key === "Enter" && applyPromo()}
                    placeholder="Promo code"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/6 border border-white/10 text-sm text-white placeholder-white/25 outline-none focus:border-amber-400/40 focus:bg-white/8 transition-colors"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2.5 rounded-xl bg-white/8 border border-white/10 text-xs font-bold uppercase tracking-[0.12em] text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-xs text-red-400 mt-1.5">{promoError}</p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-white/50">
                <span>Subtotal</span>
                <span className="tabular-nums">${total.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-amber-400">
                  <span>Discount ({Math.round(discount * 100)}%)</span>
                  <span className="tabular-nums">−${discountAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/8">
                <span>Total</span>
                <span className="tabular-nums text-amber-400">${finalTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button className="w-full py-3.5 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-sm font-black uppercase tracking-[0.18em] shadow-[0_8px_30px_rgba(245,158,11,0.35)] transition-all duration-200 hover:shadow-[0_12px_40px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0">
              Checkout — ${finalTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </button>
            <p className="text-[10px] text-center text-white/20 tracking-wider">Secure checkout · 100% satisfaction guaranteed</p>
          </div>
        )}
      </div>
    </>
  );
}
