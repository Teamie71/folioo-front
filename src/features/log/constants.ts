/* 활동 태그 목록 조회/무효화용 React Query 키 */
export const ACTIVITY_TAGS_QUERY_KEY = ['insight', 'activityTags'] as const;

/* 로그 목록 조회/무효화용 React Query 키 */
export const INSIGHTS_QUERY_KEY = ['insight', 'insights'] as const;

/* 페이지 카테고리 id → API category 값 (Orval InsightLogResDTOCategory) */
export const LOG_CATEGORY_ID_TO_API: Record<string, string> = {
  interperson: '대인관계',
  'problem-solve': '문제해결',
  learning: '학습',
  reference: '레퍼런스',
  etc: '기타',
};
