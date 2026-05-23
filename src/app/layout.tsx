import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Z Survey",
    template: "%s | Z Survey",
  },
  description: "A modern survey onboarding flow",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/logo.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Link
          href="/"
          aria-label="Z Survey home"
          className="fixed left-4 top-4 z-50 grid size-11 place-items-center overflow-hidden rounded-xl shadow-lg shadow-blue-900/15 ring-1 ring-white/50 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:left-6 sm:top-6 sm:size-12"
        >
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className="size-full object-cover"
          />
        </Link>
        {children}
      </body>
    </html>
  );
}
