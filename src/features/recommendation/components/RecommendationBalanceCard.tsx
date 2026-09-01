import { cn } from '@/utils/utils';

interface RecommendationBalanceCardProps {
  text: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'web' | 'mobile';
}

export function RecommendationBalanceCard({
  text,
  selected,
  onClick,
  variant = 'web',
}: RecommendationBalanceCardProps) {
  const isMobile = variant === 'mobile';

  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'box-border flex w-full cursor-pointer items-center rounded-[16px] border border-solid bg-gray1 px-[1.25rem] py-[2.5rem] text-left whitespace-pre-line',
        isMobile ? 'typo-c1' : 'min-h-[8.125rem] max-w-[30.125rem] typo-b2',
        !isMobile && 'w-[30.125rem]',
        selected
          ? cn(
              'border-[1.5px] border-main bg-sub1 text-main',
              isMobile ? 'typo-c1-sb' : 'font-semibold',
            )
          : 'border-gray4 font-normal text-gray9',
      )}
    >
      {text}
    </button>
  );
}
