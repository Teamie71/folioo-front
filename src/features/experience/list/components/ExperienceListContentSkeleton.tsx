'use client';

import { ExperienceListTextSkeleton } from '@/features/experience/list/components/ExperienceListTextSkeleton';

function SectionCard({
  titleChars,
  lines,
}: {
  titleChars: number;
  lines: Array<{ chars: number; indent?: boolean }>;
}) {
  return (
    <div className='flex w-full flex-col gap-[8px]'>
      <ExperienceListTextSkeleton typo='b2-sb' charLength={titleChars} />
      <div className='border-gray5 flex w-full flex-col gap-[2px] rounded-[12px] border bg-white p-[16px]'>
        {lines.map((line, i) => (
          <ExperienceListTextSkeleton
            key={i}
            typo='text-field'
            charLength={line.chars}
            className={line.indent ? 'pl-[28px]' : 'pl-[24px]'}
          />
        ))}
      </div>
    </div>
  );
}

export function ExperienceListContentSkeleton() {
  return (
    <div
      className='mx-auto flex w-full max-w-[1100px] flex-col gap-[28px]'
      role='status'
      aria-label='콘텐츠 로딩 중'
    >
      <ExperienceListTextSkeleton typo='h5' charLength={8} />

      <SectionCard
        titleChars={4}
        lines={[
          { chars: 18 },
          { chars: 65 },
          { chars: 37 },
          { chars: 45 },
          { chars: 42 },
        ]}
      />

      <SectionCard
        titleChars={4}
        lines={[
          { chars: 21 },
          { chars: 15 },
          { chars: 13 },
          { chars: 30 },
        ]}
      />

      <SectionCard
        titleChars={4}
        lines={[
          { chars: 12 },
          { chars: 30, indent: true },
          { chars: 34, indent: true },
          { chars: 30 },
          { chars: 39, indent: true },
          { chars: 36, indent: true },
        ]}
      />

      <SectionCard
        titleChars={4}
        lines={[
          { chars: 19 },
          { chars: 26, indent: true },
          { chars: 25, indent: true },
          { chars: 24, indent: true },
          { chars: 36, indent: true },
        ]}
      />

      <SectionCard
        titleChars={3}
        lines={[{ chars: 48 }, { chars: 55 }]}
      />
    </div>
  );
}
