import { GoogleLoginButton } from '@/features/login/GoogleLoginButton';
import { KakaoLoginButton } from '@/features/login/KakaoLoginButton';
import { NaverLoginButton } from '@/features/login/NaverLoginButton';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
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
      <div className='flex items-center gap-[6.25rem]'>
        <Link
          href='/login/tos'
          className='cursor-pointer text-[1rem] text-[#000000]'
        >
          서비스 이용 약관
        </Link>
        <button className='cursor-pointer text-[1rem] text-[#000000]'>
          개인정보 처리방침
        </button>
        <button className='cursor-pointer text-[1rem] text-[#000000]'>
          마케팅 정보 수신
        </button>
      </div>
    </div>
  );
}
