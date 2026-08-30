'use client';

import { ExperienceMapCanvas } from '@/features/experience/map/components/ExperienceMapCanvas';

/**
 * 맵 뷰 진입점.
 *
 * 이 모듈은 next/dynamic(ssr: false)으로만 로드되므로,
 * 여기에 추가되는 브라우저 전용 의존성(@xyflow/react)은 리스트 뷰 번들에 포함되지 않는다.
 */
export function ExperienceMapView() {
  return (
    <div className='relative min-h-0 flex-1'>
      <ExperienceMapCanvas />
    </div>
  );
}

export default ExperienceMapView;
