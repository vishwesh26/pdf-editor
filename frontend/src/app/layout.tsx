import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/auth/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { GridPulse } from "@/components/ui/grid-pulse";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
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
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-zinc-800 selection:text-white`}>
        {/* Minimalist GridPulse Background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#09090b]" />
          <GridPulse cell={24} reach={2.6} ambient={2} maxLit={180} />
        </div>

        <AuthProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(18, 18, 24, 0.95)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(16px)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                fontSize: '13px',
                fontWeight: '500',
              },
            }}
          />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
