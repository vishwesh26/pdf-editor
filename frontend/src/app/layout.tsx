import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/auth/AuthProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PustakEdits - Free PDF Text Editor Online",
  description: "PustakEdits is a free, browser-based PDF editor. Edit existing PDF text instantly, preserve original fonts and formatting, and download without watermarks.",
  keywords: [
    "PDF editor",
    "edit PDF text",
    "free PDF editor",
    "online PDF editor",
    "modify PDF",
    "change text in PDF",
    "PDF text editor",
    "no watermark PDF editor",
    "browser PDF editor",
    "PustakEdits"
  ],
  authors: [{ name: "Vishwesh Shinde" }],
  creator: "Vishwesh Shinde",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pustakedits.com",
    title: "PustakEdits - Free PDF Text Editor Online",
    description: "Edit existing PDF text instantly right in your browser. 100% free, preserves original fonts, no watermarks, secure.",
    siteName: "PustakEdits",
  },
  twitter: {
    card: "summary_large_image",
    title: "PustakEdits - Free PDF Text Editor Online",
    description: "Edit existing PDF text instantly right in your browser. 100% free, preserves original fonts, no watermarks, secure.",
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
  other: {
    "google-adsense-account": "ca-pub-2403388488389670",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="clckd" content="5884886bc63b225061a9b05de0b33996" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </AuthProvider>
        <Analytics />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2403388488389670"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

      </body>
    </html>
  );
}
