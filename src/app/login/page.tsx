'use client';

import { GoogleLoginButton } from '@/features/login/components/GoogleLoginButton';
import { KakaoLoginButton } from '@/features/login/components/KakaoLoginButton';
import { NaverLoginButton } from '@/features/login/components/NaverLoginButton';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const LOGIN_REDIRECT_TO_KEY = 'login_redirect_to';

/* 이미 로그인된 상태에서 로그인 페이지 진입 시 이전 페이지로 리다이렉트 */
function useRedirectIfLoggedIn() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );

  useEffect(() => {
    if (!sessionRestoreAttempted || accessToken == null) return;

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [sessionRestoreAttempted, accessToken, router]);
}

function LoginContent() {
  useRedirectIfLoggedIn();
  const searchParams = useSearchParams();

  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const showLogin = !sessionRestoreAttempted || accessToken == null;

  // redirect_to가 있으면 sessionStorage에 저장 (OAuth 후 콜백에서 복원용)
  useEffect(() => {
    const redirectTo = searchParams.get('redirect_to');
    if (redirectTo && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(LOGIN_REDIRECT_TO_KEY, redirectTo);
      } catch {
        /* ignore */
      }
    }
  }, [searchParams]);

  if (!showLogin) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-[1rem] text-[#666]'>이동 중...</p>
      </div>
    );
  }

  return (
    <div className='mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-[3.75rem]'>
      <div className='flex flex-col items-center justify-center gap-[3.75rem]'>
        {/* 로고 */}
        <Image src='/LoginLogo.svg' alt='MainLogo' width={260} height={65} />

        {/* 로그인 버튼 */}
        <div className='flex flex-col gap-[1.25rem]'>
          <KakaoLoginButton />
          <NaverLoginButton />
        </div>
      </div>

      {/* 약관, 개인정보 처리방침, 마케팅 수신 */}
      <div className='flex items-center'>
        <Link
          href='/tos'
          className='group w-[8rem] cursor-pointer text-center text-[0.875rem] text-[#74777D] hover:underline md:w-[8.75rem]'
        >
          서비스 이용약관
        </Link>
        <div className='h-[1rem] w-[0.0625rem] bg-[#74777D]' />
        <Link
          href='/privacy'
          className='group w-[8rem] cursor-pointer text-center text-[0.875rem] font-bold text-[#74777D] hover:underline md:w-[8.75rem]'
        >
          개인정보 처리방침
        </Link>
        <div className='h-[1rem] w-[0.0625rem] bg-[#74777D]' />
        <Link
          href='/marketing'
          className='group w-[8rem] cursor-pointer text-center text-[0.875rem] text-[#74777D] hover:underline md:w-[8.75rem]'
        >
          마케팅 정보 수신
        </Link>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <p className='text-[1rem] text-[#666]'>로딩 중...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
