import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCoursesStore = create(
  persist(
    (set) => ({
      detailCache: {},
      lessonCache: {},

      putCourseDetail: (id, detail) =>
        set((s) => ({ detailCache: { ...s.detailCache, [id]: { detail, at: Date.now() } } })),
      putLesson: (id, lesson) =>
        set((s) => ({ lessonCache: { ...s.lessonCache, [id]: { lesson, at: Date.now() } } })),

      clear: () => set({ detailCache: {}, lessonCache: {} }),
    }),
    { name: 'flexi-courses-cache' }
  )
);
