import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import Header from "@/components/Header";
import SupportButton from "@/components/SupportButton";
import DarkModeProvider from "@/components/DarkModeProvider";
import "./globals.css";

const vazirmatn = localFont({
  src: "../fonts/vazirmatn/Vazirmatn-VariableFont_wght.ttf",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
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
      lang="fa"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DarkModeProvider>
          <Header />
          {children}
          <SupportButton />
        </DarkModeProvider>
      </body>
    </html>
  );
}
