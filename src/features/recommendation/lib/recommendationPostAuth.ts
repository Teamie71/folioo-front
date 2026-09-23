import { buildRecommendationResultLoginRedirect } from '@/features/recommendation/lib/recommendationShare';

const POST_AUTH_UUID_KEY = 'folioo:recommendation-post-auth-uuid';

function readUuid(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(POST_AUTH_UUID_KEY)?.trim() || '';
  } catch {
    return '';
  }
}

export function markRecommendationPostAuthUuid(uuid?: string | null): void {
  if (typeof window === 'undefined') return;
  const trimmed = uuid?.trim();
  if (!trimmed) return;
  try {
    localStorage.setItem(POST_AUTH_UUID_KEY, trimmed);
  } catch {
    /* ignore */
  }
}

export function readRecommendationPostAuthUuid(): string {
  return readUuid();
}

export function clearRecommendationPostAuthUuid(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(POST_AUTH_UUID_KEY);
  } catch {
    /* ignore */
  }
}

export function buildRecommendationPostAuthResultPath(): string | null {
  const uuid = readUuid();
  if (!uuid) return null;
  return buildRecommendationResultLoginRedirect(uuid);
}

export function resolveRecommendationPostSignupPath(): string {
  return buildRecommendationPostAuthResultPath() ?? '/';
}

export function buildRecommendationResultLoginHref(uuid?: string | null): string {
  const redirectTo = buildRecommendationResultLoginRedirect(uuid);
  return `/login?redirect_to=${encodeURIComponent(redirectTo)}`;
}

export function beginRecommendationResultLogin(uuid?: string | null): string {
  markRecommendationPostAuthUuid(uuid);
  return buildRecommendationResultLoginHref(uuid);
}
