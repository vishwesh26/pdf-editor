"use client";

import { CheckCircle2, Zap, Infinity, Shield, Download } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  "Unlimited PDF downloads",
  "Unlimited file edits",
  "Any file size supported",
  "Actual text layer modification (no white box overlays)",
  "Preserves original formatting and fonts",
  "No watermarks on exported files",
  "Secure processing — files auto-deleted after 24h",
  "Blazing fast browser-based editor",
];

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-6">
          <Zap size={14} />
          100% Free — No credit card required
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Everything is{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
            completely free
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          We believe powerful PDF editing should be accessible to everyone. No subscriptions, no paywalls, no limits.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-3xl p-10 border border-green-200/50 dark:border-green-700/30 shadow-xl mb-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Infinity className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Full Access Plan</h2>
            <p className="text-muted-foreground">Everything included, always</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-5xl font-extrabold text-green-600 dark:text-green-400">Free</div>
            <div className="text-muted-foreground text-sm">forever</div>
          </div>
        </div>

        <ul className="grid sm:grid-cols-2 gap-4 mb-10">
          {features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="text-green-500 shrink-0" size={20} />
              <span className="text-sm font-medium">{feature}</span>
            </motion.li>
          ))}
        </ul>

        <Link
          href="/dashboard"
          className="block w-full py-4 text-center bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-2xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg"
        >
          Start Editing — It&apos;s Free
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
      >
        <span className="flex items-center gap-1.5"><Shield size={14} className="text-green-500" /> Secure & Private</span>
        <span className="flex items-center gap-1.5"><Download size={14} className="text-blue-500" /> Unlimited Downloads</span>
        <span className="flex items-center gap-1.5"><Zap size={14} className="text-amber-500" /> No Sign-up Required</span>
      </motion.div>
    </div>
  );
}

