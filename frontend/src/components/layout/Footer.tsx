import Link from "next/link";
import { ShieldCheck, ArrowUpRight, Sparkles } from "lucide-react";
import { TOOL_CATEGORIES, getToolsByCategory } from "@/lib/tools-data";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 mt-16 sm:mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Section-Wise PDF Tools Directory */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              PDF Tools Directory
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 text-xs">
            {TOOL_CATEGORIES.map((category) => {
              const tools = getToolsByCategory(category);
              return (
                <div key={category} className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400/90 pb-1 border-b border-zinc-800/70">
                    {category}
                  </h4>
                  <ul className="space-y-1.5">
                    {tools.map((tool) => {
                      const href = tool.slug === "edit-pdf" ? "/dashboard" : `/tools/${tool.slug}`;
                      return (
                        <li key={tool.id}>
                          <Link
                            href={href}
                            className="text-zinc-400 hover:text-white transition-colors block py-0.5 truncate group"
                            title={tool.title}
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform inline-block">
                              {tool.shortTitle}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company, Brand, and Legal Section */}
        <div className="pt-10 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-base tracking-tight text-white">
                Pustak<span className="text-zinc-400 font-normal">Edits</span>
              </span>
            </Link>

            <p className="max-w-sm text-xs text-zinc-400 leading-relaxed">
              Browser-based PDF text editor and complete utility suite. Directly modify original text layers in document-generated PDFs while preserving authentic font glyphs and layout.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-mono text-zinc-400">
                Processing Engine Online • Free Forever
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/#features" className="hover:text-white transition-colors inline-block py-1">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors inline-block py-1">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors inline-block py-1">
                  All PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors inline-block py-1">
                  Pricing (100% Free)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors inline-flex items-center gap-1 py-1">
                  Launch Editor
                  <ArrowUpRight size={12} className="text-zinc-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors inline-block py-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors inline-block py-1">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors inline-block py-1">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} PustakEdits. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
              Files Auto-Deleted after 24h
            </span>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <span>Zero Watermarks</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
