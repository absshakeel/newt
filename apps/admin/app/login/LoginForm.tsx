'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@gtour/ui';
import { Field, Input } from '@gtour/ui';
import { apiClient, getApiErrorMessage } from '@gtour/utils';
import { saveSession } from '@gtour/utils';
import type { LoginResponse } from '@gtour/utils';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!password) nextErrors.password = 'Enter your password.';

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', {
        email: email.trim(),
        password,
        ...(rememberMe ? { rememberMe: true } : {}),
      });

      saveSession(data.data.user, data.data.token);
      router.push('/');
      router.refresh();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#F8F3EA] lg:h-[calc(100dvh-4.5rem)]">
      {/* Left: visual panel (hidden on mobile to prioritize form) */}
      <div className="relative hidden h-full w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_10%_10%,#1f5f73_0%,#0f2f44_38%,#0b1b2c_100%)]" />
        <div className="absolute inset-0 opacity-[0.22]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-sea-400/25 blur-3xl motion-safe:animate-[auth-orb-a_16s_ease-in-out_infinite]" />
          <div className="absolute right-[-6rem] top-[18%] h-80 w-80 rounded-full bg-gold-400/20 blur-3xl motion-safe:animate-[auth-orb-b_18s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-5rem] left-[20%] h-72 w-72 rounded-full bg-sky-300/15 blur-3xl motion-safe:animate-[auth-orb-c_20s_ease-in-out_infinite]" />

          <div className="absolute left-10 top-[34%] w-56 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-md motion-safe:animate-[auth-float_8s_ease-in-out_infinite]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sea-400/25 text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 13.5V6a2 2 0 0 1 2-2h5v16H6a2 2 0 0 1-2-2v-.5M11 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M7 8h1m-1 4h1m7-4h1m-1 4h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </span>
              <div>
                <p className="text-xs font-medium text-sand-200/80">Operations</p>
                <p className="text-sm font-semibold text-white">Unified admin control</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sea-300 to-gold-300 motion-safe:animate-[auth-shimmer_3.2s_ease-in-out_infinite]" />
            </div>
          </div>

          <div className="absolute right-10 top-[18%] w-52 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-md motion-safe:animate-[auth-float_9s_ease-in-out_infinite_reverse]">
            <p className="text-xs font-medium text-sand-200/80">Platform insights</p>
            <p className="mt-1 text-sm font-semibold text-white">Users, listings & bookings</p>
            <div className="mt-3 flex -space-x-2">
              <span className="h-7 w-7 rounded-full border border-white/30 bg-sea-300/50" />
              <span className="h-7 w-7 rounded-full border border-white/30 bg-gold-300/60" />
              <span className="h-7 w-7 rounded-full border border-white/30 bg-sky-200/50" />
            </div>
          </div>

          <div className="absolute bottom-24 right-12 w-56 rounded-2xl border border-white/15 bg-ink-900/25 p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-md motion-safe:animate-[auth-float_10s_ease-in-out_infinite]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-sand-200/80">Secure access</p>
                <p className="mt-1 text-lg font-semibold text-white">Manage with confidence</p>
              </div>
              <span className="rounded-lg bg-gold-400/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-200">Admin</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-sand-100/75">Oversee destinations, users, and content from a professional GTour console.</p>
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sand-100 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-300" /> GTour Admin
          </div>
          <div className="max-w-md motion-safe:animate-[gtour-fade-up_700ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sand-200/90">Administrator access</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] text-white xl:text-5xl">
              Run GTour with clarity and control.
            </h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-sand-100/85">
              Sign in to manage users, destinations, and platform content in one secure workspace.
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes auth-orb-a { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(24px,-18px) scale(1.08);} }
          @keyframes auth-orb-b { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(-28px,20px) scale(1.06);} }
          @keyframes auth-orb-c { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(18px,22px) scale(1.05);} }
          @keyframes auth-float { 0%,100%{ transform: translateY(0px);} 50%{ transform: translateY(-10px);} }
          @keyframes auth-shimmer { 0%,100%{ transform: translateX(-20%); opacity:.7;} 50%{ transform: translateX(25%); opacity:1;} }
        `}</style>
      </div>

      {/* Right: form */}
      <div className="flex h-full w-full items-center justify-center px-5 py-6 sm:px-8 lg:w-1/2 lg:px-10">
        <div className="w-full max-w-[420px] motion-safe:animate-[gtour-scale-in_550ms_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="mb-5 lg:mb-6">
            <p className="inline-flex items-center rounded-full bg-sea-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sea-700 lg:hidden">
              GTour Travel
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-[2rem]">Admin sign in</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">Sign in with your administrator account to manage GTour.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-3xl border border-sand-200/80 bg-white/90 p-5 shadow-[0_20px_50px_-30px_rgba(12,28,44,0.35)] backdrop-blur-sm sm:p-6">
            {formError ? (
              <div role="alert" className="rounded-2xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700 animate-[gtour-fade-up_300ms_ease-out]">
                {formError}
              </div>
            ) : null}

            <Field label="Email address" htmlFor="login-email" error={fieldErrors.email}>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                className="bg-white"
              />
            </Field>

            <Field label="Password" htmlFor="login-password" error={fieldErrors.password}>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                  className="bg-white pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-pill px-2.5 py-1 text-xs font-semibold text-ink-500 transition-all hover:bg-sand-100 hover:text-sea-700"
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between gap-3 pt-0.5">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-sand-300 text-sea-600 focus:ring-sea-500"
                />
                <span>Remember me</span>
              </label>
              <span className="text-sm text-ink-400">Admin console</span>
            </div>

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
              {submitting ? (
                <span className="inline-flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Signing in…</span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-500">
            Administrator access only.
          </p>
        </div>
      </div>
    </div>
  );
}