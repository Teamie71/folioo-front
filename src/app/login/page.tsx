'use client';

import { GoogleLoginButton } from '@/features/login/components/GoogleLoginButton';
import { KakaoLoginButton } from '@/features/login/components/KakaoLoginButton';
import { NaverLoginButton } from '@/features/login/components/NaverLoginButton';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

export default function Login() {
  useRedirectIfLoggedIn();

  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const showLogin = !sessionRestoreAttempted || accessToken == null;

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
          <GoogleLoginButton />
        </div>
      </div>

      {/* 약관, 개인정보 처리방침, 마케팅 수신 */}
      <div className='flex items-center'>
        <Link
          href='/login/tos'
          className='group cursor-pointer text-[0.875rem] text-[#74777D]'
        >
          <span className='relative inline-block w-[8.75rem] text-center'>
            <span className='invisible inline-block font-bold' aria-hidden>
              서비스 이용 약관
            </span>
            <span className='absolute top-0 left-0 w-full text-center group-hover:font-bold'>
              서비스 이용 약관
            </span>
          </span>
        </Link>
        <div className='h-[1rem] w-[0.0625rem] bg-[#74777D]' />
        <Link
          href='/privacy'
          className='group cursor-pointer text-[0.875rem] text-[#74777D]'
        >
          <span className='relative inline-block w-[8.75rem] text-center'>
            <span className='invisible inline-block font-bold' aria-hidden>
              개인정보 처리방침
            </span>
            <span className='absolute top-0 left-0 w-full text-center group-hover:font-bold'>
              개인정보 처리방침
            </span>
          </span>
        </Link>
        <div className='h-[1rem] w-[0.0625rem] bg-[#74777D]' />
        <Link
          href='/marketing'
          className='group cursor-pointer text-[0.875rem] text-[#74777D]'
        >
          <span className='relative inline-block w-[8.75rem] text-center'>
            <span className='invisible inline-block font-bold' aria-hidden>
              마케팅 정보 수신
            </span>
            <span className='absolute top-0 left-0 w-full text-center group-hover:font-bold'>
              마케팅 정보 수신
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
