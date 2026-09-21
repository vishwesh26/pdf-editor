"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ArrowRight,
  Search,
  Sparkles,
  X,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { Button } from "@/components/ui/button";
import AnimatedPdfDemo from "@/components/home/AnimatedPdfDemo";
import { PDF_TOOLS, TOOL_CATEGORIES } from "@/lib/tools-data";
import ToolIcon from "@/components/tools/ToolIcon";
import { ToolCategory } from "@/types/tools";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

const FAQ_ITEMS = [
  {
    q: "Is PustakEdits really 100% free with no watermarks?",
    a: "Yes. There are no hidden charges, trial paywalls, or watermarks stamped onto your documents. You can modify as many document-generated PDFs as you need.",
  },
  {
    q: "Are my uploaded documents private and secure?",
    a: "Completely. Your uploaded files are stored temporarily on isolated ephemeral processing servers strictly for your editing session and are automatically deleted after 24 hours. We never read or store your documents.",
  },
  {
    q: "What types of PDFs are supported?",
    a: "PustakEdits works on document-generated PDFs (such as invoices, agreements, statements, resumes, and reports) containing genuine text layers. Scanned bitmap images without OCR do not possess selectable text.",
  },
  {
    q: "How fast is document processing?",
    a: "Our core processing engine runs at native C-level speed. Tools like Merge, Split, and Rotate complete in under 0.05 seconds, while our high-efficiency compression handles multi-megabyte documents in under 1 second.",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("https://api.github.com/repos/vishwesh26/pdf-editor")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch GitHub repo info");
        return res.json();
      })
      .then((data) => {
        if (isMounted && typeof data.stargazers_count === "number") {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // Silently fallback if offline or rate limited
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PDF_TOOLS.filter((tool) => {
      const matchesSearch =
        !query ||
        tool.title.toLowerCase().includes(query) ||
        tool.shortTitle.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((k) => k.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Compute category counts for pills
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: PDF_TOOLS.length };
    TOOL_CATEGORIES.forEach((cat) => {
      counts[cat] = PDF_TOOLS.filter((t) => t.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <div className="flex flex-col items-center overflow-hidden min-w-0 w-full">
      {/* ─── HERO HEADER & SEARCH ─── */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-6 text-center flex flex-col items-center">
       

        {/* Hero Title */}
        <div data-grid-avoid className="mb-3.5 max-w-4xl flex justify-center">
          <BlurText
            text="Every PDF Tool You Need, In One Place."
            delay={60}
            animateBy="words"
            direction="top"
            className="text-[1.85rem] sm:text-5xl md:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] justify-center text-center"
          />
        </div>

        {/* Hero Subtitle */}
        <motion.p
          data-grid-avoid
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-sm sm:text-base text-zinc-400 mb-5 max-w-2xl leading-relaxed px-2"
        >
          Compress, merge, split, convert, sign, and directly edit the real text inside your documents.
          Private, fast, and completely free in your browser.
        </motion.p>

        

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="w-full max-w-lg relative mb-5"
        >
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 30+ tools (e.g. compress, merge, word, sign)..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full max-w-full overflow-x-auto pb-2 scrollbar-none min-w-0"
        >
          <div className="flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 w-max mx-auto px-1">
            {["All", ...TOOL_CATEGORIES].map((category) => {
              const isSelected = selectedCategory === category;
              const count = categoryCounts[category] ?? 0;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-white text-zinc-950 font-bold shadow-md"
                      : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/80"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-zinc-200 text-zinc-900"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ─── ALL PDF TOOLS GRID (TOP FEATURE) ─── */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
            {filteredTools.map((tool, idx) => {
              const href = tool.slug === "edit-pdf" ? "/dashboard" : `/tools/${tool.slug}`;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.3) }}
                  whileHover={{ y: -3 }}
                  className="w-full min-w-0"
                >
                  <Link
                    href={href}
                    className="group flex flex-col justify-between h-full min-h-[120px] sm:min-h-[160px] p-3 sm:p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-200 shadow-sm w-full min-w-0 overflow-hidden relative"
                  >
                    {/* Top Row: Icon + Badge */}
                    <div className="space-y-2 sm:space-y-3 w-full">
                      <div className="flex items-center justify-between w-full">
                        <div
                          className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-zinc-900/90 border border-zinc-800 group-hover:border-zinc-700 transition-colors shrink-0 shadow-sm"
                          style={{ color: tool.accentColor }}
                        >
                          <ToolIcon name={tool.icon} size={18} />
                        </div>

                        {tool.badge && (
                          <span
                            className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                              tool.badge === "Flagship"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                : tool.badge === "Popular"
                                ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                                : tool.badge === "AI"
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                            }`}
                          >
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="w-full min-w-0">
                        <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-teal-300 transition-colors leading-tight line-clamp-1">
                          {tool.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA on card */}
                    <div className="pt-3 sm:pt-4 mt-2 sm:mt-3 border-t border-zinc-900/90 flex items-center justify-between text-[10px] sm:text-xs text-zinc-500 group-hover:text-zinc-300 font-medium w-full">
                      <span>{tool.isReady ? (tool.slug === "edit-pdf" ? "Open Editor" : "Launch Tool") : "Coming Soon"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-zinc-400 group-hover:text-teal-300" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-500 space-y-3 bg-zinc-950/40 rounded-2xl border border-zinc-800/60 p-8">
            <SlidersHorizontal className="w-8 h-8 mx-auto text-zinc-600" />
            <p className="text-sm font-medium text-zinc-300">
              No tools found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 underline font-medium cursor-pointer"
            >
              Reset search and show all 30+ tools
            </button>
          </div>
        )}
      </section>

      {/* ─── FLAGSHIP HERO BANNER (DIRECT VECTOR TEXT EDITOR) ─── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="rounded-3xl p-6 sm:p-10 border border-orange-500/30 bg-gradient-to-r from-orange-950/25 via-zinc-950 to-zinc-950/90 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold tracking-wider">
                  Flagship Feature
                </span>
                <span className="text-xs text-zinc-400">PustakEdits Core Innovation</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Direct Vector PDF Text Editor
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Unlike ordinary PDF editors that paint opaque white rectangles over existing text, PustakEdits directly rewrites the internal font text layer. Original fonts, layout, and clean backgrounds are preserved perfectly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="white"
                  size="lg"
                  className="w-full sm:w-auto gap-2 px-6 h-12 text-sm font-bold shadow-lg cursor-pointer"
                >
                  <span>Launch Text Editor</span>
                  <ArrowRight size={15} />
                </Button>
              </Link>
              <a
                href="https://github.com/vishwesh26/pdf-editor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Star vishwesh26/pdf-editor on GitHub"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 h-12 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all shadow-sm group cursor-pointer"
              >
                <GithubIcon className="w-4 h-4 text-zinc-300 group-hover:text-white" />
                <span className="font-semibold">Star on GitHub</span>
                <span className="h-3.5 w-px bg-zinc-800" />
                <span className="inline-flex items-center gap-1 font-mono text-xs text-zinc-400 group-hover:text-amber-300">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                  <span>{starCount !== null ? starCount.toLocaleString() : "0"}</span>
                </span>
              </a>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-sm px-5 h-12 border border-white/15 bg-white/5 hover:bg-white/10 text-zinc-200 transition-all cursor-pointer"
                >
                  <span>Watch Demo ↓</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ANIMATED DEMO ─── */}
      <section
        id="demo"
        className="w-full py-16 sm:py-24 border-t border-white/10 bg-transparent"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">
              Watch the Vector Editor in Action
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Click a text block, select it, retype, and save. That&apos;s it.
            </p>
          </div>

          <AnimatedPdfDemo />
        </motion.div>
      </section>

      {/* ─── HOW IT'S DIFFERENT ─── */}
      <section className="w-full py-14 sm:py-24 border-t border-white/10 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              Why PustakEdits is Different
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
              Engineered for genuine precision without destructive hacks.
            </p>
          </div>

          <SpotlightCard
            spotlightColor="rgba(255, 255, 255, 0.06)"
            className="p-0 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              {/* Other tools */}
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-2 text-zinc-400 font-semibold text-sm mb-4 sm:mb-5">
                  <XCircle size={16} className="text-zinc-500" />
                  <span>Other PDF editors</span>
                </div>
                <ul className="space-y-4 text-sm text-zinc-400">
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-500 font-bold mt-0.5">✕</span>
                    <span>Paint a white rectangle over existing text, blocking background graphics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-500 font-bold mt-0.5">✕</span>
                    <span>Use mismatched generic browser fonts that look out of place</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-500 font-bold mt-0.5">✕</span>
                    <span>Stamp watermarks on export or charge $15–25/month</span>
                  </li>
                </ul>
              </div>

              {/* PustakEdits */}
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-2 text-white font-semibold text-sm mb-4 sm:mb-5">
                  <CheckCircle2 size={16} className="text-white" />
                  <span>PustakEdits</span>
                </div>
                <ul className="space-y-4 text-sm text-zinc-300">
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span>Rewrites the actual PDF text layer — content streams, not overlays</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span>Preserves original font family, weight, size, and color automatically</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span>100% free, zero watermarks, files auto-deleted in 24 hours</span>
                  </li>
                </ul>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </section>

      {/* ─── FAQ + CTA ─── */}
      <section className="w-full py-14 sm:py-24 border-t border-white/10 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Everything you need to know about our tools and security.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden hover:border-zinc-700 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-medium text-white text-sm hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Inline CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-sm text-zinc-400 mb-4">
              Ready to edit or convert your document?
            </p>
            <Link href="/dashboard" className="inline-block w-full sm:w-auto">
              <Button
                variant="white"
                size="lg"
                className="w-full sm:w-auto px-8 h-12 text-sm font-semibold gap-2 cursor-pointer"
              >
                <span>Start Editing — Free</span>
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
