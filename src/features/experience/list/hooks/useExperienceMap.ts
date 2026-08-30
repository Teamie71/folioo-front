'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExperienceMapControllerGetMapQueryKey } from '@/api/endpoints/experience-map/experience-map';
import { useTemplateControllerGetTemplates } from '@/api/endpoints/template/template';
import { setTemplateCatalog } from '@/features/experience/list/api/templateCatalog';
import {
  loadExperienceMap,
  resetExperienceMapSync,
} from '@/features/experience/list/api/experienceMapSync';
import { useExperienceListStore } from '@/store/useExperienceListStore';

/**
 * 경험 정리 진입 시 서버 데이터를 한 번 읽어 온다.
 *
 * - GET /templates    : 블록 템플릿 카탈로그 (드롭다운 라벨·placeholder의 원본)
 * - GET /experience-map: 그룹·활동·블록 트리. 최초 조회 때 서버가 미분류 루트와 트리 버전을 만든다.
 *
 * 블록을 그리기 전에 카탈로그가 준비돼 있어야 문구가 기본값으로 잠깐 보였다가
 * 바뀌는 일이 없으므로, 카탈로그 조회가 끝난 뒤에 맵을 읽는다.
 * 이후의 쓰기와 재조회는 동기화 계층(experienceMapSync)이 직렬로 처리한다.
 */
export function useExperienceMap() {
  const syncError = useExperienceListStore((s) => s.syncError);
  const isContentLoading = useExperienceListStore((s) => s.isContentLoading);

  useEffect(() => {
    resetExperienceMapSync();
  }, []);

  const templates = useTemplateControllerGetTemplates({
    query: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 1 },
  });

  useEffect(() => {
    setTemplateCatalog(templates.data?.result);
  }, [templates.data]);

  const { error } = useQuery({
    queryKey: getExperienceMapControllerGetMapQueryKey(),
    queryFn: () => loadExperienceMap(),
    // 카탈로그 조회가 끝난(성공/실패 무관) 뒤에 트리를 읽는다.
    enabled: !templates.isPending,
    // 스토어가 원본이라 캐시를 다시 읽어 화면을 덮어쓸 필요가 없다.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const setContentLoading = useExperienceListStore((s) => s.setContentLoading);

  // 조회에 실패하면 스켈레톤에 머무르지 않고 빈 상태를 보여준다.
  useEffect(() => {
    if (error) setContentLoading(false);
  }, [error, setContentLoading]);

  return { isLoading: isContentLoading, error: error ?? syncError };
}
