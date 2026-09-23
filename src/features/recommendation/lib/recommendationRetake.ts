import { clearRecommendationPostAuthUuid } from '@/features/recommendation/lib/recommendationPostAuth';

const RECOMMENDATION_RETAKE_STORAGE_KEY = 'recommendation-retake';
const RECOMMENDATION_INVALIDATED_UUIDS_KEY =
  'recommendation-invalidated-result-uuids';

function readInvalidatedUuids(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = sessionStorage.getItem(RECOMMENDATION_INVALIDATED_UUIDS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter((value): value is string => typeof value === 'string'),
    );
  } catch {
    return new Set();
  }
}

function writeInvalidatedUuids(uuids: Set<string>): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(
    RECOMMENDATION_INVALIDATED_UUIDS_KEY,
    JSON.stringify([...uuids]),
  );
}

export function markRecommendationRetake(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(RECOMMENDATION_RETAKE_STORAGE_KEY, '1');
}

export function clearRecommendationRetake(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(RECOMMENDATION_RETAKE_STORAGE_KEY);
}

export function isRecommendationRetakeActive(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(RECOMMENDATION_RETAKE_STORAGE_KEY) === '1';
}

export function invalidateRecommendationResultUuid(uuid: string): void {
  const trimmed = uuid.trim();
  if (!trimmed) return;
  const uuids = readInvalidatedUuids();
  uuids.add(trimmed);
  writeInvalidatedUuids(uuids);
}

export function isRecommendationResultUuidInvalidated(uuid: string): boolean {
  const trimmed = uuid.trim();
  if (!trimmed) return false;
  return readInvalidatedUuids().has(trimmed);
}

/** 다시하기: 이전 결과 uuid를 무효화하고 retake 플래그를 켠다. */
export function beginRecommendationRetake(uuid?: string | null): void {
  if (uuid) invalidateRecommendationResultUuid(uuid);
  markRecommendationRetake();
  clearRecommendationPostAuthUuid();
}
