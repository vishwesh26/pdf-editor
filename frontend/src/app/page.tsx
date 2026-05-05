"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { UploadCloud, Edit3, Download, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          PustakEdits is Live
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl"
        >
          Edit Existing PDF Text <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Instantly in your Browser
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-12 max-w-2xl"
        >
          No fake overlays. We manipulate the actual text layer of your document-generated PDFs so formatting is perfectly preserved.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl hover:shadow-2xl">
            Start Editing Free
          </Link>
          <Link href="#how-it-works" className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-foreground rounded-full font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            See How it Works
          </Link>
        </motion.div>
        
        {/* Mockup Image/App Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10"
        >
          <div className="bg-gray-100 dark:bg-gray-900 h-12 flex items-center px-4 gap-2 border-b border-black/10 dark:border-white/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto text-xs text-muted-foreground font-medium">editor.pustakedits.com</div>
          </div>
          <div className="bg-white dark:bg-black aspect-[16/9] flex items-center justify-center p-8 relative overflow-hidden">
             {/* Fake PDF Editor UI for visual flair */}
             <div className="w-full h-full flex gap-4">
                <div className="w-1/4 h-full bg-gray-50 dark:bg-gray-900 rounded-lg hidden sm:block border border-gray-200 dark:border-gray-800"></div>
                <div className="flex-1 h-full bg-white dark:bg-black shadow-lg rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col p-12 relative items-center justify-center">
                    <div className="absolute top-20 left-1/4 w-1/2 h-8 bg-blue-100 dark:bg-blue-900/40 rounded flex items-center px-2 border border-blue-400">
                        <span className="animate-pulse w-0.5 h-5 bg-blue-600 mr-1"></span>
                        <span className="text-blue-800 dark:text-blue-200 font-serif">Invoice #204</span>
                    </div>
                    <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded mt-20 mb-4"></div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                    <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="w-full py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to modify any document-generated PDF.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 relative overflow-hidden group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <UploadCloud size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Upload PDF</h3>
              <p className="text-muted-foreground">Drag and drop your document. We instantly extract the embedded text layers securely.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 relative overflow-hidden group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Edit3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Click & Edit</h3>
              <p className="text-muted-foreground">Click any text block to edit. We preserve the original font, size, and color dynamically.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 relative overflow-hidden group">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                <Download size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Download</h3>
              <p className="text-muted-foreground">Export your updated PDF. The new text is completely selectable and perfectly integrated.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials / Benefits */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-6">Why use PustakEdits?</h2>
                    <ul className="space-y-4">
                        {[
                            "Actual text layer modification (no white box overlays)",
                            "Preserves original formatting and fonts",
                            "Blazing fast browser-based editor",
                            "Secure processing, auto-deleted files after 24h",
                            "No watermarks on exported files"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-500" size={20} />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <Link href="/dashboard" className="mt-8 inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Try it now
                    </Link>
                </div>
                <div className="flex-1 w-full relative">
                    <div className="aspect-square w-full max-w-md mx-auto bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl absolute inset-0"></div>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-black/10 dark:border-white/10 relative z-10">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                        </div>
                        <p className="text-lg italic mb-6">"Finally, a PDF editor that actually changes the text instead of just dropping a white square over it. Saved me hours of rewriting an invoice."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                            <div>
                                <p className="font-bold">Sarah Jenkins</p>
                                <p className="text-sm text-muted-foreground">Freelance Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
