/**
 * API hopeJob enum 값과 한글 라벨 매핑
 * (NONE, PLANNING, MARKETING, DESIGN, DEV, MEDIA, DATA)
 */
export const HOPE_JOB_LABEL: Record<string, string> = {
  NONE: '미정',
  PLANNING: '기획',
  MARKETING: '광고/마케팅',
  DESIGN: '디자인',
  DEV: 'IT 개발',
  MEDIA: '영상/미디어',
  DATA: '데이터',
} as const;

/** API hopeJob enum → 한글 라벨 (null/undefined 시 '미정') */
export function getHopeJobLabel(
  value: string | null | undefined
): string {
  if (value == null || value === '') return '미정';
  return HOPE_JOB_LABEL[value] ?? '미정';
}

/** 폼/드롭다운용 옵션 (라벨만 사용, value는 라벨과 동일) */
export const HOPE_JOB_OPTIONS = [
  { label: '미정' },
  { label: '기획' },
  { label: '광고/마케팅' },
  { label: '디자인' },
  { label: 'IT 개발' },
  { label: '영상/미디어' },
  { label: '데이터' },
] as const;

/** 한글 라벨 → API hopeJob enum (폼 제출 시 사용) */
export const LABEL_TO_HOPE_JOB: Record<string, string> = {
  미정: 'NONE',
  기획: 'PLANNING',
  '광고/마케팅': 'MARKETING',
  디자인: 'DESIGN',
  'IT 개발': 'DEV',
  '영상/미디어': 'MEDIA',
  데이터: 'DATA',
};
