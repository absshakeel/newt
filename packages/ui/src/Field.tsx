import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@gtour/utils';

const FIELD =
  'block min-h-[3rem] w-full rounded-2xl border border-sand-300/90 bg-white/95 px-4 py-3 text-[15px] leading-6 text-ink-900 shadow-[0_1px_0_rgba(12,28,44,0.02)] ' +
  'placeholder:text-ink-400/90 transition-all duration-200 ease-premium hover:border-sand-400 ' +
  'focus:border-sea-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(20,122,128,0.10)] focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:border-sand-200 disabled:bg-sand-100 disabled:text-ink-400';

const INVALID =
  'border-terracotta-300 bg-terracotta-50/20 focus:border-terracotta-500 focus:shadow-[0_0_0_4px_rgba(201,107,69,0.12)]';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(FIELD, invalid && INVALID, className)}
      {...props}
    />
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, children, ...props },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(FIELD, 'cursor-pointer appearance-none pr-11', invalid && INVALID, className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <path d="M5.5 7.75 10 12.25l4.5-4.5" />
      </svg>
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(FIELD, 'min-h-28 resize-y py-3', invalid && INVALID, className)}
      {...props}
    />
  );
});

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
  required,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold tracking-[-0.01em] text-ink-800">
        {label}
        {required ? <span className="ml-0.5 text-terracotta-600">*</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-xs leading-relaxed text-ink-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="flex items-start gap-1.5 text-xs font-medium text-terracotta-700">
          <span aria-hidden="true" className="mt-px">•</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
