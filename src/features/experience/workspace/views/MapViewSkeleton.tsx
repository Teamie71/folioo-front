'use client';

/** 맵 번들이 아직 도착하지 않았을 때만 잠깐 보이는 가벼운 자리표시자. */
export function MapViewSkeleton() {
  return (
    <div className='flex min-h-0 flex-1 flex-col items-center justify-center'>
      <div className='bg-gray3 h-[8px] w-[120px] animate-pulse rounded-full' />
    </div>
  );
}

export default MapViewSkeleton;
