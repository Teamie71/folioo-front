import type { WorkConditionRank } from '@/features/recommendation/types';
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
              {slot.place === 1 && <PodiumStar />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PodiumStar() {
  return (
    <svg
      className='mt-[0.25rem]'
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      aria-hidden
    >
      <path
        d='M16 4.5L18.94 12.16L27.2 12.64L20.9 17.74L22.94 25.86L16 21.5L9.06 25.86L11.1 17.74L4.8 12.64L13.06 12.16L16 4.5Z'
        fill='#93B3F4'
      />
    </svg>
  );
}
