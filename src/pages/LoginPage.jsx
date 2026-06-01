import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { useAuthStore } from '../lib/authStore.js';
import AnimatedBackdrop from '../components/auth/AnimatedBackdrop.jsx';
import FieldWithValidation from '../components/auth/FieldWithValidation.jsx';

const validateEmail = (v) => {
  if (!v) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
  return null;
};
const validatePassword = (v) => {
  if (!v) return 'Password is required.';
  if (v.length < 4) return 'Must be at least 4 characters.';
  return null;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const status = useAuthStore((s) => s.status);
  const isLoggingIn = useAuthStore((s) => s.isLoggingIn);
  const error = useAuthStore((s) => s.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (status === 'authenticated') navigate('/dashboard', { replace: true });
  }, [status, navigate]);

  const formInvalid = validateEmail(email) || validatePassword(password);

  const submit = async (e) => {
    e.preventDefault();
    if (formInvalid) return;
    const ok = await login({ email, password });
    if (ok) navigate('/dashboard', { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackdrop />
      <div className="relative grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        <aside className="hidden flex-col justify-between p-12 lg:flex">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-iris-gradient text-white shadow-glow">
              <GraduationCap size={22} />
            </span>
            <div>
              <div className="font-display text-2xl font-semibold">Flexi Academy</div>
              <div className="text-xs uppercase tracking-[0.22em] text-muted">
                Learning, designed for focus.
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            className="max-w-md"
          >
            <p className="eyebrow mb-4">The next-generation learning experience</p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-balance">
              A quieter way to <span className="bg-gradient-to-r from-iris-soft to-aurora bg-clip-text text-transparent">study deeply</span>.
            </h1>
            <p className="mt-5 text-muted-soft">
              Built on your Moodle backbone. Reimagined for the way students actually learn — with
              live class utilities, focus-mode lessons, and progress that feels like progress.
            </p>
          </motion.div>

          <div className="flex items-center gap-6 text-xs text-muted">
            <span>© 2026 Flexi Academy</span>
            <span>·</span>
            <span>Privacy</span>
            <span>·</span>
            <span>Support</span>
          </div>
        </aside>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="glass-card grain w-full max-w-md p-8 sm:p-10"
          >
            <div className="mb-7">
              <div className="eyebrow mb-2">Sign in</div>
              <h2 className="font-display text-3xl leading-tight">Welcome back.</h2>
              <p className="mt-1.5 text-sm text-muted-soft">
                Use any email & password (4+ chars) — this is a prototype.
              </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">
              <FieldWithValidation
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="layla.hassan@flexi.academy"
                autoComplete="email"
                validator={validateEmail}
                required
              />
              <FieldWithValidation
                name="password"
                type="password"
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
                validator={validatePassword}
                required
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn-primary mt-2 h-12 text-base"
              >
                {isLoggingIn ? 'Signing in…' : (
                  <>
                    Continue <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-1 flex items-center justify-between text-xs text-muted">
                <button type="button" className="hover:text-alabaster">Forgot password?</button>
                <button type="button" className="hover:text-alabaster">Need help signing in?</button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
