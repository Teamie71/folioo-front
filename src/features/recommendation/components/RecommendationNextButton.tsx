import type { ReactNode } from 'react';
import { RefundButtonIcon } from '@/components/icons/RefundButtonIcon';
import { cn } from '@/utils/utils';

interface RecommendationNextButtonProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export function RecommendationNextButton({
  children = '다음 단계',
  disabled = false,
  onClick,
}: RecommendationNextButtonProps) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-[2.125rem] items-center gap-[0.375rem] rounded-[6.25rem] border-[0.09375rem] px-[0.75rem] py-[0.25rem] text-center text-[0.875rem] font-semibold transition-colors',
        disabled
          ? 'cursor-not-allowed border-unactive bg-unactive text-white hover:bg-unactive [&_path]:stroke-white'
          : 'cursor-pointer border-main bg-sub1 text-main hover:bg-sub-hover',
      )}
    >
      <span>{children}</span>
      <RefundButtonIcon />
    </button>
  );
}
