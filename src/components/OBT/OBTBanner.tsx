'use client';

import { CloseIcon } from '../icons/CloseIcon';

const SESSION_STORAGE_KEY = 'bannerBetaDismissed';

export const BannerBeta = () => {
  const handleClose = () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    if (typeof document !== 'undefined') {
      document.body.dataset.bannerDismissed = 'true';
    }
  };

  return (
    <div className='banner-beta fixed top-[80px] right-0 left-0 z-40 flex h-[3.75rem] w-full bg-gradient-to-r from-[#FFFDE5] to-[#FFF1FE]'>
      <div className='mx-auto flex min-w-[66rem] items-center justify-between'>
        <div className='flex items-center gap-[1.25rem]'>
          <div className='rounded-[3.75rem] bg-white px-[1.75rem] py-[0.25rem] text-[1rem] font-semibold text-[#5060C5]'>
            Beta
          </div>

          <div className='flex items-center gap-[0.25rem] text-[1rem] leading-[150%]'>
            <p>Beta 기간 한정! 사용 후기를 남겨주시는</p>
            <p className='font-bold'>모든 분께 무료 이용권 증정,</p>
            <p>베스트 피드백 선정 시</p>
            <p className='font-bold'> 배민 1만원권까지! </p>
          </div>
        </div>

        <div className='flex items-center gap-[3.75rem]'>
          <p className='cursor-pointer text-[1rem] font-semibold text-[#5060C5] underline'>
            피드백 남기기 →
          </p>
          <button
            type='button'
            className='cursor-pointer'
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
