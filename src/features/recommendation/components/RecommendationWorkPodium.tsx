import type { WorkConditionRank } from '@/features/recommendation/types';
import { RecommendationPodiumStarIcon } from '@/components/icons/RecommendationPodiumStarIcon';
import { cn } from '@/utils/utils';

const PODIUM_SLOTS = [
  {
    place: 2 as const,
    height: 85,
    badge: 30,
    numberSize: 'text-[1.1875rem]',
    badgeClass: 'bg-[#c5c9ce]',
  },
  {
    place: 1 as const,
    height: 120,
    badge: 35,
    numberSize: 'text-[1.375rem]',
    badgeClass: 'bg-[#f0c14b]',
  },
  {
    place: 3 as const,
    height: 68,
    badge: 24,
    numberSize: 'text-[0.9375rem]',
    badgeClass: 'bg-[#c4a574]',
  },
];

interface RecommendationWorkPodiumProps {
  items: readonly WorkConditionRank[];
}

export function RecommendationWorkPodium({
  items,
}: RecommendationWorkPodiumProps) {
  const byRank = new Map(items.map((item) => [item.rank, item]));

  return (
    <div className='flex h-[132px] w-[327px] items-end justify-center'>
      {PODIUM_SLOTS.map((slot) => {
        const item = byRank.get(slot.place);
        if (!item) return null;

        return (
          <div
            key={slot.place}
            className='relative flex w-[105px] flex-col items-center'
            style={{ height: slot.height }}
          >
            <span
              className={cn(
                'absolute top-0 z-[1] flex items-center justify-center rounded-full font-bold text-white',
                slot.numberSize,
                slot.badgeClass,
              )}
              style={{
                width: slot.badge,
                height: slot.badge,
                transform: 'translateY(-35%)',
              }}
            >
              {slot.place}
            </span>
            <div className='flex h-full w-full flex-col items-center rounded-t-[100px] rounded-b-[12px] bg-gradient-to-t from-white to-[#dae6ff] pt-[1.375rem]'>
              <p className='typo-b2-sb text-gray9'>{item.label}</p>
              {slot.place === 1 && (
                <RecommendationPodiumStarIcon className='mt-[0.25rem]' />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
