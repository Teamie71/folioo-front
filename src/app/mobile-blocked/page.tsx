'use client';

import { CommonButton } from '@/components/CommonButton';
import { useRouter } from 'next/navigation';

export default function MobileBlockedPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white px-[2rem] py-[2rem]">
      <div className="flex flex-col items-center text-center">
        <p className="text-[1rem] text-[#1A1A1A]">
          모바일 환경을 지원하지 않는 페이지예요.
          <br />
          PC로 접속하여 진행해주세요.
        </p>
        <CommonButton
          variantType="Execute"
          onClick={() => router.back()}
          px="2.25rem"
          py="0.75rem"
          className="rounded-[6.25rem] mt-[2.5rem]"
        >
          이전 페이지로
        </CommonButton>
      </div>
    </div>
  );
}
