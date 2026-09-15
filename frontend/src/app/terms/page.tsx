"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const LAST_UPDATED = "May 5, 2025";
const CONTACT_EMAIL = "Vishweshshinde26@gmail.com";
const BRAND = "PustakEdits";

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "description", title: "2. Description of Service" },
  { id: "accounts", title: "3. User Accounts" },
  { id: "acceptable-use", title: "4. Acceptable Use Policy" },
  { id: "handling", title: "5. Document Handling & Ownership" },
  { id: "ip", title: "6. Intellectual Property" },
  { id: "disclaimer", title: "7. Disclaimer of Warranties" },
  { id: "liability", title: "8. Limitation of Liability" },
  { id: "governing", title: "9. Governing Law" },
  { id: "contact", title: "10. Contact Information" },
];

export default function TermsPage() {
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
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3 mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-zinc-400">Last updated: {LAST_UPDATED}</p>
      </motion.div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Table of Contents Sticky Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 sticky top-24 backdrop-blur-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Sections
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

        {/* Terms Body */}
        <div className="flex-1 space-y-8 text-sm text-zinc-300 leading-relaxed">
          <section id="acceptance" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-zinc-400 leading-relaxed">
              By accessing or utilizing <strong>{BRAND}</strong> (&ldquo;the Service&rdquo;), you acknowledge and agree to be bound by these Terms &amp; Conditions. If you do not agree with any portion of these terms, you must refrain from using the Service.
            </p>
          </section>

          <section id="description" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p className="text-zinc-400 leading-relaxed">
              {BRAND} is a browser-based PDF editing platform that enables users to manipulate authentic text layers in document-generated PDFs. The Service is provided free of charge with no subscription requirements.
            </p>
          </section>

          <section id="acceptable-use" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">3. Acceptable Use Policy</h2>
            <p className="text-zinc-400 leading-relaxed mb-3">
              You agree to use {BRAND} exclusively for lawful and legitimate purposes. You explicitly agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>Upload or manipulate documents to forge or falsify official government, medical, or financial records with fraudulent intent.</li>
              <li>Attempt to reverse engineer, disrupt, or launch denial-of-service attacks on our processing servers.</li>
              <li>Deploy unauthorized scrapers, automated spiders, or extract confidential server resources.</li>
            </ul>
          </section>

          <section id="handling" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">4. Document Handling &amp; Ownership</h2>
            <p className="text-zinc-400 leading-relaxed mb-3">
              You retain 100% full intellectual property ownership of any files you upload. By uploading documents, you grant {BRAND} a temporary technical license strictly to process your redactions and render page canvases.
            </p>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-xs text-zinc-400 flex items-center gap-3">
              <ShieldCheck size={20} className="text-zinc-300 shrink-0" />
              <span>All documents are automatically purged from our servers within 24 hours of upload.</span>
            </div>
          </section>

          <section id="disclaimer" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">5. Disclaimer of Warranties</h2>
            <p className="text-zinc-400 leading-relaxed">
              The Service is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis without warranties of any kind. While we utilize cutting-edge vector extraction libraries, we do not guarantee that all proprietary or encrypted PDF formats will render identically.
            </p>
          </section>

          <section id="contact" className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-3">6. Questions &amp; Support</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Questions regarding these Terms should be directed to <strong>Vishwesh Shinde</strong> at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline hover:text-zinc-300">
                {CONTACT_EMAIL}
              </a>:
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
