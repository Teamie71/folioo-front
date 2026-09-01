import { RefundButtonIcon } from '@/components/icons/RefundButtonIcon';
import { cn } from '@/utils/utils';

interface RecommendationPrevButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export function RecommendationPrevButton({
  disabled = false,
  onClick,
}: RecommendationPrevButtonProps) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-[2.125rem] items-center gap-[0.375rem] rounded-[6.25rem] px-[0.75rem] py-[0.375rem] text-center typo-c1 font-medium text-gray6',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
    >
      <span
        className='inline-flex rotate-180 [&_path]:stroke-gray6'
        aria-hidden
      >
        <RefundButtonIcon />
      </span>
      <span>이전 문항</span>
    </button>
  );
}
