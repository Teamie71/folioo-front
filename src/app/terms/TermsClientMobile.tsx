'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { ButtonSpinnerIcon } from '@/components/icons/ButtonSpinnerIcon';

export default function TermsClientMobile({
  children,
}: {
  children: ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}

export function TermsMobileBottomSubmitButton({
  disabled,
  onClick,
  isSubmitting,
}: {
  disabled: boolean;
  onClick: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className='fixed right-0 bottom-[24px] left-0 z-50 px-[1rem]'>
      <CommonButton
        variantType='Execute'
        style={{ width: '100%' }}
        py='0.75rem'
        disabled={disabled}
        onClick={onClick}
        className='typo-nav-select w-full'
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            <ButtonSpinnerIcon size={32} />
          </span>
        ) : (
          '가입하기'
        )}
      </CommonButton>
    </div>
  );
}
