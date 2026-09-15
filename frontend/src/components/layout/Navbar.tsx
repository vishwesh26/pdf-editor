"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="gap-1.5 text-xs font-semibold">
                <span>Launch Editor</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
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
