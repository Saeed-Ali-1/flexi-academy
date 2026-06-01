import { create } from 'zustand';

let toastSeq = 0;

export const useUIStore = create((set, get) => ({
  focusMode: false,
  notificationsOpen: false,
  lessonDrawerOpen: true,
  toasts: [],

  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
  setFocusMode: (v) => set({ focusMode: !!v }),

  openNotifications: () => set({ notificationsOpen: true }),
  closeNotifications: () => set({ notificationsOpen: false }),
  toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen })),

  openLessonDrawer: () => set({ lessonDrawerOpen: true }),
  closeLessonDrawer: () => set({ lessonDrawerOpen: false }),
  toggleLessonDrawer: () => set((s) => ({ lessonDrawerOpen: !s.lessonDrawerOpen })),

  pushToast: ({ title, body, tone = 'info', durationMs = 3000 }) => {
    const id = ++toastSeq;
    set((s) => ({ toasts: [...s.toasts, { id, title, body, tone }] }));
    setTimeout(() => get().dismissToast(id), durationMs);
    return id;
  },
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
