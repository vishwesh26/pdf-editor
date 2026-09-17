"use client";

import { useState } from "react";
import {
  Mail,
  User,
  Send,
  MessageSquare,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState("General Support");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailAddress = "Vishweshshinde26@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setIsSubmitted(true);
      toast.success("Message received! A confirmation has been sent to your email.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium mb-4">
          <span>Support & Feedback</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Have a question about font preservation, found a bug in a PDF, or want to suggest a feature?
          We would love to hear from you.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Direct Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4 md:col-span-1"
        >
          <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500">
                  Lead Developer
                </span>
                <h3 className="font-bold text-white text-base">Vishwesh Shinde</h3>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Creator of PustakEdits. Actively building PDF tools and developer utilities.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500">
                  Email Address
                </span>
                <h3 className="font-bold text-white text-xs sm:text-sm break-all">
                  {emailAddress}
                </h3>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="w-full mt-2 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              <span>{copied ? "Copied to clipboard!" : "Copy Email Address"}</span>
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-xl text-xs text-zinc-400 flex items-center gap-3">
            <Clock size={18} className="text-zinc-300 shrink-0" />
            <div>
              <div className="font-bold text-white">Fast Turnaround</div>
              <div className="text-[11px] text-zinc-400">Usually responds within 24 hours</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact & Feedback Form */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="md:col-span-2 rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="py-8 px-4 text-center space-y-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-medium">{name}</span>! We have received your inquiry regarding <span className="text-teal-300 font-medium">{category}</span>.
                </p>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  An automated confirmation has been dispatched to <span className="text-zinc-200 font-mono">{email}</span>. Our support team will review your message and reply shortly.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs text-zinc-300 hover:text-white"
                >
                  <RotateCcw size={14} />
                  <span>Send Another Message</span>
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <MessageSquare size={18} className="text-zinc-300" />
                Send a Direct Message
              </h2>
              <p className="text-xs text-zinc-400 mb-6">
                Choose a topic and share your feedback or technical inquiry.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Pills */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Subject Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "General Support",
                      "Bug Report",
                      "Feature Request",
                      "Business Inquiry",
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          category === cat
                            ? "bg-white text-black font-semibold shadow-sm"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:border-white/40 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:border-white/40 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Message & Details
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Describe your question, document issues, or ideas..."
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:border-white/40 focus:ring-1 focus:ring-white/20 outline-none resize-none leading-relaxed transition-all"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="white"
                  size="lg"
                  className="w-full justify-center text-sm font-semibold gap-2"
                >
                  <Send size={15} />
                  <span>{isSubmitting ? "Sending..." : "Submit Message"}</span>
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
