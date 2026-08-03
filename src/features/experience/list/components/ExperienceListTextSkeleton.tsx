'use client';

import { cn } from '@/utils/utils';

export type TextSkeletonTypo = 'h5' | 'b2-sb' | 'text-field';

const FONT_SIZE: Record<TextSkeletonTypo, string> = {
  h5: '1.125rem',
  'b2-sb': '1rem',
  'text-field': '1rem',
};

const LINE_HEIGHT_RATIO: Record<TextSkeletonTypo, number> = {
  h5: 1.3,
  'b2-sb': 1.5,
  'text-field': 1.6,
};

type Props = {
  typo: TextSkeletonTypo;
  charLength: number;
  className?: string;
};

export function ExperienceListTextSkeleton({
  typo,
  charLength,
  className,
}: Props) {
  const fontSize = FONT_SIZE[typo];
  const lineBox = `calc(${fontSize} * ${LINE_HEIGHT_RATIO[typo]})`;
  const barHeight =
    typo === 'text-field'
      ? 20
      : `calc(${fontSize} * ${LINE_HEIGHT_RATIO[typo]} - 4px)`;
  const barWidth = `calc(${Math.max(charLength, 1)} * ${fontSize})`;

  return (
    <div
      className={cn('flex max-w-full items-center', className)}
      style={{ height: lineBox }}
      aria-hidden
    >
      <div
        className='bg-gray2 max-w-full shrink-0 rounded-[4px]'
        style={{ height: barHeight, width: barWidth }}
      />
    </div>
  );
}
