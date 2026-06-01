import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/authStore.js';
import AppShell from './components/layout/AppShell.jsx';
import ReAuthModal from './components/auth/ReAuthModal.jsx';
import ToastHost from './components/ui/ToastHost.jsx';

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const LibraryPage = lazy(() => import('./pages/LibraryPage.jsx'));
const CoursePage = lazy(() => import('./pages/CoursePage.jsx'));
const LessonPage = lazy(() => import('./pages/LessonPage.jsx'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage.jsx'));
const InsightsPage = lazy(() => import('./pages/InsightsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));

function RouteFallback() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-iris/30 border-t-iris" />
    </div>
  );
}

function RequireAuth({ children }) {
  const status = useAuthStore((s) => s.status);
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const startRefreshLoop = useAuthStore((s) => s.startRefreshLoop);
  const stopRefreshLoop = useAuthStore((s) => s.stopRefreshLoop);

  useEffect(() => {
    startRefreshLoop();
    return () => stopRefreshLoop();
  }, [startRefreshLoop, stopRefreshLoop]);

  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="courses/:courseId" element={<CoursePage />} />
            <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <ReAuthModal />
      <ToastHost />
    </>
  );
}
