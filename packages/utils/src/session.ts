/**
 * Minimal client-side session storage for the JWT issued by auth endpoints.
 * Only non-sensitive identity fields are cached for display.
 */
import type { AuthUserDto } from './types';

export const TOKEN_STORAGE_KEY = 'gtour.token';
export const USER_STORAGE_KEY = 'gtour.user';
export const SESSION_EVENT = 'gtour:session-change';

function notifySessionChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function saveToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  notifySessionChange();
}

export function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function saveUser(user: AuthUserDto): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  notifySessionChange();
}

export function readUser(): AuthUserDto | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUserDto;
    return parsed && typeof parsed.id === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

/** Persist both halves of a successful authentication response. */
export function saveSession(user: AuthUserDto, token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  notifySessionChange();
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
  notifySessionChange();
}

/** @deprecated Use clearSession */
export function clearToken(): void {
  clearSession();
}
