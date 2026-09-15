"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const LAST_UPDATED = "May 5, 2025";
const CONTACT_EMAIL = "Vishweshshinde26@gmail.com";
const BRAND = "PustakEdits";

const SECTIONS = [
  { id: "intro", title: "1. Introduction" },
  { id: "collection", title: "2. Information We Collect" },
  { id: "usage", title: "3. How We Use Information" },
  { id: "storage", title: "4. File Storage & 24h Purge" },
  { id: "cookies", title: "5. Cookies & Data Storage" },
  { id: "thirdparty", title: "6. Third-Party Services" },
  { id: "rights", title: "7. Your Rights" },
  { id: "changes", title: "8. Policy Changes" },
  { id: "contact", title: "9. Contact Information" },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 text-center max-w-2xl mx-auto"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-300 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
          Data Confidentiality
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3 mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-400">Last updated: {LAST_UPDATED}</p>
      </motion.div>

      {/* Security Callouts Grid */}
      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-xl">
          <Clock size={20} className="text-zinc-300 mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">24-Hour Auto-Purge</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All uploaded PDFs and edits are permanently purged from processing servers within 24 hours.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-xl">
          <Lock size={20} className="text-zinc-300 mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">Zero AI Training</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            We never inspect, harvest, or train AI models on your private documents.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-xl">
          <ShieldCheck size={20} className="text-zinc-300 mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">Encrypted in Transit</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All data transferred between your browser and the vector engine uses TLS 1.3 encryption.
          </p>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Table of Contents Sticky Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 sticky top-24 backdrop-blur-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              On This Page
            </h4>
            <nav className="space-y-1 text-xs">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block py-1 text-zinc-400 hover:text-white transition-colors truncate"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Policy Body */}
        <div className="flex-1 space-y-10 text-sm text-zinc-300 leading-relaxed">
          <section id="intro" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p className="text-zinc-400 leading-relaxed">
              Welcome to <strong>{BRAND}</strong>. We respect your privacy and are committed to protecting
              any personal information or documents you interact with on our platform. This Privacy Policy
              explains what information is processed, how it is handled, and your rights.
            </p>
          </section>

          <section id="collection" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 leading-relaxed">
              <li>
                <strong>Account Information:</strong> Email address when creating an account or logging in via Google OAuth.
              </li>
              <li>
                <strong>Uploaded PDF Documents:</strong> Files you upload for editing. Stored temporarily and automatically deleted after 24 hours.
              </li>
              <li>
                <strong>Technical Diagnostics:</strong> Anonymous browser telemetry to measure editor performance and fix layout rendering bugs.
              </li>
            </ul>
          </section>

          <section id="usage" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <p className="text-zinc-400 leading-relaxed mb-3">
              Information is processed exclusively to deliver the PDF text editing service, authenticate sessions, and protect against automated abuse.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              We <strong>do not</strong> sell, monetize, rent, or distribute your private documents or data to third parties.
            </p>
          </section>

          <section id="storage" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">4. File Storage &amp; 24h Purge Policy</h2>
            <p className="text-zinc-400 leading-relaxed">
              Uploaded PDF documents are stored in secure ephemeral containers strictly to generate text blocks and apply your vector redactions. All uploaded and exported files are permanently purged within 24 hours.
            </p>
          </section>

          <section id="cookies" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">5. Cookies &amp; Data Storage</h2>
            <p className="text-zinc-400 leading-relaxed mb-3">
              We use strictly essential local storage and session tokens to remember your login status and editor state.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              We do not use third-party advertising cookies, ad tracking pixels, or cross-site tracking scripts.
            </p>
          </section>

          <section id="thirdparty" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">6. Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li><strong>Supabase:</strong> For identity authentication, user management, and secure sessions.</li>
            </ul>
          </section>

          <section id="rights" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">7. Your Rights</h2>
            <p className="text-zinc-400 leading-relaxed">
              You have the right to request access to or deletion of your account and related credentials at any time by emailing us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline hover:text-zinc-300">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </section>

          <section id="contact" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">8. Contact Information</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              For any privacy inquiries or data requests, please contact <strong>Vishwesh Shinde</strong>:
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs transition-colors"
            >
              <span>Contact Support</span>
              <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
