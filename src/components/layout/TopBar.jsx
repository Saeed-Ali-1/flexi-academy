import { Bell, Maximize2, Minimize2, LogOut, User2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../lib/authStore.js';
import { useUIStore } from '../../lib/uiStore.js';
import IconButton from '../ui/IconButton.jsx';
import Avatar from '../ui/Avatar.jsx';

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-iris-gradient text-white shadow-glow">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h14M9 12h10M5 18h14" />
        </svg>
      </span>
      <div className="leading-tight">
        <div className="font-display text-lg font-semibold tracking-tight">Flexi</div>
        <div className="-mt-0.5 text-[10px] uppercase tracking-[0.22em] text-muted">Academy</div>
      </div>
    </div>
  );
}

export default function TopBar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const simulateExpiry = useAuthStore((s) => s.simulateExpiry);
  const focusMode = useUIStore((s) => s.focusMode);
  const toggleFocusMode = useUIStore((s) => s.toggleFocusMode);
  const toggleNotifications = useUIStore((s) => s.toggleNotifications);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-midnight/70 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <BrandMark />

        <div className="hidden flex-1 md:block">
          <div className="mx-auto max-w-md">
            <div className="relative">
              <input
                className="input-base h-10 pl-10"
                placeholder="Search courses, lessons, teachers…"
                aria-label="Global search"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            label={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
            onClick={toggleFocusMode}
            active={focusMode}
          >
            {focusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </IconButton>
          <IconButton label="Notifications" onClick={toggleNotifications}>
            <div className="relative">
              <Bell size={18} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-aurora shadow-glow-aurora" />
            </div>
          </IconButton>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 transition hover:bg-white/[0.07]"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Avatar
                size="sm"
                initials={user?.avatarInitials ?? 'FA'}
                color={user?.avatarColor ?? '#7c5cff'}
              />
              <span className="hidden text-sm font-medium text-alabaster sm:block">
                {user?.firstName ?? 'Student'}
              </span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/[0.07] bg-slate-deep/95 p-2 shadow-lift backdrop-blur-xl"
                  role="menu"
                >
                  <div className="px-3 py-2.5">
                    <div className="text-sm font-semibold text-alabaster">{user?.name}</div>
                    <div className="text-xs text-muted">{user?.email}</div>
                  </div>
                  <div className="my-1 h-px bg-white/[0.06]" />
                  <button
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-alabaster hover:bg-white/[0.06]"
                    onClick={() => {
                      setMenuOpen(false);
                      simulateExpiry();
                    }}
                  >
                    <User2 size={15} className="text-muted-soft" />
                    Simulate session timeout
                  </button>
                  <button
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      navigate('/login', { replace: true });
                    }}
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
