'use client';

import { CloseIcon } from '@/components/icons/CloseIcon';
import { openFeedbackForm } from '@/constants/feedback';

interface OBTBannerMobileProps {
  onDismiss: () => void;
}

export function OBTBannerMobile({ onDismiss }: OBTBannerMobileProps) {
  return (
    <div className='fixed top-[52px] right-0 left-0 z-[50] flex w-full items-center justify-between bg-gradient-to-r from-[#FFFDE5] to-[#FFF1FE] px-[1rem] py-[0.875rem]'>
      <div
        className='flex cursor-pointer items-center gap-[0.5rem]'
        onClick={openFeedbackForm}
      >
        <div className='typo-c1-b text-main flex h-[1.375rem] w-[3.625rem] items-center justify-center rounded-[3.75rem] bg-white px-[0.875rem] py-[0.125rem]'>
          BETA
        </div>

        <p className='typo-c1 text-gray8'>
          사용 후기 남기고,{' '}
          <span className='typo-c1-sb text-gray9'>무료 이용권</span> 받기 →
        </p>
      </div>

      <button onClick={onDismiss} className='flex items-center justify-center'>
        <CloseIcon className='h-[1.5rem] w-[1.5rem] text-[#9EA4A9]' />
      </button>
    </div>
  );
}
