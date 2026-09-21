"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileEdit,
  Loader2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import TurnstileWidget, { TurnstileWidgetRef } from "@/components/ui/TurnstileWidget";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Flow step: 'form' | 'verify'
  const [step, setStep] = useState<"form" | "verify">("form");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Loading & Timer states
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  // Resend cooldown timer
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const interval = setInterval(() => {
      setResendSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendSeconds]);

  // Step 1: Submit signup form
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Please enter your full name");
    if (name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    if (!email.trim()) return toast.error("Please enter your email address");
    if (!password) return toast.error("Please enter a password");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (!turnstileToken) return toast.error("Please complete the Cloudflare security verification");

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            display_name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
          captchaToken: turnstileToken,
        },
      });

      if (error) throw error;

      // If user already exists and is confirmed
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("An account with this email already exists. Please log in instead.");
        router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
        return;
      }

      toast.success("Verification code sent! Please check your email inbox.");
      setStep("verify");
      setResendSeconds(60);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create account");
      }
    } finally {
      setIsLoading(false);
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  };

  // Step 2: Verify OTP Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = verificationCode.trim();

    if (!cleanCode) {
      return toast.error("Please enter the verification code sent to your email");
    }

    setIsVerifying(true);
    try {
      // First attempt with type: 'signup'
      let { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: cleanCode,
        type: "signup",
      });

      // Fallback attempt with type: 'email' if signup type is rejected
      if (error) {
        const retry = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: cleanCode,
          type: "email",
        });
        if (!retry.error) {
          data = retry.data;
          error = null;
        }
      }

      if (error) throw error;

      toast.success("Email verified successfully! Welcome to PustakEdits.");
      router.push(redirectTo);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Invalid or expired verification code");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend Verification Code
  const handleResendCode = async () => {
    if (resendSeconds > 0 || isResending) return;
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });
      if (error) throw error;

      toast.success("New verification code sent to your email!");
      setResendSeconds(60);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to resend verification code");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        {step === "form" ? (
          <>
            {/* Brand Header */}
            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-4 shadow-sm">
                <FileEdit className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Enter your details to create an account via email verification
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 sm:top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:border-white/40 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 sm:top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:border-white/40 outline-none transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5"
                >
                  Choose Password (6+ chars)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 sm:top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 sm:py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:border-white/40 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 sm:top-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 sm:top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 sm:py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:border-white/40 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 sm:top-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Cloudflare Turnstile Bot Security Widget */}
              <TurnstileWidget
                ref={turnstileRef}
                action="signup"
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken("")}
                onError={() => {
                  setTurnstileToken("");
                  toast.error("Turnstile verification failed. Please try again.");
                }}
              />

              <Button
                type="submit"
                disabled={isLoading || !turnstileToken}
                variant="white"
                size="lg"
                className="w-full justify-center text-sm font-semibold gap-2 mt-3 cursor-pointer"
              >
                {isLoading && <Loader2 size={16} className="animate-spin text-black" />}
                <span>Create Account &amp; Send Code</span>
              </Button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center text-xs text-zinc-400">
              Already have an account?{" "}
              <Link
                href={`/login${redirectTo !== "/dashboard" ? `?redirect=${redirectTo}` : ""}`}
                className="text-white hover:underline font-semibold"
              >
                Log in
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Verification Code View */}
            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
              <div className="h-14 w-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-sm">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Verify Your Email</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-sm">
                We sent a verification code to{" "}
                <span className="text-white font-medium">{email}</span>. Please enter it below to activate your account.
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center mb-2"
                >
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  maxLength={10}
                  autoFocus
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\s+/g, ""))}
                  placeholder="123456"
                  className="w-full py-3.5 px-4 bg-zinc-900 border border-white/15 rounded-xl text-center text-2xl font-mono font-extrabold tracking-[0.35em] text-white placeholder:text-zinc-700 focus:border-teal-400 outline-none transition-all shadow-inner"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isVerifying || verificationCode.trim().length < 4}
                variant="white"
                size="lg"
                className="w-full justify-center text-sm font-semibold gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} className="text-black" />
                    <span>Verify &amp; Activate Account</span>
                  </>
                )}
              </Button>

              {/* Resend & Edit Email options */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Change details</span>
                </button>

                <button
                  type="button"
                  disabled={resendSeconds > 0 || isResending}
                  onClick={handleResendCode}
                  className="text-teal-400 hover:text-teal-300 disabled:text-zinc-600 font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <RotateCcw size={13} className={isResending ? "animate-spin" : ""} />
                  <span>
                    {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend Code"}
                  </span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-400" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
