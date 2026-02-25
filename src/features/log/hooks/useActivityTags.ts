'use client';

import { useQuery } from '@tanstack/react-query';
import type { ActivityNameResDTO } from '@/api/models';
import { getActivityTags } from '@/services/insight';
import { ACTIVITY_TAGS_QUERY_KEY } from '@/features/log/constants';
import { useAuthStore } from '@/store/useAuthStore';

/* ActivityNameResDTO(Orval) → 드롭다운용 id, label */
export type ActivityDropdownItem = {
  id: string;
  label: string;
};

function toDropdownItem(tag: ActivityNameResDTO): ActivityDropdownItem {
  return { id: String(tag.id), label: tag.name };
}

/* 활동 태그 목록 조회(Orval ActivityNameResDTO[]) + 나의 로그 영역 드롭다운용 activities */
export function useActivityTags() {
  // 세션 복원이 시도된 뒤에만 API 호출
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const { data: activityTags = [] } = useQuery<ActivityNameResDTO[]>({
    queryKey: ACTIVITY_TAGS_QUERY_KEY,
    queryFn: getActivityTags,
    enabled: sessionRestoreAttempted,
  });
  const activities = activityTags.map(toDropdownItem);
  return { activityTags, activities };
}
