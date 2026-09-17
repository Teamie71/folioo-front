const RECOMMENDATION_RETAKE_STORAGE_KEY = 'recommendation-retake';

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
