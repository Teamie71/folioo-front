import Image from 'next/image';

export const PortfolioComments = () => {
  return (
    <div className='mx-auto flex w-full flex-col items-center gap-[7.75rem]'>
      <div className='flex flex-col items-center gap-[3.25rem]'>
        {/* 상단 말풍선 + 데코 블러 버블 (모바일: 문구만 오른쪽 정렬) */}
        <div className='relative self-end md:mr-[19.75rem] md:self-auto'>
          <div className='flex w-[38.5rem] translate-x-[10rem] translate-y-[7rem] flex-col rounded-[6.25rem] bg-[#FFFFFF] px-[3rem] py-[2rem] text-start shadow-[0px_4px_8px_0px_#00000033] md:translate-x-0 md:translate-y-0 md:px-[5rem]'>
            <p className='text-[1rem] leading-[150%] text-[#000000] md:text-[1.125rem]'>
              특정 직무에 적합한 활동을 주로 했는데,
            </p>

            <div className='flex flex-col gap-[0.25rem] md:flex-row'>
              <p className='ml-[4.8rem] text-[1rem] leading-[150%] text-[#000000] md:ml-0 md:text-[1.125rem]'>
                막상 취업 시장에 나와보니
              </p>
              <p className='ml-[2rem] text-[1rem] leading-[130%] font-bold text-[#000000] md:ml-0 md:text-[1.25rem]'>
                다른 직무도 지원할 수밖에 없어요.
              </p>
            </div>
          </div>

          {/* 왼쪽 3.625rem, 아래 1.5rem 위치의 블러 버블 (레이아웃 비영향) */}
          <Image
            src='/LandingBlurBubble1.svg'
            alt='PortfolioProblems1'
            width={378}
            height={88}
            className='pointer-events-none absolute top-[8.5rem] left-[-3.625rem] -z-10 blur-[0.3rem]'
            aria-hidden
          />

          {/* 오른쪽 6rem, 아래 3.75rem 위치의 블러 버블 (레이아웃 비영향) */}
          <Image
            src='/LandingBlurBubble2.svg'
            alt='PortfolioProblems2'
            width={648}
            height={118}
            className='pointer-events-none absolute top-[14rem] right-[-22rem] -z-10 blur-[0.35rem]'
            aria-hidden
          />
        </div>

        {/* 모바일: 문구 오른쪽 정렬 */}
        <div className='flex w-[40.5rem] translate-x-[-12rem] translate-y-[7rem] flex-col self-start rounded-[6.25rem] bg-[#FFFFFF] px-[3.75rem] py-[2rem] text-right shadow-[0px_4px_8px_0px_#00000033] md:ml-[16rem] md:translate-x-0 md:translate-y-0 md:self-auto md:px-[5rem] md:text-start'>
          <p className='text-[1rem] leading-[150%] text-[#000000] md:text-[1.125rem]'>
            <span className='block md:inline'>
              포트폴리오 하나로 여러 직무와 기업에
            </span>
            <span className='mr-[2.85rem] block md:ml-0 md:inline'>
              지원하니 경쟁력이 떨어지지만,
            </span>
          </p>

          <div className='flex flex-col gap-[0.25rem] md:flex-row md:gap-[0.25rem]'>
            <p className='mr-[0.25rem] text-[1rem] leading-[150%] text-[#000000] md:ml-0 md:text-[1.125rem]'>
              공고마다 새로 포트폴리오를 쓰기에는
            </p>
            <p className='mr-[5.25rem] text-[1rem] leading-[130%] font-bold text-[#000000] md:ml-0 md:text-[1.25rem]'>
              시간이 너무 오래 걸려요.
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center gap-[0.5rem]'>
        <div className='h-[1.375rem] w-[17.625rem] rounded-[6.25rem] bg-[#ffffff] opacity-50 blur-[0.25rem]' />
        <div className='h-[1.125rem] w-[12rem] rounded-[6.25rem] bg-[#ffffff] opacity-50 blur-[0.25rem]' />
        <div className='h-[0.625rem] w-[7.5rem] rounded-[6.25rem] bg-[#ffffff] opacity-50 blur-[0.25rem]' />
        <div className='h-[0.375rem] w-[4.75rem] rounded-[6.25rem] bg-[#ffffff] opacity-50 blur-[0.25rem]' />
      </div>
    </div>
  );
};
