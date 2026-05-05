"use client";

import { Mail, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-10 border border-black/10 dark:border-white/10 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-8">Get in touch</h2>

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Name */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <User size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Contact Person
              </p>
              <p className="text-lg font-bold">Vishwesh Shinde</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Email Address
              </p>
              <a
                href="mailto:Vishweshshinde26@gmail.com"
                className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                Vishweshshinde26@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 text-center">
          <a
            href="mailto:Vishweshshinde26@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:scale-105 hover:shadow-lg transition-all"
          >
            <Mail size={18} />
            Send an Email
          </a>
        </div>
      </motion.div>
    </div>
  );
}
