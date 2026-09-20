import { cn } from '@/utils/utils';

interface RecommendationBalanceCardProps {
  text: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'web' | 'mobile';
}

export function RecommendationBalanceCard({
  text,
  selected,
  onClick,
  disabled = false,
  variant = 'web',
}: RecommendationBalanceCardProps) {
  const isMobile = variant === 'mobile';

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      className={cn(
        'box-border flex items-center rounded-[16px] border-[1.5px] border-solid px-[1.25rem] py-[2.5rem] text-left whitespace-pre-line',
        isMobile
          ? 'typo-c1 w-full'
          : 'typo-b2 min-h-[8.125rem] w-[30.125rem] shrink-0',
        selected
          ? cn(
              'border-main bg-sub1 text-main',
              isMobile ? 'typo-c1-sb' : 'font-semibold',
            )
          : cn(
              'border-gray4 bg-white font-normal text-gray9',
              !disabled &&
                '[@media(hover:hover)_and_(pointer:fine)]:hover:bg-gray2',
            ),
      )}
    >
      {text}
    </button>
  );
}
