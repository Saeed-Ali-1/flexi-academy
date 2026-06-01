import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useUIStore } from '../../lib/uiStore.js';
import TopBar from './TopBar.jsx';
import SideRail from './SideRail.jsx';
import NotificationsDrawer from '../dashboard/NotificationsDrawer.jsx';

export default function AppShell() {
  const focusMode = useUIStore((s) => s.focusMode);
  const toggleFocusMode = useUIStore((s) => s.toggleFocusMode);
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col">
      <AnimatePresence initial={false}>
        {!focusMode && (
          <motion.div
            key="topbar"
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <TopBar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1">
        <AnimatePresence initial={false}>
          {!focusMode && (
            <motion.div
              key="siderail"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <SideRail />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="relative flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {focusMode && (
          <motion.button
            key="focus-fab"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            onClick={toggleFocusMode}
            className="btn-icon fixed right-5 top-5 z-30 h-11 w-11 border-iris/40 bg-iris/15 text-alabaster shadow-glow"
            aria-label="Exit focus mode"
            title="Exit focus mode"
          >
            <Minimize2 size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <NotificationsDrawer />
    </div>
  );
}
