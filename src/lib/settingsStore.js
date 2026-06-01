import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_SETTINGS = {
  // Profile (cosmetic — name/email come from authStore.user)
  avatarColor: '#7c5cff',
  displayName: '',

  // Notifications
  notifyLiveClass: true,
  notifyAssignmentDue: true,
  notifyGradePosted: true,
  notifyAnnouncements: true,
  notifyDailyDigest: false,
  notifySound: true,

  // Focus mode
  focusDefaultMinutes: 25,
  focusHideNotifications: true,
  focusAutoResume: false,
  focusAmbientSound: 'off',

  // Appearance
  accent: 'iris',
  density: 'cozy',
  showCoverGlyphs: true,

  // Accessibility
  reducedMotion: 'system',
  fontSize: 'standard',
  highContrast: false,

  // Data
  cacheCourses: true,
};

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      set: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      reset: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    { name: 'flexi-settings' }
  )
);
