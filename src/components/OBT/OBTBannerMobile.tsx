'use client';

import Link from 'next/link';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { FEEDBACK_PATH } from '@/constants/feedback';
import { FEEDBACK_REWARD_HEADLINE } from '@/features/feedback/constants';

interface OBTBannerMobileProps {
  onDismiss: () => void;
}

export function OBTBannerMobile({ onDismiss }: OBTBannerMobileProps) {
  return (
    <div className='fixed top-[52px] right-0 left-0 z-[50] flex h-[50px] w-full items-center justify-between gap-2 bg-gradient-to-r from-[#FFFDE5] to-[#FFF1FE] px-4'>
      <Link
        href={FEEDBACK_PATH}
        aria-label='피드백 남기기'
        className='flex min-w-0 items-center gap-2'
      >
        <span className='typo-c1-b text-main flex h-[1.375rem] shrink-0 items-center justify-center rounded-[3.75rem] bg-white px-3 py-[0.125rem]'>
          Beta
        </span>

        <span className='text-gray8 text-[0.75rem] leading-[1.125rem] break-keep'>
          {FEEDBACK_REWARD_HEADLINE}
        </span>
      </Link>

      <button
        type='button'
        aria-label='피드백 배너 닫기'
        onClick={onDismiss}
        className='flex shrink-0 items-center justify-center'
      >
        <CloseIcon className='h-[1.5rem] w-[1.5rem] text-[#9EA4A9]' />
      </button>
    </div>
  );
}
