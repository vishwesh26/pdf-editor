"use client";

import { motion } from "framer-motion";

const LAST_UPDATED = "May 5, 2025";
const CONTACT_EMAIL = "Vishweshshinde26@gmail.com";
const BRAND = "PustakEdits";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-extrabold mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="prose prose-zinc dark:prose-invert max-w-none space-y-10"
      >
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to <strong>{BRAND}</strong>. We respect your privacy and are committed to protecting
            any personal data you share with us. This Privacy Policy explains what information we collect,
            how we use it, and what rights you have regarding your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>
              <strong>Account information</strong> — email address when you sign up or log in via Google OAuth.
            </li>
            <li>
              <strong>Uploaded PDF files</strong> — files you upload for editing. These are stored temporarily
              and <strong>automatically deleted after 24 hours</strong>.
            </li>
            <li>
              <strong>Usage data</strong> — basic analytics such as pages visited and features used, collected
              anonymously to improve the service.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>To provide and operate the PDF editing service.</li>
            <li>To authenticate you and maintain your session securely.</li>
            <li>To improve site functionality and user experience.</li>
            <li>To respond to your queries or support requests.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            We <strong>do not</strong> sell, rent, or share your personal data with third parties for
            marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. File Storage & Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            Uploaded PDF files are stored on secure servers solely for the purpose of processing your edits.
            All files are <strong>automatically purged within 24 hours</strong> of upload. We use
            industry-standard encryption (HTTPS/TLS) for all data in transit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Cookies and Advertising</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use essential cookies required for authentication and session management. Additionally, we use third-party vendors, including Google AdSense, to serve ads on our site.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed mt-3">
            <li>
              Google uses cookies to serve ads based on a user&apos;s prior visits to your website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              You may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Ads Settings</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We rely on certain trusted third-party services to operate {BRAND}:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>
              <strong>Supabase</strong>: Used for authentication and database storage. Their practices are governed by the <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Supabase Privacy Policy</a>.
            </li>
            <li>
              <strong>Google AdSense</strong>: Used to display advertisements. AdSense uses cookies to personalize ads. Their practices are governed by the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Privacy Policy</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
            <li>Access or correct the personal information we hold about you.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Withdraw consent at any time by deleting your account.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            To exercise any of these rights, please contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 dark:text-blue-400 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page
            with an updated &quot;Last updated&quot; date. Continued use of {BRAND} after changes constitutes
            your acceptance of the new policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please reach out to{" "}
            <strong>Vishwesh Shinde</strong> at{" "}
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
