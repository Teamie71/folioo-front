'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/* 백엔드가 리다이렉트할 때 쿼리로 넘기는 access_token 키  */
const ACCESS_TOKEN_PARAM = 'access_token';
/* 백엔드가 리다이렉트할 때 쿼리로 넘기는 refresh_token 키 (선택, URL로 넘어오면 쿠키에 저장) */
const REFRESH_TOKEN_PARAM = 'refresh_token';

export default function LoginCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshTokenCookie = useAuthStore((s) => s.setRefreshTokenCookie);

  useEffect(() => {
    const accessToken = searchParams.get(ACCESS_TOKEN_PARAM);
    const refreshToken = searchParams.get(REFRESH_TOKEN_PARAM);

    if (accessToken) {
      setAccessToken(accessToken);
    }
    if (refreshToken) {
      setRefreshTokenCookie(refreshToken);
    }

    const redirectTo = searchParams.get('redirect_to') ?? '/';
    router.replace(redirectTo);
  }, [searchParams, setAccessToken, setRefreshTokenCookie, router]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <p className='text-[1rem] text-[#666]'>로그인 처리 중...</p>
    </div>
  );
}
