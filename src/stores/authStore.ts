import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types/auth';

export const TOKEN_KEYS = {
  ACCESS: 'fincompass:access_token',
  REFRESH: 'fincompass:refresh_token',
} as const;

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;

  setAuth: (user: User, tokens: AuthTokens) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.accessToken);
        localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refreshToken);
        set({ user, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem(TOKEN_KEYS.ACCESS);
        localStorage.removeItem(TOKEN_KEYS.REFRESH);
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (partial) => {
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, ...partial } };
        });
      },
    }),
    {
      name: 'fincompass:auth',
    },
  ),
);
