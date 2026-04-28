"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsPro } = useAuthStore();

  useEffect(() => {
    const syncSubscription = async (userId: string | undefined) => {
      if (!userId) {
        setIsPro(false);
        return;
      }
      
      const { data } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .single();
        
      setIsPro(data?.plan === "pro");
    };

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      syncSubscription(session?.user?.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      syncSubscription(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
