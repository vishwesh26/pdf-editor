"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileMenuOpen(false);
  }

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl px-4 sm:px-6 h-14 sm:h-15 flex items-center justify-between border border-zinc-800/90 bg-zinc-950/80 backdrop-blur-xl shadow-sm">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              Pustak<span className="text-zinc-400 font-normal">Edits</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hidden sm:inline-flex">
              Free
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-white font-semibold bg-zinc-900"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA & GitHub Badge */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="https://github.com/vishwesh26/pdf-editor"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star vishwesh26/pdf-editor on GitHub"
              className="inline-flex items-center gap-2 px-2.5 py-1.5 h-8 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all duration-200 group"
            >
              <GithubIcon className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors" />
              <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">GitHub</span>
              <span className="h-3 w-px bg-zinc-800" />
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 group-hover:text-amber-300 transition-colors">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400 transition-transform group-hover:scale-110" />
                <span>{starCount !== null ? starCount.toLocaleString() : "0"}</span>
              </span>
            </a>

            <Link href="/dashboard">
              <Button variant="default" size="sm" className="gap-1.5 text-xs font-semibold">
                <span>Launch Editor</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button & Compact GitHub link */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="https://github.com/vishwesh26/pdf-editor"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star vishwesh26/pdf-editor on GitHub"
              className="inline-flex items-center gap-1.5 px-2 py-1 h-8 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900/90 border border-zinc-800 rounded-lg transition-colors group"
            >
              <GithubIcon className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 group-hover:text-amber-300">
                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span>{starCount !== null ? starCount.toLocaleString() : "0"}</span>
              </span>
            </a>

            <Link href="/dashboard">
              <Button variant="default" size="sm" className="px-3 h-8 text-xs font-semibold">
                Editor
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden mt-2 mx-auto max-w-6xl"
          >
            <div className="rounded-2xl p-4 border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl space-y-3 shadow-xl">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={14} className="text-zinc-600" />
                  </Link>
                ))}
              </nav>

              <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
                <a
                  href="https://github.com/vishwesh26/pdf-editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-zinc-300" />
                    <span>Star on GitHub</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{starCount !== null ? starCount.toLocaleString() : "0"}</span>
                  </span>
                </a>

                <Link href="/dashboard" className="w-full">
                  <Button variant="default" className="w-full justify-center text-xs">
                    Launch Free Editor
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
