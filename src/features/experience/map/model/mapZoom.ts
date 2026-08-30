import type { MapLevel } from '@/features/experience/map/utils/mapLayout';

/**
 * 표시 수준.
 *
 * 화면설계서 기준 표시 블록:
 * - 최소화 수준: 1,2단계
 * - 중간 수준  : 1,2,3단계
 * - 표준 수준  : 모든 블록 (최대화 300%까지 확대만 가능)
 *
 * 수준은 배율의 절대값이 아니라 "단계"로 관리한다.
 * 표시 단계가 줄면 트리 자체가 작아져 배율도 함께 달라지기 때문에,
 * 배율 임계값으로 수준을 유도하면 (수준 변경 → 레이아웃 축소 → 배율 재계산 → 수준 변경)
 * 왕복이 생겨 진입 시 화면이 매번 달라진다.
 */
export type MapDetailLevel = 'minimized' | 'medium' | 'standard';

const DETAIL_ORDER: MapDetailLevel[] = ['minimized', 'medium', 'standard'];

/** 한 표시 수준 안에서 자유롭게 확대/축소할 수 있는 범위 */
export const DETAIL_ZOOM_MIN = 0.5;
export const DETAIL_ZOOM_MAX = 2;

/** 표시 수준을 전환한 직후 맞추는 배율 */
export const DETAIL_RESET_ZOOM = 1;

/** 최소화 수준에서의 전체 조망 하한 */
export const MAP_MIN_ZOOM = 0.1;

/** 최대화 수준 (300%) */
export const MAP_MAX_ZOOM = 3;

/** 블록 클릭으로 표준 수준까지 확대할 때 맞추는 배율 */
export const FOCUS_ZOOM = DETAIL_RESET_ZOOM;

/** 맵 뷰 진입 기본값 */
export const DEFAULT_DETAIL: MapDetailLevel = 'minimized';

/**
 * 표시 수준을 한 단계 옮긴다.
 * direction 1은 더 자세히(하위 단계 표시), -1은 더 간략히.
 * 더 이상 옮길 수 없으면 null을 반환한다.
 */
export function stepDetail(
  detail: MapDetailLevel,
  direction: 1 | -1,
): MapDetailLevel | null {
  const index = DETAIL_ORDER.indexOf(detail);
  const next = index + direction;
  if (next < 0 || next >= DETAIL_ORDER.length) return null;
  return DETAIL_ORDER[next];
}

export function maxVisibleLevel(detail: MapDetailLevel): MapLevel {
  if (detail === 'minimized') return 2;
  if (detail === 'medium') return 3;
  return 5;
}
