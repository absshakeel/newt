'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';
import { Button } from '@gtour/ui';
import { Field, Input } from '@gtour/ui';
import { apiClient, getApiErrorMessage } from '@gtour/utils';
import { saveSession } from '@gtour/utils';
import { cn } from '@gtour/utils';
import type { LoginResponse } from '@gtour/utils';

/**
 * Roles a visitor can self-select. `admin` is deliberately excluded — it must
 * never be grantable from a public form, and the API ignores client-supplied
 * roles for privileged accounts.
 */
const ROLE_OPTIONS = [
  { value: 'tourist', label: 'Tourist', desc: 'Book trips & explore', icon: 'compass' },
  { value: 'hotel_owner', label: 'Hotel Owner', desc: 'List your stays', icon: 'hotel' },
  { value: 'photographer', label: 'Photographer', desc: 'Offer photo shoots', icon: 'camera' },
  { value: 'vehicle_provider', label: 'Vehicle Provider', desc: 'Rent vehicles', icon: 'car' },
] as const;

type Step = 1 | 2;
type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirmPassword' | 'terms', string>>;

function RoleIcon({ type, active }: { type: string; active: boolean }) {
  const cls = cn('h-5 w-5', active ? 'text-sea-700' : 'text-ink-500');
  if (type === 'hotel')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
      </svg>
    );
  if (type === 'camera')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h3l2-2h6l2 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
        <circle cx="12" cy="14" r="3.5" />
      </svg>
    );
  if (type === 'car')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M5 13h14M5 13a2 2 0 0 0-2 2v2h2m14-4a2 2 0 0 1 2 2v2h-2M7 17a1.5 1.5 0 1 0 0 .01M17 17a1.5 1.5 0 1 0 0 .01" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  );
}

export default function RegisterForm({ initialRole }: { initialRole?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(
    ROLE_OPTIONS.some((option) => option.value === initialRole) ? (initialRole as string) : 'tourist'
  );
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isProvider = role !== 'tourist';
  const passwordHint = useMemo(
    () => (password.length > 0 && password.length < 8 ? 'Use at least 8 characters.' : undefined),
    [password]
  );

  function validateStep1() {
    const nextErrors: FieldErrors = {};
    if (name.trim().length < 2) nextErrors.name = 'Enter your full name.';
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    setFieldErrors((prev) => ({ ...prev, name: nextErrors.name, email: nextErrors.email }));
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }

    const nextErrors: FieldErrors = {};
    if (name.trim().length < 2) nextErrors.name = 'Enter your full name.';
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!terms) nextErrors.terms = 'You must agree to the terms to continue.';

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name || nextErrors.email) setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await apiClient.post<LoginResponse>('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      // Registration already returns a token, so the visitor stays signed in.
      saveSession(data.data.user, data.data.token);
      setSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push('/destinations');
      router.refresh();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-[100dvh] w-full overflow-hidden bg-[#F8F3EA] lg:h-[calc(100dvh-4.5rem)] lg:min-h-0">
      {/* Left: visual panel (hidden on mobile to prioritize form) */}
      <div className="relative hidden h-full w-[46%] overflow-hidden lg:block xl:w-1/2">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_10%_10%,#1f5f73_0%,#0f2f44_38%,#0b1b2c_100%)]" />
        <div className="absolute inset-0 opacity-[0.22]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-sea-400/25 blur-3xl motion-safe:animate-[auth-orb-a_16s_ease-in-out_infinite]" />
          <div className="absolute right-[-6rem] top-[18%] h-80 w-80 rounded-full bg-gold-400/20 blur-3xl motion-safe:animate-[auth-orb-b_18s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-5rem] left-[20%] h-72 w-72 rounded-full bg-sky-300/15 blur-3xl motion-safe:animate-[auth-orb-c_20s_ease-in-out_infinite]" />

          <div className="absolute left-10 top-[34%] w-52 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-md motion-safe:animate-[auth-float_8s_ease-in-out_infinite]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sea-400/25 text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>
              </span>
              <div>
                <p className="text-xs font-medium text-sand-200/80">{isProvider ? 'Grow' : 'Discover'}</p>
                <p className="text-sm font-semibold text-white">{isProvider ? 'Reach new travellers' : 'Curated destinations'}</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sea-300 to-gold-300 motion-safe:animate-[auth-shimmer_3.2s_ease-in-out_infinite]" />
            </div>
          </div>

          <div className="absolute right-10 top-[18%] w-48 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-md motion-safe:animate-[auth-float_9s_ease-in-out_infinite_reverse]">
            <p className="text-xs font-medium text-sand-200/80">{isProvider ? 'Provider tools' : 'Seamless planning'}</p>
            <p className="mt-1 text-sm font-semibold text-white">{isProvider ? 'Showcase your services' : 'Hotels, transport & experiences'}</p>
            <div className="mt-3 flex -space-x-2">
              <span className="h-7 w-7 rounded-full border border-white/30 bg-sea-300/50" />
              <span className="h-7 w-7 rounded-full border border-white/30 bg-gold-300/60" />
              <span className="h-7 w-7 rounded-full border border-white/30 bg-sky-200/50" />
            </div>
          </div>

          <div className="absolute bottom-24 right-12 w-56 rounded-2xl border border-white/15 bg-ink-900/25 p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] backdrop-blur-md motion-safe:animate-[auth-float_10s_ease-in-out_infinite]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-sand-200/80">GTour platform</p>
                <p className="mt-1 text-lg font-semibold text-white">{isProvider ? 'Built for partners' : 'Plan with confidence'}</p>
              </div>
              <span className="rounded-lg bg-gold-400/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-200">GTour</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-sand-100/75">
              {isProvider
                ? 'Connect with travellers and manage your offerings through a modern, trusted platform.'
                : 'Personalized journeys, verified stays, and memorable experiences in one place.'}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sand-100 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-300" /> GTour
          </div>
          <div className="max-w-md motion-safe:animate-[gtour-fade-up_700ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-sand-200/90">
              {isProvider ? 'For providers' : 'Begin here'}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] text-white xl:text-5xl">
              {isProvider ? 'Share your services with the world.' : 'Start your journey with GTour.'}
            </h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-sand-100/85">
              {isProvider
                ? 'Join as a provider and reach travellers searching for stays, photography, and transport.'
                : 'Create your account to discover destinations, book stays, and plan unforgettable trips.'}
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
      <div className="flex h-full w-full items-start justify-center overflow-y-auto px-4 py-4 sm:px-6 lg:w-[54%] lg:items-center lg:px-8 lg:py-3 xl:w-1/2">
        <div className="my-auto w-full max-w-[460px] py-2 motion-safe:animate-[gtour-scale-in_550ms_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="mb-2.5 flex items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center rounded-full bg-sea-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sea-700 lg:hidden">
                GTour Travel
              </p>
              <h2 className="mt-1 font-display text-[1.6rem] font-semibold leading-tight text-ink-900 sm:text-[1.75rem]">Create account</h2>
              <p className="mt-0.5 text-sm leading-snug text-ink-500">Begin your next journey in a few steps.</p>
            </div>
            <div className="flex items-center gap-1.5 pb-1">
              <span className={cn('h-1.5 w-8 rounded-full transition-colors', step >= 1 ? 'bg-sea-500' : 'bg-sand-300')} />
              <span className={cn('h-1.5 w-8 rounded-full transition-colors', step >= 2 ? 'bg-sea-500' : 'bg-sand-300')} />
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3 rounded-3xl border border-sand-200/80 bg-white/95 p-4 shadow-[0_24px_60px_-32px_rgba(12,28,44,0.4)] backdrop-blur-sm sm:p-4">
            {success ? (
              <div role="status" className="rounded-2xl border border-sea-200 bg-sea-50 px-3.5 py-2.5 text-sm font-medium text-sea-700 animate-[gtour-fade-up_300ms_ease-out]">
                Account created successfully. Signing you in…
              </div>
            ) : null}
            {formError ? (
              <div role="alert" className="rounded-2xl border border-terracotta-200 bg-terracotta-50 px-3.5 py-2.5 text-sm text-terracotta-700 animate-[gtour-fade-up_300ms_ease-out]">
                {formError}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-3 animate-[gtour-fade-up_280ms_ease-out]">
                <div>
                  <p className="mb-1.5 text-sm font-semibold tracking-[-0.01em] text-ink-800">Account type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map((option) => {
                      const active = role === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRole(option.value)}
                          className={cn(
                            'group flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200',
                            active
                              ? 'border-sea-400 bg-sea-50/70 shadow-[0_0_0_3px_rgba(20,122,128,0.10)]'
                              : 'border-sand-200 bg-white hover:border-sand-300 hover:bg-sand-50'
                          )}
                          aria-pressed={active}
                        >
                          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors', active ? 'bg-sea-100' : 'bg-sand-100 group-hover:bg-sand-200/70')}>
                            <RoleIcon type={option.icon} active={active} />
                          </span>
                          <span className="min-w-0">
                            <span className={cn('block text-[13px] font-semibold leading-tight', active ? 'text-sea-800' : 'text-ink-800')}>{option.label}</span>
                            <span className="block text-[11px] leading-snug text-ink-500">{option.desc}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field label="Full name" htmlFor="register-name" error={fieldErrors.name}>
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Doe"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    invalid={Boolean(fieldErrors.name)}
                    className="h-11 bg-white"
                  />
                </Field>

                <Field label="Email address" htmlFor="register-email" error={fieldErrors.email}>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    invalid={Boolean(fieldErrors.email)}
                    className="h-11 bg-white"
                  />
                </Field>

                <Button type="submit" size="lg" className="w-full !min-h-[3rem]" disabled={success}>
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-3 animate-[gtour-fade-up_280ms_ease-out]">
                <Field
                  label="Password"
                  htmlFor="register-password"
                  error={fieldErrors.password}
                  hint={passwordHint ?? 'At least 8 characters.'}
                >
                  <div className="relative">
                    <Input
                      id="register-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      invalid={Boolean(fieldErrors.password)}
                      className="h-11 bg-white pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-pill px-2.5 py-1 text-xs font-semibold text-ink-500 transition-all hover:bg-sand-100 hover:text-sea-700"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm password" htmlFor="register-confirm" error={fieldErrors.confirmPassword}>
                  <Input
                    id="register-confirm"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    invalid={Boolean(fieldErrors.confirmPassword)}
                    className="h-11 bg-white"
                  />
                </Field>

                <div>
                  <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-ink-600">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-sand-300 text-sea-600 focus:ring-sea-500"
                      aria-invalid={Boolean(fieldErrors.terms)}
                    />
                    <span>
                      I agree to the{' '}
                      <Link href="/terms" className="font-semibold text-sea-600 underline decoration-sea-300 underline-offset-4 hover:text-sea-700">
                        Terms
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="font-semibold text-sea-600 underline decoration-sea-300 underline-offset-4 hover:text-sea-700">
                        Privacy policy
                      </Link>
                      .
                    </span>
                  </label>
                  {fieldErrors.terms ? (
                    <p role="alert" className="mt-1 text-xs font-medium text-terracotta-700">{fieldErrors.terms}</p>
                  ) : null}
                </div>

                <div className="flex gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setFormError(null); }}
                    className="inline-flex min-h-[3rem] items-center justify-center rounded-pill border border-ink-200 bg-white px-5 text-sm font-semibold text-ink-700 transition-all hover:border-sea-300 hover:bg-sand-50"
                  >
                    Back
                  </button>
                  <Button type="submit" size="lg" className="!min-h-[3rem] flex-1" disabled={submitting || success}>
                    {submitting || success ? (
                      <span className="inline-flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />{success ? 'Signing you in…' : 'Creating…'}</span>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <p className="mt-3 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-sea-600 underline decoration-sea-300 underline-offset-4 transition-colors hover:text-sea-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}