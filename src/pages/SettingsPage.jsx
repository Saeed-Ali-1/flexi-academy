import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User2,
  Bell,
  Focus,
  Palette,
  Accessibility,
  Database,
  CheckCircle2,
  LogOut,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../lib/authStore.js';
import { useSettingsStore, DEFAULT_SETTINGS } from '../lib/settingsStore.js';
import { useCoursesStore } from '../lib/coursesStore.js';
import { useUIStore } from '../lib/uiStore.js';
import SettingsSection from '../components/settings/SettingsSection.jsx';
import SettingsNav from '../components/settings/SettingsNav.jsx';
import Switch from '../components/ui/Switch.jsx';
import SegmentedControl from '../components/ui/SegmentedControl.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import { cn } from '../lib/classNames.js';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'focus', label: 'Focus mode', icon: Focus },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'data', label: 'Data & account', icon: Database },
];

const ACCENT_OPTIONS = [
  { value: 'iris', label: 'Iris', color: '#7c5cff' },
  { value: 'aurora', label: 'Aurora', color: '#3ddcb2' },
  { value: 'amber', label: 'Amber', color: '#f5b86a' },
];

const AVATAR_OPTIONS = ['#7c5cff', '#3ddcb2', '#f5b86a', '#ff6b8a', '#5a90ff', '#c266ff'];

function SavedFlash({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.95 }}
          className="inline-flex items-center gap-1 rounded-full border border-aurora/40 bg-aurora/15 px-2.5 py-0.5 text-[11px] font-semibold text-aurora-soft"
        >
          <CheckCircle2 size={11} /> Saved
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function useSettingsField() {
  const settings = useSettingsStore((s) => s.settings);
  const setMany = useSettingsStore((s) => s.set);
  const pushToast = useUIStore((s) => s.pushToast);
  const [flashKey, setFlashKey] = useState(null);
  const update = (key, value, opts = {}) => {
    setMany({ [key]: value });
    setFlashKey(key);
    setTimeout(() => setFlashKey((k) => (k === key ? null : k)), 1400);
    if (opts.toast) {
      pushToast({ title: opts.toast, tone: 'success' });
    }
  };
  return { settings, update, flashKey };
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const clearCache = useCoursesStore((s) => s.clear);
  const reset = useSettingsStore((s) => s.reset);
  const pushToast = useUIStore((s) => s.pushToast);
  const { settings, update, flashKey } = useSettingsField();

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <header className="mb-7">
        <div className="eyebrow">Settings</div>
        <h1 className="heading-display mt-1">Make it yours.</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-soft">
          Everything here saves to your device the moment you change it.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <SettingsNav items={SECTIONS} />
        </aside>

        <div className="flex flex-col gap-8">
          {/* PROFILE */}
          <SettingsSection
            id="profile"
            title="Profile"
            description="What other students and teachers see when you show up."
            icon={User2}
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Avatar size="lg" initials={user?.avatarInitials ?? 'FA'} color={settings.avatarColor} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-alabaster">{user?.name}</div>
                  <div className="text-xs text-muted">{user?.email}</div>
                  <div className="mt-1 text-xs text-muted-soft">
                    {user?.programme} · {user?.cohort}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-xs font-semibold text-muted-soft">Avatar accent</label>
                  <SavedFlash visible={flashKey === 'avatarColor'} />
                </div>
                <div className="flex gap-2">
                  {AVATAR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => update('avatarColor', color)}
                      aria-label={`Avatar color ${color}`}
                      className={cn(
                        'h-9 w-9 rounded-full border-2 transition',
                        settings.avatarColor === color
                          ? 'border-white shadow-glow scale-105'
                          : 'border-transparent hover:scale-105'
                      )}
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label htmlFor="displayName" className="text-xs font-semibold text-muted-soft">
                    Preferred display name
                  </label>
                  <SavedFlash visible={flashKey === 'displayName'} />
                </div>
                <input
                  id="displayName"
                  className="input-base"
                  placeholder={user?.firstName ?? 'Your name'}
                  value={settings.displayName}
                  onChange={(e) => update('displayName', e.target.value)}
                />
              </div>
            </div>
          </SettingsSection>

          {/* NOTIFICATIONS */}
          <SettingsSection
            id="notifications"
            title="Notifications"
            description="What's worth interrupting you for."
            icon={Bell}
          >
            <div className="flex flex-col gap-2.5">
              <Switch
                id="notifyLiveClass"
                checked={settings.notifyLiveClass}
                onChange={(v) => update('notifyLiveClass', v)}
                label="Live class is about to start"
                description="A nudge 10 minutes before class with a one-tap join link."
              />
              <Switch
                id="notifyAssignmentDue"
                checked={settings.notifyAssignmentDue}
                onChange={(v) => update('notifyAssignmentDue', v)}
                label="Assignment due soon"
                description="24 hours before, plus a final 1-hour reminder."
              />
              <Switch
                id="notifyGradePosted"
                checked={settings.notifyGradePosted}
                onChange={(v) => update('notifyGradePosted', v)}
                label="Grade posted"
                description="Whenever a teacher returns feedback or a score."
              />
              <Switch
                id="notifyAnnouncements"
                checked={settings.notifyAnnouncements}
                onChange={(v) => update('notifyAnnouncements', v)}
                label="School announcements"
                description="Admin messages from the school office."
              />
              <Switch
                id="notifyDailyDigest"
                checked={settings.notifyDailyDigest}
                onChange={(v) => update('notifyDailyDigest', v)}
                label="Morning digest"
                description="One 7am summary of the day instead of in-the-moment pings."
              />
              <Switch
                id="notifySound"
                checked={settings.notifySound}
                onChange={(v) => update('notifySound', v)}
                label="Play sound"
                description="A soft chime for important notifications."
              />
            </div>
          </SettingsSection>

          {/* FOCUS MODE */}
          <SettingsSection
            id="focus"
            title="Focus mode"
            description="Defaults for your deep-work sessions inside lessons."
            icon={Focus}
          >
            <div className="flex flex-col gap-5">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-xs font-semibold text-muted-soft">Default session length</label>
                  <SavedFlash visible={flashKey === 'focusDefaultMinutes'} />
                </div>
                <SegmentedControl
                  ariaLabel="focus-duration"
                  value={settings.focusDefaultMinutes}
                  onChange={(v) => update('focusDefaultMinutes', v)}
                  options={[
                    { value: 15, label: '15 min' },
                    { value: 25, label: '25 min' },
                    { value: 45, label: '45 min' },
                    { value: 60, label: '60 min' },
                  ]}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-xs font-semibold text-muted-soft">Ambient sound</label>
                  <SavedFlash visible={flashKey === 'focusAmbientSound'} />
                </div>
                <SegmentedControl
                  ariaLabel="focus-ambient"
                  value={settings.focusAmbientSound}
                  onChange={(v) => update('focusAmbientSound', v)}
                  options={[
                    { value: 'off', label: 'Off' },
                    { value: 'rain', label: 'Rain' },
                    { value: 'cafe', label: 'Café' },
                    { value: 'forest', label: 'Forest' },
                  ]}
                />
              </div>

              <Switch
                id="focusHideNotifications"
                checked={settings.focusHideNotifications}
                onChange={(v) => update('focusHideNotifications', v)}
                label="Silence notifications during focus"
                description="They'll queue up — you'll see them when you exit."
              />
              <Switch
                id="focusAutoResume"
                checked={settings.focusAutoResume}
                onChange={(v) => update('focusAutoResume', v)}
                label="Auto-resume focus on next lesson"
                description="When you finish one lesson in focus mode, the next starts in focus too."
              />
            </div>
          </SettingsSection>

          {/* APPEARANCE */}
          <SettingsSection
            id="appearance"
            title="Appearance"
            description="Visual feel of the app."
            icon={Palette}
          >
            <div className="flex flex-col gap-5">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-xs font-semibold text-muted-soft">Brand accent</label>
                  <SavedFlash visible={flashKey === 'accent'} />
                </div>
                <div className="flex gap-2">
                  {ACCENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => update('accent', opt.value)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition',
                        settings.accent === opt.value
                          ? 'border-iris/40 bg-iris/15 text-alabaster shadow-glow'
                          : 'border-white/10 bg-white/[0.03] text-muted-soft hover:bg-white/[0.07]'
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${opt.color}, ${opt.color}aa)` }}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-xs font-semibold text-muted-soft">Layout density</label>
                  <SavedFlash visible={flashKey === 'density'} />
                </div>
                <SegmentedControl
                  ariaLabel="density"
                  value={settings.density}
                  onChange={(v) => update('density', v)}
                  options={[
                    { value: 'cozy', label: 'Cozy' },
                    { value: 'compact', label: 'Compact' },
                  ]}
                />
              </div>

              <Switch
                id="showCoverGlyphs"
                checked={settings.showCoverGlyphs}
                onChange={(v) => update('showCoverGlyphs', v)}
                label="Show subject glyphs on course cards"
                description="The big watermark character on each card. Turn off for a quieter library."
              />
            </div>
          </SettingsSection>

          {/* ACCESSIBILITY */}
          <SettingsSection
            id="accessibility"
            title="Accessibility"
            description="So the app meets you where you are."
            icon={Accessibility}
          >
            <div className="flex flex-col gap-5">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-xs font-semibold text-muted-soft">Reduced motion</label>
                  <SavedFlash visible={flashKey === 'reducedMotion'} />
                </div>
                <SegmentedControl
                  ariaLabel="reduced-motion"
                  value={settings.reducedMotion}
                  onChange={(v) => update('reducedMotion', v)}
                  options={[
                    { value: 'system', label: 'Match system' },
                    { value: 'always', label: 'Always on' },
                    { value: 'never', label: 'Never' },
                  ]}
                />
                <p className="mt-2 text-xs text-muted">
                  Default follows your OS setting. Animations stay subtle in any case.
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-xs font-semibold text-muted-soft">Text size</label>
                  <SavedFlash visible={flashKey === 'fontSize'} />
                </div>
                <SegmentedControl
                  ariaLabel="font-size"
                  value={settings.fontSize}
                  onChange={(v) => update('fontSize', v)}
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'large', label: 'Large' },
                    { value: 'x-large', label: 'X-Large' },
                  ]}
                />
              </div>

              <Switch
                id="highContrast"
                checked={settings.highContrast}
                onChange={(v) => update('highContrast', v)}
                label="High-contrast mode"
                description="Boost contrast on text, borders, and focus rings."
              />
            </div>
          </SettingsSection>

          {/* DATA & ACCOUNT */}
          <SettingsSection
            id="data"
            title="Data & account"
            description="Cache, sessions, sign out."
            icon={Database}
          >
            <div className="flex flex-col gap-5">
              <Switch
                id="cacheCourses"
                checked={settings.cacheCourses}
                onChange={(v) => update('cacheCourses', v)}
                label="Cache courses for fast navigation"
                description="Stores course schemas locally so back/forward is instant. Doesn't include grades."
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="btn-ghost"
                  onClick={() => {
                    clearCache();
                    pushToast({ title: 'Local cache cleared', tone: 'success' });
                  }}
                >
                  <Trash2 size={15} /> Clear local cache
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    reset();
                    pushToast({ title: 'Settings reset to defaults', tone: 'info' });
                  }}
                >
                  <ShieldCheck size={15} /> Reset to defaults
                </button>
              </div>

              <div className="h-px w-full bg-white/[0.06]" />

              <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
                <div className="text-sm font-semibold text-alabaster">Sign out</div>
                <p className="mt-1 text-xs text-muted-soft">
                  You'll need to log in again next time. Your saved settings stay on this device.
                </p>
                <button onClick={handleSignOut} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/15">
                  <LogOut size={15} /> Sign out of Flexi Academy
                </button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
