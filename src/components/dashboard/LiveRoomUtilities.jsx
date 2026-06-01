import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, ChevronDown, KeyRound, Video, ExternalLink, Clock4 } from 'lucide-react';
import { useMoodleQuery } from '../../hooks/useMoodleQuery.js';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard.js';
import { getMoodleClient } from '../../api/moodleClient.js';
import Skeleton from '../ui/Skeleton.jsx';
import Badge from '../ui/Badge.jsx';

function CopyChip({ icon: Icon, label, value, monospace }) {
  const copy = useCopyToClipboard();
  return (
    <button
      onClick={() => copy(value, { label: `${label} copied` })}
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-left transition hover:bg-white/[0.07]"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] text-iris-soft">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
        <div className={`truncate text-sm font-semibold text-alabaster ${monospace ? 'font-mono tracking-wider' : ''}`}>
          {value}
        </div>
      </div>
      <Copy size={15} className="text-muted opacity-60 transition group-hover:text-alabaster group-hover:opacity-100" />
    </button>
  );
}

function OtpChip({ value, refreshSeconds }) {
  const copy = useCopyToClipboard();
  const [seconds, setSeconds] = useState(refreshSeconds);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s <= 1 ? refreshSeconds : s - 1)), 1000);
    return () => clearInterval(id);
  }, [refreshSeconds]);
  const pct = (seconds / refreshSeconds) * 100;
  return (
    <button
      onClick={() => copy(value, { label: 'OTP copied' })}
      className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-amber-warm/30 bg-amber-warm/[0.06] px-3.5 py-2.5 text-left transition hover:bg-amber-warm/[0.10]"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-warm/15 text-amber-warm">
        <KeyRound size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted">
          OTP <span className="text-amber-warm">refreshes in {seconds}s</span>
        </div>
        <div className="font-mono text-lg font-bold tracking-[0.3em] text-amber-warm">{value}</div>
      </div>
      <Copy size={15} className="text-muted opacity-60 transition group-hover:text-amber-warm group-hover:opacity-100" />
      <span
        className="absolute bottom-0 left-0 h-0.5 bg-amber-warm/60 transition-[width] duration-1000 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </button>
  );
}

export default function LiveRoomUtilities() {
  const { data, isLoading } = useMoodleQuery(() => getMoodleClient().getActiveSession(), []);
  const [open, setOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="glass-panel p-5">
        <Skeleton className="mb-3 h-5 w-44" />
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      </div>
    );
  }
  if (!data?.active) return null;

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-aurora/70" />
            <span className="relative rounded-full bg-aurora h-2.5 w-2.5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-alabaster">Live Room Utilities</span>
              <Badge tone="aurora">Live now</Badge>
            </div>
            <div className="mt-0.5 text-xs text-muted">
              {data.className} · {data.teacher}
              <span className="mx-2 text-white/20">·</span>
              <span className="inline-flex items-center gap-1 text-aurora-soft">
                <Clock4 size={11} /> starts in {data.startsInMinutes}m
              </span>
            </div>
          </div>
        </div>
        <ChevronDown size={18} className={`text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="grid gap-3 px-5 pb-5 md:grid-cols-[1fr_1fr_auto]">
              <div className="grid gap-2.5 md:grid-cols-2 md:col-span-2">
                <CopyChip icon={Video} label="Zoom meeting ID" value={data.zoomMeetingId} monospace />
                <CopyChip icon={KeyRound} label="Zoom password" value={data.zoomPassword} monospace />
                <div className="md:col-span-2">
                  <OtpChip value={data.otpCode} refreshSeconds={data.otpRefreshSeconds} />
                </div>
              </div>
              <a
                href={data.zoomLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary md:self-start"
              >
                Join live room <ExternalLink size={15} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
