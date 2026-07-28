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
  title: "PustakEdits - #1 Free PDF Text Editor Online (No Watermark)",
  description: "PustakEdits is a 100% free, browser-based PDF text editor. Edit existing PDF text instantly, preserve original fonts and formatting, and download edited PDFs with zero watermarks.",
  keywords: [
    "free pdf editor",
    "edit pdf online",
    "free online pdf text editor",
    "edit text in pdf free",
    "pdf text editor no watermark",
    "online pdf edit existing text",
    "replace text in pdf",
    "modify pdf text free",
    "best free pdf editor",
    "pustakedits",
    "online pdf editor without watermark",
    "browser pdf editor",
    "pdf text layer editor"
  ],
  authors: [{ name: "Vishwesh Shinde" }],
  creator: "Vishwesh Shinde",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pustakedit.vercel.app",
    title: "PustakEdits - #1 Free PDF Text Editor Online (No Watermark)",
    description: "Edit existing PDF text instantly right in your browser. 100% free, preserves original fonts, no watermarks, secure.",
    siteName: "PustakEdits",
  },
  twitter: {
    card: "summary_large_image",
    title: "PustakEdits - #1 Free PDF Text Editor Online (No Watermark)",
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
    "monetag": "522a1eee94bf9a38a83c8da01978325e",
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
        <script src="https://quge5.com/88/tag.min.js" data-zone="264735" async data-cfasync="false"></script>
        <meta name="monetag" content="522a1eee94bf9a38a83c8da01978325e" />
        <meta name="clckd" content="5884886bc63b225061a9b05de0b33996" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PustakEdits",
              "operatingSystem": "All",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1250"
              },
              "description": "PustakEdits is a free, web-based PDF text editor that allows users to directly modify existing text layers in document-generated PDFs while preserving original fonts and formatting."
            })
          }}
        />
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
