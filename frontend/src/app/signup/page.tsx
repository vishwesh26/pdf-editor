"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter email and password");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        }
      });

      if (error) throw error;
      
      toast.success("Check your email for the verification link!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-black/10 dark:border-white/10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Create an account</h1>
        <p className="text-center text-muted-foreground mb-8">Get started with free PDF editing</p>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
              placeholder="Create a strong password" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4 shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            Sign Up with Email
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200 dark:border-zinc-800"></div>
          <span className="px-3 text-xs text-muted-foreground uppercase bg-white dark:bg-zinc-900">Or continue with</span>
          <div className="flex-1 border-t border-gray-200 dark:border-zinc-800"></div>
        </div>

        <button 
          onClick={handleGoogleSignup}
          disabled={isLoading || isGoogleLoading}
          className="w-full py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-foreground rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
          )}
          Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={`/login${redirectTo !== '/dashboard' ? `?redirect=${redirectTo}` : ''}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
