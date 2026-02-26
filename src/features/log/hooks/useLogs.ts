'use client';

import { useQuery } from '@tanstack/react-query';
import { getLogs, type GetLogsParams } from '@/services/insight';
import { toLogCardDataList } from '@/features/log/utils/toLogCardData';
import {
  INSIGHTS_QUERY_KEY,
  LOG_CATEGORY_ID_TO_API,
} from '@/features/log/constants';
import { useAuthStore } from '@/store/useAuthStore';
import type { LogCardData } from '@/store/useLogStore';

/* 로그 목록 조회 필터 */
export interface UseLogsParams {
  keyword?: string;
  categoryId?: string;
  activityId?: string;
}

/* 로그 목록 조회 필터 → API 파라미터 */
function toGetLogsParams(params: UseLogsParams): GetLogsParams {
  const category =
    params.categoryId && LOG_CATEGORY_ID_TO_API[params.categoryId]
      ? LOG_CATEGORY_ID_TO_API[params.categoryId]
      : undefined;
  const n = params.activityId ? Number(params.activityId) : NaN;
  const activityId = Number.isNaN(n) ? undefined : n;
  return {
    keyword: params.keyword?.trim() || undefined,
    category,
    activityId,
  };
}

/* 로그 목록 조회 (Orval getLogs + toLogCardDataList) */
export function useLogs(params: UseLogsParams = {}) {
  // 세션 복원이 시도된 뒤에만 API 호출
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const queryParams = toGetLogsParams(params);
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      ...INSIGHTS_QUERY_KEY,
      queryParams.keyword,
      queryParams.category,
      queryParams.activityId,
    ],
    queryFn: () => getLogs(queryParams),
    enabled: sessionRestoreAttempted,
  });
  const logCards: LogCardData[] = toLogCardDataList(data);
  return { logCards, isLoading, refetch };
}
