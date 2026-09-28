import type { MapLevel } from '@/features/experience/map/utils/mapLayout';

/** 25~49%: 그룹·활동, 50~99%: 3단계 필드, 100~200%: 전체 블록. */
export type MapDetailLevel = 'minimized' | 'medium' | 'standard';

export const MAP_MIN_ZOOM = 0.25;
export const MAP_MAX_ZOOM = 2;

/** 표시 배율 100%에 대응하는 실제 캔버스 배율 */
export const FOCUS_ZOOM = 0.7;

/** 맵 뷰 진입 기본값 */
export const DEFAULT_DETAIL: MapDetailLevel = 'minimized';

/** 50% 이하의 기존 크기를 유지하고, 표준 수준의 시작 크기만 줄인다. */
export function zoomForPercent(percent: number): number {
  if (percent <= 50) return percent / 100;
  if (percent <= 100)
    return 0.5 + ((percent - 50) / 50) * (FOCUS_ZOOM - 0.5);
  return (
    FOCUS_ZOOM + ((percent - 100) / 100) * (MAP_MAX_ZOOM - FOCUS_ZOOM)
  );
}

export function percentForZoom(zoom: number): number {
  if (zoom <= 0.5) return zoom * 100;
  if (zoom <= FOCUS_ZOOM)
    return 50 + ((zoom - 0.5) / (FOCUS_ZOOM - 0.5)) * 50;
  return (
    100 + ((zoom - FOCUS_ZOOM) / (MAP_MAX_ZOOM - FOCUS_ZOOM)) * 100
  );
}

export function detailForZoom(zoom: number): MapDetailLevel {
  if (zoom >= FOCUS_ZOOM) return 'standard';
  if (zoom >= 0.5) return 'medium';
  return 'minimized';
}

export function maxVisibleLevel(detail: MapDetailLevel): MapLevel {
  if (detail === 'minimized') return 2;
  if (detail === 'medium') return 3;
  return 5;
}
