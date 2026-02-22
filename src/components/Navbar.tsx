'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ProfileModal } from '@/components/ProfileModal';
import { cn } from '@/utils/utils';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const linkClass = (href: string) =>
    cn(
      'inline-block py-[8px] font-[16px] no-underline transition-colors hover:font-bold',
      pathname === href || (href !== '/' && pathname.startsWith(href))
        ? 'font-bold text-[#5060C5]'
        : 'text-[#333333]',
    );

  const handleLogin = () => {
    setIsLoggedIn(true);
    router.push('/login');
  };

  return (
    <nav className='fixed top-0 right-0 left-0 z-50 w-full bg-white'>
      <div className='mx-auto w-[1056px]'>
        <div className='flex h-[80px] items-center justify-between'>
          <div className='flex items-center gap-[60px]'>
            <Link href='/'>
              <Image
                src='/MainLogo.svg'
                alt='MainLogo'
                width={128}
                height={32}
                className='cursor-pointer'
              />
            </Link>

            {/* 네비게이션 링크 */}
            <div className='flex items-center gap-[40px]'>
              <Link href='/log' className={linkClass('/log')}>
                인사이트 로그
              </Link>
              <Link href='/experience' className={linkClass('/experience')}>
                경험 정리
              </Link>
              <Link href='/correction' className={linkClass('/correction')}>
                포트폴리오 첨삭
              </Link>
            </div>
          </div>

          <div className='flex items-center'>
            {isLoggedIn ? (
              <div className='flex items-center gap-[40px]'>
                <Link href='/topup' className={linkClass('/topup')}>
                  이용권 구매
                </Link>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className='flex cursor-pointer items-center gap-[0.25rem] border-none bg-transparent outline-none focus:outline-none'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M13.2013 10.0912C14.4323 10.6724 15.482 11.5776 16.2378 12.7099C16.9935 13.8422 17.4269 15.1589 17.4913 16.5187C17.4998 16.6433 17.4834 16.7683 17.4431 16.8864C17.4027 17.0046 17.3391 17.1135 17.256 17.2067C17.173 17.2999 17.0722 17.3756 16.9594 17.4294C16.8467 17.4831 16.7245 17.5138 16.5997 17.5196C16.475 17.5254 16.3504 17.5063 16.2332 17.4633C16.1159 17.4203 16.0085 17.3543 15.9171 17.2693C15.8257 17.1842 15.7523 17.0817 15.701 16.9678C15.6498 16.854 15.6218 16.731 15.6188 16.6062C15.5506 15.1619 14.9289 13.7992 13.8826 12.8012C12.8364 11.8031 11.446 11.2463 10 11.2463C8.55405 11.2463 7.16364 11.8031 6.11738 12.8012C5.07113 13.7992 4.4494 15.1619 4.38125 16.6062C4.36441 16.8507 4.25252 17.0789 4.06953 17.2419C3.88654 17.4049 3.647 17.4897 3.40221 17.4783C3.15742 17.4668 2.92684 17.36 2.75984 17.1807C2.59285 17.0013 2.50272 16.7637 2.50875 16.5187C2.57304 15.159 3.00616 13.8425 3.76169 12.7102C4.51721 11.5779 5.56665 10.6725 6.7975 10.0912C6.00877 9.43333 5.44183 8.54845 5.17382 7.55694C4.9058 6.56543 4.94972 5.51543 5.29958 4.54976C5.64945 3.58409 6.28829 2.74964 7.12921 2.1599C7.97012 1.57017 8.97228 1.25378 9.99938 1.25378C11.0265 1.25378 12.0286 1.57017 12.8695 2.1599C13.7105 2.74964 14.3493 3.58409 14.6992 4.54976C15.049 5.51543 15.093 6.56543 14.8249 7.55694C14.5569 8.54845 13.99 9.43333 13.2013 10.0912ZM13.125 6.24997C13.125 5.42117 12.7958 4.62631 12.2097 4.04026C11.6237 3.45421 10.8288 3.12497 10 3.12497C9.1712 3.12497 8.37635 3.45421 7.79029 4.04026C7.20424 4.62631 6.875 5.42117 6.875 6.24997C6.875 7.07877 7.20424 7.87363 7.79029 8.45968C8.37635 9.04573 9.1712 9.37497 10 9.37497C10.8288 9.37497 11.6237 9.04573 12.2097 8.45968C12.7958 7.87363 13.125 7.07877 13.125 6.24997Z'
                      fill='black'
                    />
                  </svg>
                  <span className='text-[1rem] font-medium text-[#1A1A1A]'>MY</span>
                </button>
              </div>
            ) : (
              <div className='flex items-center gap-[40px]'>
                <Link href='/topup' className={linkClass('/topup')}>
                  이용권 구매
                </Link>
                <button
                onClick={handleLogin}
                className='cursor-pointer rounded-[100px] border-none bg-[#5060C5] px-[28px] py-[8px] text-[16px] font-bold text-[#FFFFFF] outline-none focus:outline-none'
                >
                로그인
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </nav>
  );
}
