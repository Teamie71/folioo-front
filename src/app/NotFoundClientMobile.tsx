import Image from 'next/image';
import { CommonButton } from '@/components/CommonButton';

export default function NotFoundClientMobile() {
  return (
    <div className='flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white px-[2rem] py-[2rem]'>
      <div className='flex w-full max-w-[28rem] flex-col items-center text-center'>
        <Image
          src='/BlurredLogo.svg'
          alt=''
          width={150}
          height={150}
          className='h-[5rem] w-[5rem]'
        />

        <h1 className='mt-[1.25rem] text-[1.25rem] leading-snug font-bold text-[#1A1A1A]'>
          앗, 페이지를 찾을 수 없어요.
        </h1>

        <p className='mt-[1rem] text-[0.875rem] leading-[1.5] text-[#1A1A1A]'>
          잠시 후 다시 시도하거나, 메인 페이지로 이동해 주세요.
          <br />
          문제가 계속될 경우
          <br />
          <a
            href='mailto:teamie0701@gmail.com'
            className='ml-[0.25rem] text-[#5060C5] underline underline-offset-2'
          >
            teamie0701@gmail.com
          </a>
          으로 문의해 주세요.
        </p>

        <CommonButton
          variantType='Execute'
          href='/'
          px='2.25rem'
          py='0.75rem'
          className='mt-[2.5rem] rounded-[6.25rem]'
        >
          메인 페이지로 이동
        </CommonButton>
      </div>
    </div>
  );
}
