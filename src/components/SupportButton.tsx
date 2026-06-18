"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";

interface Message {
  id: number;
  from: "user" | "support";
  text: string;
}

export default function SupportButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "support", text: "Hi! How can we help you today?" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function send() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length, from: "user", text: trimmed },
    ]);
    setInput("");
    // Auto-reply placeholder
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          from: "support",
          text: "Thanks for reaching out! Our team will get back to you shortly.",
        },
      ]);
    }, 800);
  }

  return (
    <>
      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-24 right-5 z-80 w-80 rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-slate-900 border border-white/10 transition-all duration-300 origin-bottom-right",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"
        )}
        style={{ maxHeight: "420px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 shrink-0">
          <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
            <HeadsetIcon className="size-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-tight">Support</p>
            <p className="text-[10px] text-blue-100/80">We usually reply instantly</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close support chat"
            className="size-7 flex items-center justify-center rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 min-h-0" style={{ maxHeight: "280px" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex", msg.from === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] px-3 py-2 rounded-2xl text-[13px] leading-snug",
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white/10 text-white/85 rounded-bl-sm"
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            className="flex-1 bg-white/8 border border-white/12 rounded-xl px-3 py-2 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-blue-500/60 transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            aria-label="Send message"
            className="size-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open support chat"
        className={cn(
          "fixed bottom-5 right-5 z-80 size-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_4px_24px_rgba(37,99,235,0.55)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95",
          open ? "rotate-20" : "rotate-0"
        )}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <HeadsetIcon className="size-6 text-white" />
        )}
      </button>
    </>
  );
}

function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}
