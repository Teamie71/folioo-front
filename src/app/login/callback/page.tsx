'use client';

import { userControllerGetProfile } from '@/api/endpoints/user/user';
import { refreshAccessToken } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

/* 백엔드가 리다이렉트할 때 쿼리로 넘기는 access_token 키 */
const ACCESS_TOKEN_PARAM = 'access_token';
/* 백엔드가 리다이렉트할 때 쿼리로 넘기는 refresh_token 키 (선택, URL로 넘어오면 쿠키에 저장) */
const REFRESH_TOKEN_PARAM = 'refresh_token';
/* 백엔드가 OAuth 콜백 후 리다이렉트할 때 사용 (refreshToken은 httpOnly 쿠키로 설정) */
const STATUS_PARAM = 'status';
const LOGIN_REDIRECT_TO_KEY = 'login_redirect_to';
/** redirect_to가 없을 때 기본 경로. 회원가입 시 terms를 거치도록 /terms */
const DEFAULT_REDIRECT_TO = '/terms';

function LoginCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshTokenCookie = useAuthStore((s) => s.setRefreshTokenCookie);

  useEffect(() => {
    const accessTokenFromUrl = searchParams.get(ACCESS_TOKEN_PARAM);
    const refreshTokenFromUrl = searchParams.get(REFRESH_TOKEN_PARAM);
    const status = searchParams.get(STATUS_PARAM);
    // URL의 redirect_to 우선, 없으면 로그인 페이지에서 저장해 둔 값 사용, 최종 기본값은 /terms(약관)
    const redirectTo =
      searchParams.get('redirect_to') ??
      (typeof window !== 'undefined'
        ? sessionStorage.getItem(LOGIN_REDIRECT_TO_KEY)
        : null) ??
      DEFAULT_REDIRECT_TO;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(LOGIN_REDIRECT_TO_KEY);
      } catch {
        /* ignore */
      }
    }

    if (refreshTokenFromUrl) {
      setRefreshTokenCookie(refreshTokenFromUrl);
    }

    const runAuthFlow = async () => {
      let accessToken: string | null = accessTokenFromUrl;

      // 서버가 ?status=success 로 리다이렉트한 경우
      // 쿠키에 refreshToken이 있음 -> refresh로 accessToken 발급
      if (!accessToken && status === 'success') {
        try {
          accessToken = await refreshAccessToken();
          setAccessToken(accessToken);
        } catch {
          router.replace(redirectTo);
          return;
        }
      } else if (accessToken) {
        setAccessToken(accessToken);
      }

      if (!accessToken) {
        router.replace(redirectTo);
        return;
      }

      try {
        const res = await userControllerGetProfile();
        if (!res?.isSuccess || !res?.result)
          throw new Error('프로필 조회 실패');
      } catch {
        // 프로필 조회 실패 시에도 리다이렉트
      } finally {
        router.replace(redirectTo);
      }
    };

    runAuthFlow();
  }, [searchParams, setAccessToken, setRefreshTokenCookie, router]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <p className='text-[1rem] text-[#666]'></p>
    </div>
  );
}

export default function LoginCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <p className='text-[1rem] text-[#1A1A1A]'></p>
        </div>
      }
    >
      <LoginCallbackContent />
    </Suspense>
  );
}
