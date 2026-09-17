"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Scale, AlertTriangle, FileText, CheckCircle2, Ban } from "lucide-react";
import Link from "next/link";

const LAST_UPDATED = "March 18, 2026";
const EFFECTIVE_DATE = "March 18, 2026";
const CONTACT_EMAIL = "Vishweshshinde26@gmail.com";
const LEGAL_ENTITY = "PustakEdits Platform";
const GOVERNING_JURISDICTION = "India and applicable international statutory jurisdictions";

const SECTIONS = [
  { id: "acceptance", title: "1. Binding Contract & Acceptance" },
  { id: "eligibility", title: "2. Eligibility & Capacity" },
  { id: "license", title: "3. Scope of Service & Limited License" },
  { id: "ownership", title: "4. User Intellectual Property & File License" },
  { id: "prohibited", title: "5. Strict Prohibited Conduct & Fraud" },
  { id: "rate-limits", title: "6. Rate Limiting, Abuse & Quotas" },
  { id: "proprietary", title: "7. Company Intellectual Property" },
  { id: "disclaimer", title: "8. Disclaimer of All Warranties" },
  { id: "liability", title: "9. Strict Limitation of Liability & Cap" },
  { id: "indemnity", title: "10. Comprehensive Indemnification" },
  { id: "arbitration", title: "11. Binding Arbitration & Class Action Waiver" },
  { id: "governing-law", title: "12. Governing Law & Exclusive Jurisdiction" },
  { id: "severability", title: "13. Severability & Entire Agreement" },
  { id: "termination", title: "14. Termination & Survival" },
  { id: "contact", title: "15. Statutory Notices & Legal Contact" },
];

export default function TermsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full min-w-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-12 text-center max-w-3xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <Scale size={13} className="text-teal-400" />
          <span>Strict Contractual Terms</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Terms &amp; Conditions of Service
        </h1>
        <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 font-mono pt-1">
          <span>Effective Date: {EFFECTIVE_DATE}</span>
          <span>•</span>
          <span>Last Revised: {LAST_UPDATED}</span>
        </div>
      </motion.div>

      {/* Mandatory Statutory Notice Banner */}
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/20 via-zinc-950 to-zinc-950/80 p-5 backdrop-blur-xl mb-12 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-zinc-300 leading-relaxed">
          <span className="font-bold text-red-300 uppercase tracking-wider text-[11px] block">
            Mandatory Legal Notice &amp; Binding Arbitration Warning
          </span>
          <p className="text-zinc-400">
            PLEASE READ THESE TERMS OF SERVICE CAREFULLY. THEY CONTAIN MANDATORY PROVISIONS REGARDING DISPUTE RESOLUTION, BINDING INDIVIDUAL ARBITRATION, AND A COMPLETE WAIVER OF CLASS-ACTION LAWSUITS (SEE SECTION 11.0). BY UPLOADING, PROCESSING, OR DOWNLOADING ANY DOCUMENT VIA THIS PLATFORM, YOU AFFIRMATIVELY CONSENT TO BE BOUND BY THESE CONDITIONS.
          </p>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Table of Contents Sticky Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 sticky top-20 backdrop-blur-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 pb-2 border-b border-zinc-800">
              <FileText size={13} />
              <span>Table of Sections</span>
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

        {/* Legal Body Clauses */}
        <div className="flex-1 space-y-8 text-sm text-zinc-300 leading-relaxed min-w-0">
          {/* Section 1 */}
          <section id="acceptance" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 1.0</span>
              <span>Binding Legal Agreement &amp; Acceptance of Terms</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              These Terms &amp; Conditions of Service (&quot;<strong>Terms</strong>&quot; or &quot;<strong>Agreement</strong>&quot;) constitute an electronic record within the meaning of applicable law (including the Indian Information Technology Act, 2000, U.S. Electronic Signatures in Global and National Commerce Act (ESIGN), and EU Regulation No 910/2014 (eIDAS)).
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              This Agreement is executed between <strong>{LEGAL_ENTITY}</strong> (&quot;<strong>Company</strong>&quot;, &quot;<strong>We</strong>&quot;, &quot;<strong>Us</strong>&quot;, or &quot;<strong>Our</strong>&quot;) and any individual, entity, or automated software agent accessing or using our document manipulation platform (&quot;<strong>User</strong>&quot; or &quot;<strong>You</strong>&quot;). Accessing, loading, or interacting with the service constitutes unconditional assent to all provisions herein.
            </p>
          </section>

          {/* Section 2 */}
          <section id="eligibility" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 2.0</span>
              <span>Eligibility &amp; Corporate Representation</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              You warrant and represent that you are at least eighteen (18) years of age (or have reached the statutory age of legal majority in your jurisdiction) and possess full legal capacity and competence to enter into a binding contract. If you access this Service on behalf of a corporation, partnership, or other legal entity, you represent and warrant that you possess full legal authority to bind said entity to this Agreement.
            </p>
          </section>

          {/* Section 3 */}
          <section id="license" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 3.0</span>
              <span>Scope of Service &amp; Limited Revocable License</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                {LEGAL_ENTITY} provides algorithmic, in-memory, and server-side document utility tools, including direct vector font text manipulation, lossless compression, optical character recognition (OCR), multi-file merging, range splitting, page reordering, format conversion (PDF, DOCX, XLSX, PPTX, HTML), encryption, decryption, and permanent text redaction (&quot;<strong>Service</strong>&quot;).
              </p>
              <p>
                Subject to your strict compliance with these Terms, the Company grants you a limited, non-exclusive, non-transferable, revocable license to access and utilize the platform solely for lawful individual or internal business purposes.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="ownership" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 4.0</span>
              <span>User Intellectual Property &amp; Processing License Grant</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                <strong className="text-white">Full Retention of IP:</strong> You retain 100% exclusive intellectual property rights, ownership, copyright, and title in and to all document binaries, texts, vectors, trademarks, images, and content uploaded to the Service (&quot;<strong>User Content</strong>&quot;). The Company asserts zero ownership claim over your documents.
              </p>
              <p>
                <strong className="text-white">Limited Operational License:</strong> Solely for the technical execution of the requested tool operations (e.g., rasterization, font glyph rewriting, page splitting, OCR parsing), you grant {LEGAL_ENTITY} an ephemeral, worldwide, royalty-free license strictly to ingest, parse, render, cache, and transmit your User Content in transient memory. This license expires automatically upon file expunction under our 24-hour purge lifecycle.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="prohibited" className="rounded-3xl border border-red-500/30 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-red-400 font-mono">§ 5.0</span>
              <span>Strict Acceptable Use Policy &amp; Prohibited Conduct</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p className="text-zinc-300 font-semibold">
                You explicitly agree NOT to utilize the Service, directly or indirectly, for any of the following unlawful, fraudulent, or tortious activities:
              </p>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start gap-2">
                  <Ban size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Forgery &amp; Falsification:</strong> Altering, editing, forging, or fabricating official government identification, judicial decrees, law enforcement records, financial audits, medical prescriptions, or certificates with intent to deceive, defraud, or commit forgery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ban size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Malicious Payloads:</strong> Uploading documents embedded with JavaScript exploits, malicious PostScript macros, zero-day PDF buffer overflow exploits, trojans, or ransomware.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ban size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Infrastructure Sabotage:</strong> Attempting to reverse engineer, decompile, bypass memory limits, trigger compute starvation, or orchestrate Denial of Service (DoS/DDoS) attacks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ban size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Unauthorized Scraping:</strong> Deploying headless scrapers, web spiders, or automated crawlers without prior written authorization from Company management.</span>
                </li>
              </ul>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                VIOLATION OF THIS SECTION RESULTS IN IMMEDIATE TERMINATION, PERMANENT IP BLOCKING, AND PROACTIVE REFERRAL TO LAW ENFORCEMENT AGENCIES AND REGULATORY AUTHORITIES WITHOUT PRIOR NOTICE.
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="rate-limits" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 6.0</span>
              <span>Rate Limiting, Quotas &amp; Automated Throttling</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                To maintain fair usage and compute stability, {LEGAL_ENTITY} enforces algorithmic rate limiters (token bucket algorithms) across all endpoints:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-300">
                <li><strong>Guest Tier:</strong> Limited to 15 requests per 10-minute window; maximum 15MB file size payload.</li>
                <li><strong>Registered Tier:</strong> Limited to 45 requests per 10-minute window; maximum 25MB file size payload.</li>
                <li><strong>Asynchronous Threshold:</strong> Workloads exceeding 10MB or 10 pages automatically switch to asynchronous queuing.</li>
              </ul>
              <p className="text-[11px] text-zinc-500">
                Company reserves the absolute, unfettered right to modify rate quotas, reject HTTP requests returning status code 429 (Too Many Requests), or temporarily suspend access for anomalous volume.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="proprietary" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 7.0</span>
              <span>Company Proprietary &amp; Intellectual Property Rights</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              The entire platform infrastructure, including but not limited to the source code, user interface designs, font metric matching algorithms, graphic assets, stylesheets, API schemas, and the trademark &quot;PustakEdits&quot;, are the exclusive intellectual property of the Company and its principal developer (Vishwesh Shinde), protected under national and international copyright, trademark, and trade secret laws. Nothing in this Agreement grants the User any ownership interest in the platform.
            </p>
          </section>

          {/* Section 8 */}
          <section id="disclaimer" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 8.0</span>
              <span>Comprehensive Disclaimer of All Warranties</span>
            </h2>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed uppercase space-y-2">
              <p>
                THE SERVICE IS PROVIDED STRICTLY ON AN &quot;AS-IS&quot; AND &quot;AS-AVAILABLE&quot; BASIS WITHOUT WARRANTY OF ANY KIND, EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
              </p>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, THE COMPANY SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, NON-INFRINGEMENT, AND QUIET ENJOYMENT.
              </p>
              <p>
                WE DO NOT WARRANT THAT (A) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (B) THE EXTRACTION OR RECONSTRUCTION OF PDF FONT GLYPHS WILL BE BIT-FOR-BIT IDENTICAL WITH PROPRIETARY ADOBE POSTSCRIPT FORMATS; OR (C) THAT DEFECTS IN THE SOURCE FILES WILL BE REPAIRED WITHOUT DATA DEGRADATION.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="liability" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 9.0</span>
              <span>Strict Limitation of Liability &amp; Liquidated Damages Cap</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed uppercase space-y-2">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL {LEGAL_ENTITY}, ITS DEVELOPERS, AFFILIATES, OFFICERS, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF GOODWILL, BUSINESS INTERRUPTION, LOSS OF RECOVERABLE DATA, OR COMPUTER MALFUNCTION), REGARDLESS OF THE LEGAL THEORY ASSERTED (CONTRACT, TORT, STRICT LIABILITY, OR NEGLIGENCE).
                </p>
                <p>
                  UNDER ALL CIRCUMSTANCES, THE AGGREGATE CUMULATIVE LIABILITY OF THE COMPANY ARISING FROM OR RELATING TO THIS AGREEMENT OR THE USE OF THE SERVICE SHALL BE STRICTLY LIMITED TO THE LESSER OF (I) THE TOTAL FEES PAID BY YOU TO THE COMPANY IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (II) ZERO UNITED STATES DOLLARS ($0.00 USD).
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="indemnity" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 10.0</span>
              <span>Comprehensive Indemnification by User</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              You agree to defend, indemnify, and hold harmless {LEGAL_ENTITY}, its founder (Vishwesh Shinde), contractors, infrastructure partners, and agents from and against any and all claims, demands, liabilities, damages, judgments, awards, losses, costs, and expenses (including reasonable attorneys&apos; fees and court costs) arising out of or relating to: (a) your violation of these Terms; (b) any User Content or document payloads uploaded by you; (c) your infringement of any third-party intellectual property or privacy right; or (d) any fraudulent, unlawful, or unauthorized document alteration executed via the platform.
            </p>
          </section>

          {/* Section 11 */}
          <section id="arbitration" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 11.0</span>
              <span>Mandatory Binding Arbitration &amp; Class Action Waiver</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                <strong className="text-white">Individual Binding Arbitration:</strong> Any controversy, claim, or dispute arising out of or relating to these Terms or the breach thereof shall be resolved exclusively through final and binding arbitration administered in accordance with the Arbitration and Conciliation Act, 1996 (or recognized commercial arbitration rules in the governing venue).
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-white">
                COMPLETE WAIVER OF CLASS ACTION: YOU EXPRESSLY AGREE THAT ALL DISPUTES SHALL BE RESOLVED SOLELY ON AN INDIVIDUAL BASIS. YOU WAIVE ANY RIGHT TO COMMENCE, JOIN, OR PARTICIPATE AS A CLASS REPRESENTATIVE OR CLASS MEMBER IN ANY CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING AGAINST THE COMPANY.
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="governing-law" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 12.0</span>
              <span>Governing Law &amp; Exclusive Jurisdiction</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              These Terms, and all claims or causes of action based upon, arising out of, or related to this Agreement or the platform, shall be governed by, construed, and enforced in accordance with the laws of <strong>India</strong>, without giving effect to any conflict-of-laws principles that would require the application of the law of another jurisdiction. The parties submit to the exclusive personal and subject matter jurisdiction of the competent courts having jurisdiction over the Company&apos;s principal operations.
            </p>
          </section>

          {/* Section 13 */}
          <section id="severability" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 13.0</span>
              <span>Severability &amp; Entire Agreement</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              If any provision of these Terms is determined by a court or arbitral tribunal of competent jurisdiction to be illegal, invalid, or unenforceable, such provision shall be severed or modified to the minimum extent necessary, and the remaining provisions of these Terms shall continue in full legal force and effect. These Terms, together with the Privacy Policy, constitute the sole and entire agreement between you and the Company with respect to the Service.
            </p>
          </section>

          {/* Section 14 */}
          <section id="termination" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 14.0</span>
              <span>Termination &amp; Survival of Clauses</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              The Company reserves the right, in its sole and unfettered discretion, to terminate or restrict your access to all or part of the Service at any time, with or without notice, for any violation of these Terms. Sections 4.0, 5.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, and 13.0 shall survive any expiration or termination of this Agreement.
            </p>
          </section>

          {/* Section 15 */}
          <section id="contact" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 15.0</span>
              <span>Statutory Notices &amp; Legal Contact</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                All legal notices, subpoenas, or formal communications under these Terms must be served in writing to the legal counsel and administrator of {LEGAL_ENTITY}:
              </p>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1.5 font-mono">
                <div><span className="text-zinc-500">Legal Representative:</span> <strong className="text-white">Vishwesh Shinde</strong></div>
                <div><span className="text-zinc-500">Entity:</span> <span className="text-zinc-300">PustakEdits Legal Compliance</span></div>
                <div><span className="text-zinc-500">Email:</span> <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-400 underline">{CONTACT_EMAIL}</a></div>
                <div><span className="text-zinc-500">Jurisdiction:</span> <span className="text-zinc-300">{GOVERNING_JURISDICTION}</span></div>
              </div>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs transition-colors"
                >
                  <span>Submit Legal Inquiry</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
