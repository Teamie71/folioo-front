import type { HollandTypeResult } from '@/features/recommendation/types';
import { cn } from '@/utils/utils';

export function hollandCardName(type: { code: string; name: string }) {
  const label = type.name.replace(/\s*\([^)]*\)\s*$/, '').trim();
  return `${label}(${type.code})`;
}

interface RecommendationHollandTypeCardProps {
  type: HollandTypeResult;
}

export function RecommendationHollandTypeCard({
  type,
}: RecommendationHollandTypeCardProps) {
  return (
    <div className='shadow-chat-card box-border flex h-[7.6875rem] w-full flex-col rounded-[12px] bg-gray1 px-[1rem] py-[1rem]'>
      <p className='typo-b2-sb shrink-0 text-gray9'>{hollandCardName(type)}</p>
      <p className='typo-c1 mt-[0.25rem] w-full break-words text-gray9'>
        {type.description}
      </p>
    </div>
  );
}

interface RecommendationHollandTypeCardsProps {
  types: HollandTypeResult[];
}

export function RecommendationHollandTypeCards({
  types,
}: RecommendationHollandTypeCardsProps) {
  const multiTypeGap = types.length >= 2;

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        multiTypeGap ? 'gap-[0.75rem]' : 'gap-0',
      )}
    >
      {types.map((type) => (
        <RecommendationHollandTypeCard key={type.code} type={type} />
      ))}
    </div>
  );
}
