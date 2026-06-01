import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import { useAuthStore } from '../../lib/authStore.js';
import FieldWithValidation from './FieldWithValidation.jsx';

export default function ReAuthModal() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const reauth = useAuthStore((s) => s.reauth);
  const isReauthing = useAuthStore((s) => s.isReauthing);
  const error = useAuthStore((s) => s.error);
  const [password, setPassword] = useState('');

  const open = status === 'reauth-required';

  useEffect(() => {
    if (!open) setPassword('');
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) return;
    await reauth({ password });
  };

  return (
    <Modal open={open} showClose={false} maxWidth="max-w-sm">
      <div className="flex flex-col items-start">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-iris/15 text-iris-soft"
        >
          <ShieldCheck size={22} />
        </motion.span>
        <h2 className="font-display text-2xl leading-tight">Welcome back, {user?.firstName}.</h2>
        <p className="mt-2 text-sm text-muted-soft">
          For your security, we'd like to confirm it's you. Your work on this page is preserved —
          just enter your password to continue.
        </p>
        <form onSubmit={submit} className="mt-5 flex w-full flex-col gap-3">
          <FieldWithValidation
            name="reauth-password"
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Your password"
            autoComplete="current-password"
            validator={(v) => (v.length === 0 ? 'Required' : v.length < 4 ? 'Too short' : null)}
          />
          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </div>
          )}
          <button type="submit" disabled={isReauthing || !password} className="btn-primary mt-1 w-full">
            {isReauthing ? 'Verifying…' : 'Continue'}
          </button>
        </form>
      </div>
    </Modal>
  );
}
