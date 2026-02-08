export const PortfolioComments = () => {
  return (
    <div className='mx-auto flex w-full flex-col items-center gap-[7.75rem]'>
      <div className='flex flex-col items-center gap-[3.25rem]'>
        <div className='mr-[19.75rem] flex w-[38.5rem] flex-col rounded-[6.25rem] bg-[#FFFFFF] px-[5rem] py-[2rem] text-start shadow-[0px_4px_8px_0px_#00000033]'>
          <p className='text-[1.125rem] leading-[150%] text-[#000000]'>
            특정 직무에 적합한 활동을 주로 했는데,
          </p>

          <div className='flex gap-[0.25rem]'>
            <p className='text-[1.125rem] leading-[150%] text-[#000000]'>
              막상 취업 시장에 나와보니
            </p>
            <p className='text-[1.25rem] leading-[130%] font-bold text-[#000000]'>
              다른 직무도 지원할 수밖에 없어요.
            </p>
          </div>
        </div>

        <div className='ml-[16rem] flex w-[40.5rem] flex-col rounded-[6.25rem] bg-[#FFFFFF] px-[5rem] py-[2rem] text-start shadow-[0px_4px_8px_0px_#00000033]'>
          <p className='text-[1.125rem] leading-[150%] text-[#000000]'>
            포트폴리오 하나로 여러 직무와 기업에 지원하니 경쟁력이 떨어지지만,
          </p>

          <div className='flex gap-[0.25rem]'>
            <p className='text-[1.125rem] leading-[150%] text-[#000000]'>
              공고마다 새로 포트폴리오를 쓰기에는
            </p>
            <p className='text-[1.25rem] leading-[130%] font-bold text-[#000000]'>
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
