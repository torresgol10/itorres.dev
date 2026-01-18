import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Iván Torres | Software Developer",
  description: "Software developer passionate about modern web apps, sharing learning and experiments with code.",
  openGraph: {
    title: "Iván Torres | Software Developer",
    description: "Software developer passionate about modern web apps, sharing learning and experiments with code.",
    url: "https://itorres.dev",
    siteName: "Iván Torres",
    locale: "es_ES",
    type: "website",
  },
};

import { Providers } from "@/components/providers";
import { ScrollToTop } from "@/components/ScrollToTop";

// ... (imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50`}
      >
        <Providers>
          {children}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
