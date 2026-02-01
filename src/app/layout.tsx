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
  title: {
    default: "Iván Torres | Software Developer",
    template: "%s | Iván Torres",
  },
  description: "Desarrollador de software apasionado por las aplicaciones web modernas, compartiendo aprendizajes y experimentos con código.",
  keywords: ["Software Developer", "Web Development", "React", "Next.js", "TypeScript", "JavaScript", "Programming Blog", "Iván Torres"],
  authors: [{ name: "Iván Torres", url: "https://itorres.dev" }],
  creator: "Iván Torres",
  metadataBase: new URL("https://itorres.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Iván Torres | Software Developer",
    description: "Desarrollador de software apasionado por las aplicaciones web modernas, compartiendo aprendizajes y experimentos con código.",
    url: "https://itorres.dev",
    siteName: "Iván Torres",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png", // We should ensure this image exists or use a default one
        width: 1200,
        height: 630,
        alt: "Iván Torres | Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iván Torres | Software Developer",
    description: "Desarrollador de software apasionado por las aplicaciones web modernas, compartiendo aprendizajes y experimentos con código.",
    creator: "@itorres_dev", // Assuming this is the handle, or we can leave it generic
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="fixed inset-0 -z-50 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <Providers>
          {children}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
