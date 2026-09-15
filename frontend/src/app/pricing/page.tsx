"use client";

import {
  CheckCircle2,
  XCircle,
  Zap,
  Infinity as InfinityIcon,
  ShieldCheck,
  Download,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { Button } from "@/components/ui/button";

const FEATURES = [
  "Unlimited PDF downloads with zero watermarks",
  "True text layer manipulation (no white rectangle overlays)",
  "Automatic font, size, weight, and color preservation",
  "Any file size supported up to 30MB",
  "High-resolution vector PDF export",
  "Private processing — all files purged within 24 hours",
  "Interactive in-browser editing canvas",
  "Zero credit card or registration required",
];

const COMPARISON_ROWS = [
  {
    feature: "True Text Redaction & Insertion",
    pustak: true,
    acrobat: true,
    smallpdf: false,
  },
  {
    feature: "Zero Watermarks on Exports",
    pustak: true,
    acrobat: true,
    smallpdf: false,
  },
  {
    feature: "Automatic Font Metric Matching",
    pustak: true,
    acrobat: true,
    smallpdf: false,
  },
  {
    feature: "Browser-Based Without Install",
    pustak: true,
    acrobat: false,
    smallpdf: true,
  },
  {
    feature: "No Credit Card Required",
    pustak: true,
    acrobat: false,
    smallpdf: false,
  },
  {
    feature: "Annual Cost",
    pustakText: "$0 (Free Forever)",
    acrobatText: "$239.88 / yr",
    smallpdfText: "$108.00 / yr",
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Pricing Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium mb-6">
          <Zap size={13} className="text-zinc-400" />
          <span>100% Free Forever • Zero Hidden Fees</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
          Everything Included. <br className="hidden sm:inline" />
          <span className="text-zinc-400">Completely Free.</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Professional-grade PDF text manipulation accessible to everyone.
          No subscriptions, no paywalls, and never a watermark.
        </p>
      </motion.div>

      {/* Main Free Plan Spotlight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mb-20"
      >
        <SpotlightCard
          spotlightColor="rgba(255, 255, 255, 0.08)"
          className="p-8 sm:p-12 relative overflow-hidden bg-zinc-950/80 backdrop-blur-xl border-white/10 rounded-3xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/10 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <InfinityIcon size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Full Access
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-200 border border-white/15">
                    Unlimited
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  All editing tools, vector font matching, and unlimited downloads
                </p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                $0
              </div>
              <div className="text-xs font-medium text-zinc-400 mt-1">
                Free for personal & commercial use
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2
                  className="text-zinc-200 shrink-0 mt-0.5"
                  size={18}
                />
                <span className="text-sm text-zinc-300 font-medium leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <Link href="/dashboard" className="block w-full">
            <Button
              variant="white"
              size="lg"
              className="w-full justify-center h-13 text-sm font-semibold gap-2"
            >
              <span>Launch Free Editor Now</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </SpotlightCard>
      </motion.div>

      {/* Competitor Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-10 backdrop-blur-xl mb-16"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white tracking-tight">Plan Comparison</h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            How PustakEdits compares against expensive commercial alternatives.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-white font-bold text-center">
                  PustakEdits
                </th>
                <th className="py-3 px-4 text-zinc-400 text-center">Adobe Acrobat Pro</th>
                <th className="py-3 px-4 text-zinc-400 text-center">Smallpdf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">{row.feature}</td>
                  <td className="py-3.5 px-4 text-center">
                    {row.pustakText ? (
                      <span className="font-bold text-white">{row.pustakText}</span>
                    ) : (
                      <CheckCircle2 size={18} className="text-white mx-auto" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.acrobatText ? (
                      <span className="text-zinc-400">{row.acrobatText}</span>
                    ) : row.acrobat ? (
                      <CheckCircle2 size={18} className="text-zinc-400 mx-auto" />
                    ) : (
                      <XCircle size={18} className="text-zinc-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.smallpdfText ? (
                      <span className="text-zinc-400">{row.smallpdfText}</span>
                    ) : row.smallpdf ? (
                      <CheckCircle2 size={18} className="text-zinc-400 mx-auto" />
                    ) : (
                      <XCircle size={18} className="text-zinc-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-zinc-400">
        <span className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-zinc-300" /> Secure TLS 1.3
        </span>
        <span className="text-zinc-600">•</span>
        <span className="flex items-center gap-2">
          <Download size={16} className="text-zinc-300" /> Unlimited Exports
        </span>
        <span className="text-zinc-600">•</span>
        <span className="flex items-center gap-2">
          <Zap size={16} className="text-zinc-300" /> Instant Processing
        </span>
      </div>
    </div>
  );
}
