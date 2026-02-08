'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <nav className='fixed top-0 right-0 left-0 z-50 w-full bg-white'>
      <div className='mx-auto w-[1056px]'>
        <div className='flex h-[80px] items-center justify-between'>
          <div className='flex items-center gap-[60px]'>
            {/* 로고 플레이스홀더 */}
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
              <Link
                href='/log'
                className='inline-block py-[8px] font-[16px] text-[#333333] no-underline'
              >
                인사이트 로그
              </Link>
              <Link
                href='/experience'
                className='inline-block py-[8px] font-[16px] text-[#333333] no-underline'
              >
                경험 정리
              </Link>
              <Link
                href='/correction'
                className='inline-block py-[8px] font-[16px] text-[#333333] no-underline'
              >
                포트폴리오 첨삭
              </Link>
            </div>
          </div>

          <div className='flex items-center'>
            {isLoggedIn ? (
              <div className='flex items-center gap-[40px]'>
                <Link
                  href='/topup'
                  className='inline-block py-[8px] font-[16px] text-[#333333] no-underline'
                >
                  크레딧 충전
                </Link>
                <button
                  onClick={handleLogin}
                  className='h-[40px] w-[40px] cursor-pointer rounded-full border-none bg-[#E0E0E0] outline-none focus:outline-none'
                ></button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className='cursor-pointer rounded-[100px] border-none bg-[#5060C5] px-[28px] py-[8px] text-[16px] font-bold text-[#FFFFFF] outline-none focus:outline-none'
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
