'use client';

/**
 * 맵 뷰 진입점.
 *
 * 현재는 자리표시자다. 이후 @xyflow/react 기반 캔버스가 이 자리에 들어간다.
 * 이 모듈은 next/dynamic(ssr: false)으로만 로드되므로,
 * 여기에 추가되는 브라우저 전용 의존성은 리스트 뷰 번들에 포함되지 않는다.
 */
export function ExperienceMapView() {
  return (
    <div className='flex min-h-0 flex-1 flex-col items-center justify-center'>
      <p className='typo-b2 text-gray6 text-center'>맵 뷰는 준비 중이에요.</p>
    </div>
  );
}

export default ExperienceMapView;
