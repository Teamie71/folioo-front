'use client';

import { useViewport } from '@xyflow/react';
import { ACTIVITY_AREA_RADIUS } from '@/features/experience/map/constants';
import type { MapLayoutArea } from '@/features/experience/map/utils/mapLayout';

/**
 * 활동 서브트리를 감싸는 배경(#F6F5FF66).
 *
 * xyflow의 Background와 동일하게 z-index -1 컨테이너로 그려서
 * 연결선(viewport, z-index 2)과 블록보다 항상 아래에 깔리게 한다.
 */
export function MapActivityAreas({ areas }: { areas: MapLayoutArea[] }) {
  const { x, y, zoom } = useViewport();

  return (
    <div className='react-flow__container' style={{ zIndex: -1 }}>
      <div
        className='pointer-events-none absolute top-0 left-0'
        style={{
          transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {areas.map((area) => (
          <div
            key={area.id}
            className='absolute'
            style={{
              left: area.x,
              top: area.y,
              width: area.width,
              height: area.height,
              borderRadius: ACTIVITY_AREA_RADIUS,
              backgroundColor: '#F6F5FF66',
            }}
          />
        ))}
      </div>
    </div>
  );
}
