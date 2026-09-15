"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { Button } from "@/components/ui/button";
import AnimatedPdfDemo from "@/components/home/AnimatedPdfDemo";

const FAQ_ITEMS = [
  {
    q: "Is PustakEdits really 100% free with no watermarks?",
    a: "Yes. There are no hidden charges, trial paywalls, or watermarks stamped onto your documents. You can modify as many document-generated PDFs as you need.",
  },
  {
    q: "Are my uploaded documents private and secure?",
    a: "Completely. Your uploaded files are stored temporarily on isolated ephemeral processing servers strictly for your editing session and are automatically deleted after 24 hours. We never read or store your documents.",
  },
  {
    q: "What types of PDFs are supported?",
    a: "PustakEdits works on document-generated PDFs (such as invoices, agreements, statements, resumes, and reports) containing genuine text layers. Scanned bitmap images without OCR do not possess selectable text.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-28 pb-12 text-center flex flex-col items-center">
        <div data-grid-avoid className="mb-4 max-w-3xl flex justify-center">
          <BlurText
            text="Edit the actual text inside any PDF."
            delay={80}
            animateBy="words"
            direction="top"
            className="text-3xl sm:text-5xl md:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.12] justify-center text-center"
          />
        </div>

        <motion.p
          data-grid-avoid
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-sm sm:text-base text-zinc-400 mb-8 max-w-lg leading-relaxed"
        >
          Free, browser-based. No watermarks, no white-box overlays — we
          rewrite the real text layer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="white"
              size="lg"
              className="w-full sm:w-auto gap-2 px-7 h-11 text-xs sm:text-sm font-semibold"
            >
              <span>Start Editing — Free</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
          <Link href="#demo" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-xs sm:text-sm px-6 h-11 border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 transition-all"
            >
              <span>See How It Works ↓</span>
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ─── ANIMATED DEMO ─── */}
      <section
        id="demo"
        className="w-full py-16 sm:py-20 bg-transparent"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Watch it work
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Click a text block, select it, retype, save. That's it.
            </p>
          </div>

          <AnimatedPdfDemo />
        </motion.div>
      </section>

      {/* ─── HOW IT'S DIFFERENT ─── */}
      <section className="w-full py-16 sm:py-20 border-t border-white/10 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Why PustakEdits is different
            </h2>
          </div>

          <SpotlightCard
            spotlightColor="rgba(255, 255, 255, 0.06)"
            className="p-0 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              {/* Other tools */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-zinc-400 font-semibold text-sm mb-5">
                  <XCircle size={16} className="text-zinc-500" />
                  <span>Other PDF editors</span>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-zinc-500 font-bold mt-0.5">✕</span>
                    <span>Paint a white rectangle over existing text, blocking background graphics</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-zinc-500 font-bold mt-0.5">✕</span>
                    <span>Use mismatched generic browser fonts that look out of place</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-zinc-500 font-bold mt-0.5">✕</span>
                    <span>Stamp watermarks on export or charge $15–25/month</span>
                  </li>
                </ul>
              </div>

              {/* PustakEdits */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-white font-semibold text-sm mb-5">
                  <CheckCircle2 size={16} className="text-white" />
                  <span>PustakEdits</span>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span>Rewrites the actual PDF text layer — content streams, not overlays</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span>Preserves original font family, weight, size, and color automatically</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span>100% free, zero watermarks, files auto-deleted in 24 hours</span>
                  </li>
                </ul>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </section>

      {/* ─── FAQ + CTA ─── */}
      <section className="w-full py-16 sm:py-20 border-t border-white/10 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Common questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden hover:border-zinc-700 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-medium text-white text-sm hover:text-zinc-200 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Inline CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-400 mb-4">
              Ready to edit your document?
            </p>
            <Link href="/dashboard">
              <Button
                variant="white"
                size="lg"
                className="px-8 h-11 text-xs sm:text-sm font-semibold"
              >
                <span>Start Editing — Free</span>
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
