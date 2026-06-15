"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-09-22T00:00:00+03:30");

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function compute(): TimeLeft {
  const diff = Math.max(0, TARGET.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "DAYS" },
  { key: "hours", label: "HRS" },
  { key: "minutes", label: "MIN" },
  { key: "seconds", label: "SEC" },
];

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(compute());
    const id = setInterval(() => setTime(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-5 flex gap-2">
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 px-1 backdrop-blur-sm"
        >
          <span className="tabular-nums text-xl font-black text-white sm:text-2xl lg:text-3xl">
            {time ? String(time[key]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 text-[9px] font-bold tracking-wide text-white/45 sm:text-[10px]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
