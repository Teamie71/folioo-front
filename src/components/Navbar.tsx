'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(prev => !prev);
  };

  return (
    <nav className="w-[1056px] mx-auto bg-white">
        <div className="flex items-center justify-between h-[80px]">
          <div className="flex items-center gap-[60px]">
            {/* 로고 플레이스홀더 */}
            <div className="flex items-center gap-[3px]">
              <div className="w-[40px] h-[40px] bg-[#E0E0E0]"></div>
              <div className="w-[77px] h-[40px] bg-[#E0E0E0]"></div>
            </div>
            
            {/* 네비게이션 링크 */}
            <div className="flex items-center gap-[40px]">
              <Link href="/" className="inline-block no-underline text-[#333333] font-[16px] py-[8px]">
                인사이트 로그
              </Link>
              <Link href="/" className="inline-block no-underline text-[#333333] font-[16px] py-[8px]">
                경험 정리
              </Link>
              <Link href="/" className="inline-block no-underline text-[#333333] font-[16px] py-[8px]">
                포트폴리오 첨삭
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-[40px]">
                <Link href="/" className="inline-block no-underline text-[#333333] font-[16px] py-[8px]">
                  크레딧 충전
                </Link>
                <button onClick={handleLogin} className="w-[40px] h-[40px] rounded-full bg-[#E0E0E0] border-none outline-none focus:outline-none cursor-pointer"></button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-[28px] py-[8px] bg-[#5060C5] text-[#FFFFFF] font-bold text-[16px] rounded-[100px] border-none outline-none focus:outline-none cursor-pointer"
              >
                로그인
              </button>
            )}
          </div>
        </div>
    </nav>
  );
}
