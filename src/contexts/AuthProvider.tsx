'use client';

import { refreshAccessToken } from '@/services/auth';
import { SessionExpiredNotice } from '@/components/SessionExpiredNotice';
import { useAuthStore } from '@/store/useAuthStore';
import { type PropsWithChildren, useEffect } from 'react';

/* 앱 로드 시 세션 유지
refreshToken이 httpOnly 쿠키에 있으면 /auth/refresh로 accessToken을 다시 받아 스토어에 저장 */
export function AuthProvider({ children }: PropsWithChildren) {
  const sessionExpired = useAuthStore((s) => s.sessionExpired);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setSessionRestoreAttempted = useAuthStore(
    (s) => s.setSessionRestoreAttempted,
  );

  useEffect(() => {
    if (sessionExpired || accessToken != null) {
      setSessionRestoreAttempted(true);
      return;
    }

    let cancelled = false;

    refreshAccessToken()
      .catch(() => {
        // refresh 실패시 로그인 안 된 상태 유지
      })
      .finally(() => {
        if (!cancelled) {
          setSessionRestoreAttempted(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, sessionExpired, setSessionRestoreAttempted]);

  return (
    <>
      {children}
      <SessionExpiredNotice />
    </>
  );
}
