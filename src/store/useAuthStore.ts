import { create } from 'zustand/react';
import { devtools } from 'zustand/middleware';

const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';

/* 리프레시 토큰을 쿠키에 저장 */
function setRefreshTokenCookie(value: string, maxAgeDays = 30) {
  if (typeof document === 'undefined') return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${REFRESH_TOKEN_COOKIE_KEY}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${typeof window !== 'undefined' && window.location?.protocol === 'https:' ? '; Secure' : ''}`;
}

/* 쿠키에서 리프레시 토큰을 가져오기 */
function getRefreshTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${REFRESH_TOKEN_COOKIE_KEY}=([^;]*)`),
  );
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/* 리프레시 토큰을 쿠키에서 삭제 */
function clearRefreshTokenCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${REFRESH_TOKEN_COOKIE_KEY}=; path=/; max-age=0`;
}

// 인증 스토어 인터페이스
interface AuthStore {
  accessToken: string | null;
  /* 앱 로드 후 refresh로 세션 복원 시도 완료 여부 */
  sessionRestoreAttempted: boolean;
  setSessionRestoreAttempted: (attempted: boolean) => void;
  setAccessToken: (token: string | null) => void;

  setRefreshTokenCookie: (value: string, maxAgeDays?: number) => void;
  getRefreshTokenFromCookie: () => string | null;
  clearAuth: () => void;
}

/* 인증 스토어 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      accessToken: null,
      sessionRestoreAttempted: false,

      // accessToken 설정
      setAccessToken: (token) => set({ accessToken: token }),

      // 세션 복원 시도 완료 여부 설정
      setSessionRestoreAttempted: (attempted) =>
        set({ sessionRestoreAttempted: attempted }),

      // 리프레시 토큰 쿠키에 저장
      setRefreshTokenCookie: (value, maxAgeDays) => {
        setRefreshTokenCookie(value, maxAgeDays);
      },

      // 리프레시 토큰 쿠키에서 가져오기
      getRefreshTokenFromCookie: () => getRefreshTokenFromCookie(),

      // 인증 정보 초기화
      clearAuth: () => {
        clearRefreshTokenCookie();
        set({ accessToken: null });
      },
    }),
    { name: 'auth-store' },
  ),
);

export { REFRESH_TOKEN_COOKIE_KEY };
