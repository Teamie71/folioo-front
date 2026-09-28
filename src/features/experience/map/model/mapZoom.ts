import type { MapLevel } from '@/features/experience/map/utils/mapLayout';

/** 25~49%: 그룹·활동, 50~99%: 3단계 필드, 100~200%: 전체 블록. */
export type MapDetailLevel = 'minimized' | 'medium' | 'standard';

export const MAP_MIN_ZOOM = 0.25;
export const MAP_MAX_ZOOM = 2;

/** 블록 클릭으로 표준 수준까지 확대할 때 맞추는 배율 */
export const FOCUS_ZOOM = 1;

/** 맵 뷰 진입 기본값 */
export const DEFAULT_DETAIL: MapDetailLevel = 'minimized';

export function detailForZoom(zoom: number): MapDetailLevel {
  if (zoom >= 1) return 'standard';
  if (zoom >= 0.5) return 'medium';
  return 'minimized';
}

export function maxVisibleLevel(detail: MapDetailLevel): MapLevel {
  if (detail === 'minimized') return 2;
  if (detail === 'medium') return 3;
  return 5;
}
