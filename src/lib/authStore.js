import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMoodleClient } from '../api/moodleClient.js';

const REFRESH_BEFORE_MS = 60 * 1000;
const TICK_INTERVAL_MS = 15 * 1000;

let tickTimer = null;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiresAt: null,
      status: 'unauthenticated',
      error: null,
      isLoggingIn: false,
      isReauthing: false,

      async login({ email, password }) {
        set({ isLoggingIn: true, error: null });
        try {
          const { user, token, expiresAt } = await getMoodleClient().login({ email, password });
          set({
            user,
            token,
            expiresAt,
            status: 'authenticated',
            error: null,
            isLoggingIn: false,
          });
          return true;
        } catch (err) {
          set({ error: err.message, isLoggingIn: false });
          return false;
        }
      },

      async reauth({ password }) {
        const { user } = get();
        if (!user) return false;
        set({ isReauthing: true, error: null });
        try {
          const { token, expiresAt } = await getMoodleClient().login({
            email: user.email,
            password,
          });
          set({
            token: token.token ?? token,
            expiresAt: expiresAt ?? token.expiresAt,
            status: 'authenticated',
            isReauthing: false,
            error: null,
          });
          return true;
        } catch (err) {
          set({ error: err.message, isReauthing: false });
          return false;
        }
      },

      logout() {
        set({
          user: null,
          token: null,
          expiresAt: null,
          status: 'unauthenticated',
          error: null,
        });
      },

      simulateExpiry() {
        set({ expiresAt: Date.now() - 1, status: 'reauth-required' });
      },

      async _tick() {
        const { token, expiresAt, status } = get();
        if (!token || !expiresAt) return;
        if (status === 'reauth-required') return;
        const msLeft = expiresAt - Date.now();
        if (msLeft <= 0) {
          set({ status: 'reauth-required' });
          return;
        }
        if (msLeft <= REFRESH_BEFORE_MS) {
          try {
            const fresh = await getMoodleClient().refreshToken(token);
            set({ token: fresh.token, expiresAt: fresh.expiresAt });
          } catch {
            set({ status: 'reauth-required' });
          }
        }
      },

      startRefreshLoop() {
        if (tickTimer) return;
        tickTimer = setInterval(() => get()._tick(), TICK_INTERVAL_MS);
        get()._tick();
      },

      stopRefreshLoop() {
        if (tickTimer) {
          clearInterval(tickTimer);
          tickTimer = null;
        }
      },
    }),
    {
      name: 'flexi-auth',
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        expiresAt: s.expiresAt,
        status: s.status === 'authenticated' ? 'authenticated' : 'unauthenticated',
      }),
    }
  )
);
