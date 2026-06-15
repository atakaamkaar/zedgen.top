import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import Header from "@/components/Header";
import SupportButton from "@/components/SupportButton";
import DarkModeProvider from "@/components/DarkModeProvider";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const vazirmatn = localFont({
  src: "../fonts/vazirmatn/Vazirmatn-VariableFont_wght.ttf",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

const BASE_URL = "https://zedgen.top";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "ZedGen | Z-Game — جنبش ضد",
    template: "%s | ZedGen",
  },

  description:
    "ZedGen is the anti-movement — a creative game, a rebellion, a new era. | زدجن یک جنبش ضد است — یک بازی خلاقانه، یک شورش، یک عصر جدید.",

  keywords: [
    "ZedGen",
    "Z-Game",
    "Z Game",
    "جنبش ضد",
    "زدجن",
    "بازی",
    "موزیک",
    "music game",
    "anti movement",
    "creative rebellion",
    "underground music",
    "Iran music",
    "موزیک ایران",
  ],

  authors: [{ name: "ZedGen", url: BASE_URL }],
  creator: "ZedGen",
  publisher: "ZedGen",

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    title: "ZedGen | Z-Game — جنبش ضد",
    description:
      "ZedGen is the anti-movement — a creative game, a rebellion, a new era. | زدجن یک جنبش ضد است — یک بازی خلاقانه، یک شورش، یک عصر جدید.",
    url: BASE_URL,
    siteName: "ZedGen",
    type: "website",
    locale: "fa_IR",
    alternateLocale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ZedGen | Z-Game — جنبش ضد",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ZedGen | Z-Game — جنبش ضد",
    description:
      "ZedGen is the anti-movement — a creative game, a rebellion, a new era.",
    images: ["/opengraph-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
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
        <CartProvider>
          <DarkModeProvider>
            <Header />
            {children}
            <SupportButton />
          </DarkModeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
