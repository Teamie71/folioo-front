'use client';

import Image from 'next/image';
import { CommonButton } from '@/components/CommonButton';

export function CommonErrorLayout() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white px-[1.5rem] py-[3rem]">
      <div className="flex max-w-[28rem] flex-col items-center gap-[2.5rem] text-center">
        <Image
          src="/BlurredLogo.svg"
          alt=""
          width={150}
          height={150}
          className="h-[9.375rem] w-[9.375rem]"
        />

        <h1 className="mt-[1.25rem] whitespace-nowrap text-[3rem] font-bold text-[#1A1A1A]">
          앗, 페이지를 찾을 수 없어요.
        </h1>

        <div className="mb-[2.5rem] flex flex-col gap-1 text-[1.125rem] leading-[1.5] text-[#1A1A1A] sm:text-[1rem]">
          <p>잠시 후 다시 시도하거나, 메인 페이지로 이동해 주세요.</p>
          <p>
            문제가 계속될 경우{' '}
            <a
              href="mailto:teamie0701@gmail.com"
              className="text-[#5060C5] underline underline-offset-2"
            >
              teamie0701@gmail.com
            </a>{' '}
            으로 문의해 주세요.
          </p>
        </div>

        <CommonButton
          variantType="Execute"
          href="/"
          px="2rem"
          py="1.25rem"
          className="rounded-[100px]"
        >
          메인 페이지로 이동
        </CommonButton>
      </div>
    </div>
  );
}
