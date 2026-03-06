'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { useAuthStore } from '@/store/useAuthStore';

const LOGIN_REQUIRED_REDIRECT_MS = 2000;

// 비로그인 시 LoginRequiredModal을 2초 표시한 뒤 로그인 페이지로 리다이렉트
export function LoginRequiredRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isUnauthenticated = sessionRestoreAttempted && accessToken == null;

  useEffect(() => {
    if (!isUnauthenticated) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      router.push('/login?redirect_to=' + encodeURIComponent(pathname ?? '/'));
    }, LOGIN_REQUIRED_REDIRECT_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isUnauthenticated, pathname, router]);

  if (!sessionRestoreAttempted) return null;
  if (isUnauthenticated) {
    return <LoginRequiredModal open={true} onOpenChange={() => {}} />;
  }
  return <>{children}</>;
}
