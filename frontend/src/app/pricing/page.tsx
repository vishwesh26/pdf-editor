"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";

function RazorpayButton({ email }: { email: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    
    // Check if script already exists to prevent duplicates in strict mode
    if (formRef.current.querySelector('script')) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_Sj0Y6lB8HRILVi");
    if (email) script.setAttribute("data-prefill.email", email);
    script.async = true;
    formRef.current.appendChild(script);
  }, [email]);

  return (
    <div className="flex justify-center w-full bg-white dark:bg-black rounded-xl p-2 min-h-[48px]">
      <form ref={formRef}></form>
    </div>
  );
}

export default function PricingPage() {
  const { user, isPro } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground">Start for free, upgrade when you need more power.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/10 dark:border-white/10 shadow-lg relative">
          <h2 className="text-2xl font-bold mb-2">Free</h2>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">₹0</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-muted-foreground mb-6">Perfect for occasional edits.</p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <span>2 PDF downloads per day</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <span>Max file size: 5MB</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <span>Standard text replacement</span>
            </li>
          </ul>
          {!user ? (
            <Link href="/signup" className="block w-full py-3 px-4 bg-gray-100 dark:bg-zinc-800 text-center font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
              Get Started Free
            </Link>
          ) : (
            <button disabled className="block w-full py-3 px-4 bg-gray-100 dark:bg-zinc-800 text-center font-bold rounded-xl opacity-50 cursor-not-allowed">
              Current Plan
            </button>
          )}
        </div>

        {/* Pro Tier */}
        <div className="bg-black dark:bg-white text-white dark:text-black rounded-3xl p-8 border border-black/10 dark:border-white/10 shadow-2xl relative transform md:-translate-y-4">
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Pro</h2>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">₹20</span>
            <span className="text-white/70 dark:text-black/70">/month</span>
          </div>
          <p className="text-white/80 dark:text-black/80 mb-6">For professionals who edit regularly.</p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400 dark:text-green-600" size={20} />
              <span>Unlimited PDF downloads</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400 dark:text-green-600" size={20} />
              <span>Max file size: 50MB</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400 dark:text-green-600" size={20} />
              <span>Priority processing</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400 dark:text-green-600" size={20} />
              <span>Priority support</span>
            </li>
          </ul>
          
          {isPro ? (
            <button disabled className="block w-full py-3 px-4 bg-white dark:bg-black text-black dark:text-white text-center font-bold rounded-xl opacity-50 cursor-not-allowed">
              Active Plan
            </button>
          ) : user ? (
            <div className="flex flex-col gap-3">
              <RazorpayButton email={user.email || ""} />
              <button 
                onClick={() => {
                  useAuthStore.getState().setIsPro(true);
                  alert("Pro unlocked! (This is a temporary bypass for testing since Webhooks are not set up yet)");
                }}
                className="text-xs text-white/50 hover:text-white/80 underline text-center"
              >
                Already paid? Sync Purchase (Dev Mode)
              </button>
            </div>
          ) : (
            <Link href="/login?redirect=/pricing" className="block w-full py-3 px-4 bg-white dark:bg-black text-black dark:text-white text-center font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
              Log in to Upgrade
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
