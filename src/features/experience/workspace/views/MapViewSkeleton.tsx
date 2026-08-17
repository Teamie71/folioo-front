'use client';

import Image from 'next/image';

/** MainLogo.svg 원본 viewBox 80x20 (4:1) */
const LOGO_WIDTH = 200;
const LOGO_HEIGHT = 50;

const PROGRESS_WIDTH = 293;
const PROGRESS_HEIGHT = 8;

/**
 * 맵 번들이 도착하기 전까지 보이는 로딩 화면.
 * 프로그레스바는 실제 진행률이 아니라 로딩 중임을 나타내는 indeterminate 표시다.
 */
export function MapViewSkeleton() {
  return (
    <div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-[32px]'>
      <Image
        src='/MainLogo.svg'
        alt='Folioo'
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority
      />

      <div
        role='progressbar'
        aria-label='맵 뷰를 불러오는 중'
        aria-busy='true'
        className='bg-gray3 overflow-hidden rounded-full'
        style={{ width: PROGRESS_WIDTH, height: PROGRESS_HEIGHT }}
      >
        <div className='gradient-sub2 animate-progress-fill h-full rounded-full' />
      </div>
    </div>
  );
}

export default MapViewSkeleton;
