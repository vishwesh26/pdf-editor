"use client";

import { motion } from "framer-motion";

const LAST_UPDATED = "May 5, 2025";
const CONTACT_EMAIL = "Vishweshshinde26@gmail.com";
const BRAND = "PustakEdits";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-extrabold mb-3">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="prose prose-zinc dark:prose-invert max-w-none space-y-10"
      >
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using <strong>{BRAND}</strong> (&quot;the Service&quot;), you agree to be bound
            by these Terms &amp; Conditions. If you do not agree with any part of these terms, you may not
            use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Description of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            {BRAND} is a free, browser-based PDF editing tool that allows users to modify the text layer of
            document-generated PDFs. The Service is provided &quot;as is&quot; and is free of charge with no
            subscription required.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. User Accounts</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>
              You must be at least 13 years of age (or the minimum digital age of consent in your
              jurisdiction) to use this Service.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Acceptable Use</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You agree to use {BRAND} only for lawful purposes. You must not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>Upload or edit documents that contain illegal, fraudulent, or harmful content.</li>
            <li>
              Use the Service to forge, falsify, or fraudulently modify official documents (e.g. government
              IDs, legal contracts, financial records) with intent to deceive.
            </li>
            <li>Attempt to reverse-engineer, hack, or disrupt the Service.</li>
            <li>Use automated bots or scrapers to interact with the Service without prior consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. File Handling</h2>
          <p className="text-muted-foreground leading-relaxed">
            All uploaded PDF files are processed securely and <strong>automatically deleted within 24 hours</strong>.
            You retain full ownership of any documents you upload. By uploading a file, you grant {BRAND} a
            temporary, limited licence to process the file solely for the purpose of providing the editing
            service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            The {BRAND} name, logo, and interface design are the intellectual property of Vishwesh Shinde.
            You may not copy, reproduce, or redistribute any part of the interface without explicit written
            permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Service is provided <strong>&quot;as is&quot;</strong> without warranty of any kind — express or
            implied. We do not warrant that the Service will be uninterrupted, error-free, or produce
            perfectly accurate results for all PDF files. Use the Service at your own discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by applicable law, {BRAND} and its creator shall not be liable
            for any indirect, incidental, special, or consequential damages arising from your use of the
            Service, including but not limited to loss of data or documents.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to suspend or terminate access to the Service for any user who violates
            these Terms, without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these Terms from time to time. Updated terms will be posted on this page with a
            revised &quot;Last updated&quot; date. Continued use of the Service after any changes constitutes
            acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">11. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of India. Any disputes
            arising under these Terms shall be subject to the exclusive jurisdiction of courts in India.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">12. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Questions about these Terms? Contact <strong>Vishwesh Shinde</strong> at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 dark:text-blue-400 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </motion.div>
    </div>
  );
}
