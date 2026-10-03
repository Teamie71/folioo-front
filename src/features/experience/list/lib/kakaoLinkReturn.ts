export const KAKAO_LINK_ENTRY_PATH = '/kakao-channel/link';
export const KAKAO_LINK_RESULT_PATH = '/kakao-channel/link/result';
export const KAKAO_LINK_AFTER_SIGNUP_KEY = 'folioo:kakao-link-after-signup';
export const KAKAO_LINK_TOKEN_KEY = 'folioo:kakao-link-token';
export const KAKAO_LINK_RETURN_TO_CHANNEL_KEY =
  'folioo:kakao-link-return-to-channel';

export function isKakaoLinkPath(path: string): boolean {
  return path === KAKAO_LINK_ENTRY_PATH || path === KAKAO_LINK_RESULT_PATH;
}

export function rememberKakaoLinkAfterSignup(path: string): void {
  if (typeof window === 'undefined' || !isKakaoLinkPath(path)) return;
  sessionStorage.setItem(KAKAO_LINK_AFTER_SIGNUP_KEY, path);
}

export function takeKakaoLinkAfterSignup(): string | null {
  if (typeof window === 'undefined') return null;
  const path = sessionStorage.getItem(KAKAO_LINK_AFTER_SIGNUP_KEY);
  sessionStorage.removeItem(KAKAO_LINK_AFTER_SIGNUP_KEY);
  return path && isKakaoLinkPath(path) ? path : null;
}
