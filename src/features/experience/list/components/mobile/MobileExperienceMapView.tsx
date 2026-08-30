'use client';

import dynamic from 'next/dynamic';
import { MapViewSkeleton } from '@/features/experience/workspace/views/MapViewSkeleton';

/**
 * 모바일 상세 화면에서 '맵 뷰' 토글 시 렌더되는 전체 맵.
 *
 * 데스크톱 워크스페이스와 동일한 import 경로를 써서 @xyflow/react 번들 chunk를 공유한다.
 */
const ExperienceMapView = dynamic(
  () =>
    import('@/features/experience/workspace/views/ExperienceMapView').then(
      (m) => m.ExperienceMapView,
    ),
  {
    ssr: false,
    loading: () => <MapViewSkeleton />,
  },
);

type Props = {
  /** 진입 시 화면 중앙에 두고 확대할 활동 id. */
  focusExperienceId: string;
};

export function MobileExperienceMapView({ focusExperienceId }: Props) {
  return (
    <div className='relative flex min-h-0 w-full flex-1 flex-col'>
      <ExperienceMapView focusExperienceId={focusExperienceId} />
    </div>
  );
}
