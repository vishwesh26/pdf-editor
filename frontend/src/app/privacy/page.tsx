"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Lock, ArrowRight, Scale, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const LAST_UPDATED = "March 18, 2026";
const EFFECTIVE_DATE = "March 18, 2026";
const CONTACT_EMAIL = "Vishweshshinde26@gmail.com";
const LEGAL_ENTITY = "PustakEdits Platform";
const GOVERNING_JURISDICTION = "India and applicable international data protection frameworks";

const SECTIONS = [
  { id: "preamble", title: "1. Legal Preamble & Scope" },
  { id: "roles", title: "2. Controller vs. Processor Status" },
  { id: "collection", title: "3. Categories of Data Collected" },
  { id: "legal-basis", title: "4. Legal Basis for Processing" },
  { id: "ai-prohibition", title: "5. Absolute Prohibition of AI Training" },
  { id: "ephemeral-storage", title: "6. 24-Hour Cryptographic Sanitation" },
  { id: "security", title: "7. Technical & Organizational Measures" },
  { id: "subprocessors", title: "8. Sub-processors & Disclosures" },
  { id: "gdpr-rights", title: "9. GDPR & International Subject Rights" },
  { id: "ccpa-rights", title: "10. California Privacy Rights (CCPA/CPRA)" },
  { id: "hipaa", title: "11. Health Information & Regulatory Disclaimers" },
  { id: "breach", title: "12. Incident & Breach Notification" },
  { id: "amendments", title: "13. Unilateral Amendments" },
  { id: "contact", title: "14. Legal Representative & Service of Process" },
];

export default function PrivacyPage() {
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
          <span>Legally Binding Instrument</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Privacy Policy &amp; Data Protection Charter
        </h1>
        <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 font-mono pt-1">
          <span>Effective Date: {EFFECTIVE_DATE}</span>
          <span>•</span>
          <span>Last Revised: {LAST_UPDATED}</span>
        </div>
      </motion.div>

      {/* Mandatory Statutory Notice Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur-xl mb-12 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-zinc-300 leading-relaxed">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
            Statutory Legal Notice &amp; Ephemeral Processing Guarantee
          </span>
          <p className="text-zinc-400">
            {LEGAL_ENTITY} operates under strict ephemeral compute architecture. All uploaded Portable Document Format (&quot;PDF&quot;) files, raster images, and document payloads are cryptographically processed in transient volatile RAM / temporary disk partitions and permanently expunged via automated scrubbing daemon within twenty-four (24) hours of creation. We do not inspect, retain, commercialize, or train machine-learning models upon your proprietary document content.
          </p>
        </div>
      </div>

      {/* Security Callouts Grid */}
      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-5 backdrop-blur-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-teal-400">
            <Clock size={18} />
          </div>
          <h4 className="text-sm font-bold text-white">Strict 24h Data Expunction</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Automated hard-deletion routines purge all document binaries, temporary artifacts, and extracted font maps precisely within 24 hours of ingest.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-5 backdrop-blur-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
            <Lock size={18} />
          </div>
          <h4 className="text-sm font-bold text-white">Absolute AI Ringfencing</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Zero ingestion into artificial intelligence, LLMs, neural networks, or public training sets. Your files are never parsed for third-party intelligence.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-5 backdrop-blur-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={18} />
          </div>
          <h4 className="text-sm font-bold text-white">Cryptographic Transport</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All transport payloads are secured via Transport Layer Security (TLS 1.3 / AES-256) with forward secrecy between client and backend compute nodes.
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
              <span>Table of Clauses</span>
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
          <section id="preamble" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 1.0</span>
              <span>Legal Preamble, Scope &amp; Binding Effect</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              This Privacy Policy constitutes a legally binding agreement entered into by and between the individual or legal entity accessing, uploading to, or otherwise utilizing the services (&quot;<strong>User</strong>&quot;, &quot;<strong>You</strong>&quot;, or &quot;<strong>Data Subject</strong>&quot;) and <strong>{LEGAL_ENTITY}</strong> (&quot;<strong>Company</strong>&quot;, &quot;<strong>We</strong>&quot;, &quot;<strong>Us</strong>&quot;, or &quot;<strong>Our</strong>&quot;).
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              By accessing the website located at <code>pustakedit.vercel.app</code>, invoking API endpoints under <code>/api/tools/*</code> or <code>/api/pdf/*</code>, or transmitting any electronic document to our infrastructure, you unreservedly assent to the practices, collection vectors, and processing protocols detailed herein. If you do not agree to these strict provisions, you must immediately terminate use of the platform and disconnect your browser.
            </p>
          </section>

          {/* Section 2 */}
          <section id="roles" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 2.0</span>
              <span>Classification: Data Controller vs. Data Processor</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                To maintain comprehensive compliance with the General Data Protection Regulation (GDPR - Regulation (EU) 2016/679), UK Data Protection Act 2018, and relevant privacy laws, the legal capacity in which PustakEdits operates is expressly partitioned as follows:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-zinc-300">
                <li>
                  <strong className="text-white">PustakEdits as Data Controller:</strong> PustakEdits acts as the Data Controller solely with respect to account registration credentials (email address, hashed credentials, OAuth token claims) and essential HTTP connection telemetrics necessary to secure the network infrastructure against Denial-of-Service (&quot;DoS&quot;) attacks.
                </li>
                <li>
                  <strong className="text-white">PustakEdits as Data Processor (Operator):</strong> With respect to all user-uploaded document payloads, embedded text layers, images, signatures, and file metadata transmitted into our parsing algorithms, the <strong>User acts as the sole Data Controller</strong>. PustakEdits acts exclusively as an automated technical Data Processor executing commands on behalf of the User.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="collection" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 3.0</span>
              <span>Explicit Categories of Data Collected and Processed</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                We adhere to strict data minimization principles under GDPR Article 5(1)(c). We collect only data strictly indispensable to execute technical PDF manipulation:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-1.5">
                  <span className="text-xs font-bold text-white">A. Ephemeral Document Data</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Binary byte arrays of uploaded PDF, Word, Excel, PowerPoint, and image files. Processed in volatile memory or isolated ephemeral filesystem sandboxes. Deleted permanently within 24 hours.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-1.5">
                  <span className="text-xs font-bold text-white">B. Account &amp; Auth Credentials</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    User email addresses and cryptographic authentication tokens when registering via Supabase Auth or Google OAuth. Passwords are never stored in plaintext and are salted/hashed with industry standards.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-1.5">
                  <span className="text-xs font-bold text-white">C. Rate-Limiting &amp; Telemetry</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    IP address hashes, timestamp headers, and quota consumption counters stored in sliding-window rate limiters solely to prevent server exhaustion and unauthorized bot exploitation.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-1.5">
                  <span className="text-xs font-bold text-white">D. Browser Local Storage</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Recent document references and UI preferences stored strictly client-side on the User&apos;s physical device via HTML5 LocalStorage. Never synced to remote advertising profiles.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="legal-basis" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 4.0</span>
              <span>Lawful Basis for Processing (GDPR Article 6)</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>Processing of data is conducted solely under the following legal bases:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-zinc-300">
                <li>
                  <strong className="text-white">Performance of Contract (Art. 6(1)(b)):</strong> Executing the requested text editing, compression, OCR extraction, conversion, or watermarking requested directly by the User.
                </li>
                <li>
                  <strong className="text-white">Legitimate Interests (Art. 6(1)(f)):</strong> Maintaining server perimeter defense, safeguarding computational nodes from distributed attacks, rate-limiting spam requests, and verifying API health.
                </li>
                <li>
                  <strong className="text-white">Compliance with Legal Obligations (Art. 6(1)(c)):</strong> Retaining records strictly where mandated by statutory legal directives, lawful judicial subpoenas, or valid law enforcement orders.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="ai-prohibition" className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/10 to-zinc-950 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-mono">§ 5.0</span>
              <span>Absolute Prohibition of Artificial Intelligence Model Training</span>
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-mono">
              CONTRACTUAL GUARANTEE: YOUR PROPRIETARY DOCUMENT CONTENT, VECTOR TEXT SPANS, AND INTELLECTUAL PROPERTY ARE STRICTLY IMMUNE FROM MACHINE LEARNING INGESTION.
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Under no circumstances does {LEGAL_ENTITY}, its operators, affiliates, contractors, or compute suppliers parse, tokenize, index, retain, train upon, or aggregate any portion of user documents into large language models (LLMs), deep neural networks, public corpora, or derivative machine learning models. Document parsing is strictly mechanical and algorithmic via native C/C++ libraries (PyMuPDF, Poppler, Tesseract OCR) executing directly in transient sandboxes.
            </p>
          </section>

          {/* Section 6 */}
          <section id="ephemeral-storage" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 6.0</span>
              <span>24-Hour Ephemeral Data Lifecycle &amp; Cryptographic Sanitation</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                All uploaded files, converted outputs, and intermediary rendering caches follow an uncompromising time-to-live (&quot;TTL&quot;) protocol:
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>0 to 60 Seconds: Processing in volatile memory or isolated execution sandbox.</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>1 to 24 Hours: Stored exclusively for User download retrieval via cryptographically unguessable UUID.</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>24th Hour: Automated asynchronous cron sweeps and invokes filesystem unlinks, permanently purging artifacts from storage blocks.</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500">
                Once purged, documents cannot be recovered by any party, including system administrators or law enforcement, as zero cold archival backups of document bodies are maintained.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="security" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 7.0</span>
              <span>Technical &amp; Organizational Security Measures (TOMs)</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                In compliance with Article 32 of the GDPR, {LEGAL_ENTITY} maintains enterprise-grade administrative, physical, and technical safeguards:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-300">
                <li><strong>Encryption in Transit:</strong> Mandatory TLS 1.3 encryption across all public network endpoints.</li>
                <li><strong>Encryption at Rest:</strong> Ephemeral server storage encrypted utilizing AES-256 block cipher standards.</li>
                <li><strong>Network Isolation:</strong> Application compute tiers operate inside segregated cloud container network boundaries with zero public database exposure.</li>
                <li><strong>Vulnerability Management:</strong> Automated static code analysis and dependency auditing for rapid patching of Common Vulnerabilities and Exposures (CVEs).</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section id="subprocessors" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 8.0</span>
              <span>Authorized Infrastructure Sub-processors</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                We do not sell, license, lease, or distribute data to data brokers or advertising exchanges. We engage strictly authorized infrastructure sub-processors:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-zinc-800 rounded-xl overflow-hidden">
                  <thead className="bg-zinc-900 text-zinc-300">
                    <tr>
                      <th className="p-3">Sub-processor</th>
                      <th className="p-3">Function / Processing Role</th>
                      <th className="p-3">Data Categories Handled</th>
                      <th className="p-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 text-zinc-400">
                    <tr>
                      <td className="p-3 font-semibold text-white">Supabase Inc.</td>
                      <td className="p-3">Identity management &amp; auth token verification</td>
                      <td className="p-3">Account Email, User UUID</td>
                      <td className="p-3">United States / EU</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Vercel Inc.</td>
                      <td className="p-3">Frontend edge content delivery &amp; static assets</td>
                      <td className="p-3">HTTP Headers, Anonymized IP</td>
                      <td className="p-3">Global Edge</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Self-Hosted Cloud Compute</td>
                      <td className="p-3">PyMuPDF / OCR document manipulation engine</td>
                      <td className="p-3">Ephemeral PDF byte streams</td>
                      <td className="p-3">Secure Regional Data Centers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="gdpr-rights" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 9.0</span>
              <span>European Economic Area (EEA) &amp; UK Data Subject Rights</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                Qualified residents within the European Economic Area, Switzerland, and the United Kingdom enjoy statutory rights under Chapter III of the GDPR:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-300">
                <li><strong>Right of Access (Art. 15):</strong> Right to obtain confirmation of whether your personal data is processed.</li>
                <li><strong>Right to Rectification (Art. 16):</strong> Right to rectify inaccurate account information.</li>
                <li><strong>Right to Erasure / &quot;Right to Be Forgotten&quot; (Art. 17):</strong> Right to request irreversible deletion of user account credentials. (Uploaded document payloads are deleted automatically within 24 hours without requiring a manual request).</li>
                <li><strong>Right to Restriction &amp; Data Portability (Arts. 18 &amp; 20):</strong> Right to demand restriction of processing and receive machine-readable exports of stored credentials.</li>
              </ul>
              <p className="text-xs pt-1">
                To exercise any statutory GDPR entitlement, submit an authenticated request to our Data Protection representative at <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-400 underline">{CONTACT_EMAIL}</a>. Responses are provided within thirty (30) days.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="ccpa-rights" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 10.0</span>
              <span>California Consumer Privacy Rights (CCPA / CPRA Notice)</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                Pursuant to the California Consumer Privacy Act of 2018 (Cal. Civ. Code § 1798.100 et seq.) as amended by the California Privacy Rights Act of 2020 (&quot;<strong>CCPA/CPRA</strong>&quot;):
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1 text-xs">
                <span className="font-bold text-white block">DO NOT SELL OR SHARE MY PERSONAL INFORMATION</span>
                <p className="text-zinc-400">
                  {LEGAL_ENTITY} has never sold, shared, monetized, or transferred personal information to third parties for monetary or other valuable consideration, nor do we engage in cross-context behavioral advertising.
                </p>
              </div>
              <p className="text-xs">
                California residents possess the Right to Know, Right to Delete, Right to Correct, and the Right to Non-Discrimination for exercising statutory privacy rights.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="hipaa" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 11.0</span>
              <span>Health Information &amp; Regulatory Compliance Disclaimers</span>
            </h2>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-200 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-300">
                <AlertTriangle size={15} />
                <span>MANDATORY HEALTHCARE REGULATORY NOTICE</span>
              </div>
              <p>
                {LEGAL_ENTITY} is an automated consumer utility platform and does not maintain Business Associate Agreements (&quot;BAA&quot;) by default under the Health Insurance Portability and Accountability Act of 1996 (&quot;<strong>HIPAA</strong>&quot;). Users are strictly prohibited from uploading unencrypted Protected Health Information (&quot;PHI&quot;) subject to HIPAA, or non-public financial records under the Gramm-Leach-Bliley Act (&quot;GLBA&quot;), unless the User has independently verified that their use case complies with applicable state and federal compliance thresholds.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="breach" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 12.0</span>
              <span>Data Security Incident &amp; Breach Notification Protocol</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              In the event of a verified security incident resulting in unlawful access, exfiltration, or disclosure of identifiable user data under our control, {LEGAL_ENTITY} commits to notifying affected Data Subjects and relevant supervisory authorities without undue delay, and no later than seventy-two (72) hours after becoming aware of the breach, pursuant to GDPR Article 33.
            </p>
          </section>

          {/* Section 13 */}
          <section id="amendments" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 13.0</span>
              <span>Unilateral Amendments &amp; Revision Notifications</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              We reserve the absolute right to amend, update, or revise this Privacy Policy at our sole discretion to reflect changes in regulatory directives, technological standards, or platform functionality. The &quot;Last Revised&quot; date at the commencement of this document signifies the effective version. Continued interaction with the platform post-publication constitutes affirmative acceptance of the revised terms.
            </p>
          </section>

          {/* Section 14 */}
          <section id="contact" className="rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-teal-400 font-mono">§ 14.0</span>
              <span>Designated Data Protection Representative &amp; Formal Inquiries</span>
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
              <p>
                For questions regarding data processing, requests to exercise statutory rights, or service of legal process, please direct correspondence to the designated representative:
              </p>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1.5 font-mono">
                <div><span className="text-zinc-500">Officer:</span> <strong className="text-white">Vishwesh Shinde</strong></div>
                <div><span className="text-zinc-500">Entity:</span> <span className="text-zinc-300">PustakEdits Platform Compliance Group</span></div>
                <div><span className="text-zinc-500">Email:</span> <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-400 underline">{CONTACT_EMAIL}</a></div>
                <div><span className="text-zinc-500">Jurisdiction:</span> <span className="text-zinc-300">{GOVERNING_JURISDICTION}</span></div>
              </div>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs transition-colors"
                >
                  <span>Submit Formal Privacy Inquiry</span>
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
