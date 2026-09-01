import type { ReactNode } from 'react';
import { RecommendationNextButton } from '@/features/recommendation/components/RecommendationNextButton';

interface RecommendationMobileStepFooterProps {
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

export function RecommendationMobileStepFooter({
  disabled = false,
  onClick,
  children = '다음 단계',
}: RecommendationMobileStepFooterProps) {
  return (
    <div className='flex justify-end px-[1rem]'>
      <RecommendationNextButton
        disabled={disabled}
        onClick={onClick}
        className='h-[2.0625rem] py-[0.375rem] font-medium'
      >
        {children}
      </RecommendationNextButton>
    </div>
  );
}
