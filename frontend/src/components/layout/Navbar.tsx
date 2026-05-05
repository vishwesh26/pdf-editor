"use client";

import Link from 'next/link';
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight">Pustak<span className="text-blue-600 dark:text-blue-400">Edits</span></span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden md:inline-block">
                {user.email}
              </span>
              <button 
                onClick={() => signOut()}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Log in
              </Link>
              <Link href="/signup" className="text-sm font-medium px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform">
                Sign up free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
