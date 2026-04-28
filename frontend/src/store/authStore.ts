import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isPro: boolean;
  downloadsCount: number;
  
  setUser: (user: User | null) => void;
  setIsPro: (status: boolean) => void;
  incrementDownloads: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isPro: false,
      downloadsCount: 0,
      
      setUser: (user) => set({ user }),
      setIsPro: (status) => set({ isPro: status }),
      incrementDownloads: () => set((state) => ({ downloadsCount: state.downloadsCount + 1 })),
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, isPro: false });
      }
    }),
    {
      name: 'pdf-auth-storage',
      // We only persist the downloads count and isPro mock for the MVP.
      // User session is handled natively by Supabase.
      partialize: (state) => ({ downloadsCount: state.downloadsCount, isPro: state.isPro }),
    }
  )
);
