'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { CloseIcon } from '../icons/CloseIcon';
import { cn } from '@/utils/utils';

const SESSION_STORAGE_KEY = 'bannerBetaDismissed';

export const BannerBeta = () => {
  const pathname = usePathname();
  const isPortfolio = pathname?.includes('/portfolio');

  const handleClose = () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    if (typeof document !== 'undefined') {
      document.body.dataset.bannerDismissed = 'true';
    }
  };

  return (
    <div className='banner-beta fixed top-[80px] right-0 left-0 z-40 flex h-[3.75rem] w-full bg-gradient-to-r from-[#FFFDE5] to-[#FFF1FE]'>
      <div
        className={cn(
          'mx-auto flex items-center justify-between',
          isPortfolio
            ? 'w-[1392px] min-w-[1392px]'
            : 'w-[1056px] min-w-[1056px]',
        )}
      >
        <div className='flex items-center gap-[1.25rem]'>
          <div className='rounded-[3.75rem] bg-white px-[1.75rem] py-[0.25rem] text-[1rem] font-semibold text-[#5060C5]'>
            Beta
          </div>

          <div className='text-[1rem] leading-[150%]'>
            <p>
              Beta 기간 한정! 베스트 피드백 선정 시{' '}
              <span className='font-bold'>배민 1만원권</span>을 드립니다.
            </p>
          </div>
        </div>

        <div className='flex items-center gap-[3.75rem]'>
          <Link
            href='/feedback'
            className='cursor-pointer text-[1rem] font-semibold text-[#5060C5] underline hover:opacity-90'
          >
            피드백 남기기 →
          </Link>
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
