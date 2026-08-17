'use client';

import { cn } from '@/utils/utils';
import { ExperienceListTextSkeleton } from '@/features/experience/list/components/ExperienceListTextSkeleton';
import { ListChevronIcon } from '@/components/icons/ListChevronIcon';

type ContentLine = {
  chars: number;
  indent?: boolean;
};

const DETAIL_CONTENT_LINES: ContentLine[] = [
  { chars: 18 },
  { chars: 18 },
  { chars: 16, indent: true },
  { chars: 17, indent: true },
  { chars: 14, indent: true },
  { chars: 18 },
  { chars: 17, indent: true },
  { chars: 2, indent: true },
  { chars: 18 },
  { chars: 16, indent: true },
  { chars: 10, indent: true },
  { chars: 18 },
  { chars: 16, indent: true },
  { chars: 8, indent: true },
];

const SECTION_META = [
  { label: '상세정보', titleChars: 4 },
  { label: '주요성과', titleChars: 4 },
  { label: '담당업무', titleChars: 4 },
  { label: '문제해결', titleChars: 4 },
  { label: '배운 점', titleChars: 3 },
] as const;

function ContentCardSkeleton({ lines }: { lines: ContentLine[] }) {
  return (
    <div className='border-gray5 flex w-full flex-col gap-[2px] rounded-[12px] border bg-white p-[16px]'>
      {lines.map((line, i) => (
        <ExperienceListTextSkeleton
          key={i}
          typo='text-field'
          charLength={line.chars}
          className={line.indent ? 'pl-[24px]' : undefined}
        />
      ))}
    </div>
  );
}

type Props = {
  variant?: 'bars' | 'labeled';
};

export function MobileExperienceContentSkeleton({ variant = 'bars' }: Props) {
  const labeled = variant === 'labeled';

  return (
    <div
      className='flex w-full flex-col gap-[8px]'
      role='status'
      aria-label='콘텐츠 로딩 중'
    >
      {SECTION_META.map((section, index) => {
        const expanded = index === 0;
        return (
          <div key={section.label} className='flex flex-col gap-[8px]'>
            <div className='bg-gray2 flex w-full items-center justify-between rounded-[8px] px-[10px] py-[8px]'>
              <div className='flex min-w-0 items-center gap-[4px]'>
                <ListChevronIcon
                  className={cn(
                    'size-[16px] shrink-0',
                    labeled ? 'text-gray5' : 'text-gray2',
                    expanded ? 'rotate-180' : 'rotate-90',
                  )}
                  aria-hidden
                />
                {labeled ? (
                  <span
                    className={cn(
                      'text-gray9 truncate',
                      expanded ? 'typo-b2-sb' : 'typo-b2',
                    )}
                  >
                    {section.label}
                  </span>
                ) : (
                  <ExperienceListTextSkeleton
                    typo='b2-sb'
                    charLength={section.titleChars}
                  />
                )}
              </div>
            </div>
            {expanded ? (
              <ContentCardSkeleton lines={DETAIL_CONTENT_LINES} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
