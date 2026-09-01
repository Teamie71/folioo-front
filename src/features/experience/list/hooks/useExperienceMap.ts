'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExperienceMapControllerGetMapQueryKey } from '@/api/endpoints/experience-map/experience-map';
import { useTemplateControllerGetTemplates } from '@/api/endpoints/template/template';
import { setTemplateCatalog } from '@/features/experience/list/api/templateCatalog';
import {
  loadExperienceMap,
  resetExperienceMapSync,
  setExperienceMapGuestMode,
  syncImportGuestDraft,
} from '@/features/experience/list/api/experienceMapSync';
import { createGuestSeed } from '@/features/experience/list/api/guestSeed';
import {
  clearGuestDraft,
  readGuestDraft,
} from '@/features/experience/list/api/guestDraft';
import { useAuthStore } from '@/store/useAuthStore';
import { useExperienceListStore } from '@/store/useExperienceListStore';

/**
 * 경험 정리 진입 시 데이터를 한 번 채운다.
 *
 * 로그인 상태
 * - GET /templates     : 블록 템플릿 카탈로그 (드롭다운 라벨·placeholder의 원본)
 * - GET /experience-map: 그룹·활동·블록 트리. 최초 조회 때 서버가 미분류 루트와 트리 버전을 만든다.
 *
 * 블록을 그리기 전에 카탈로그가 준비돼 있어야 문구가 기본값으로 잠깐 보였다가
 * 바뀌는 일이 없으므로, 카탈로그 조회가 끝난 뒤에 맵을 읽는다.
 * 이후의 쓰기와 재조회는 동기화 계층(experienceMapSync)이 직렬로 처리한다.
 *
 * 비로그인 상태 (화면설계서 "페이지 권한")
 * - 조회·편집 권한은 같지만 수정 사항이 서버에 저장되지 않는다.
 *   맵을 읽지 않고 기본 제공 데이터로 채운 뒤, 쓰기는 게스트 모드로 막는다.
 */
export function useExperienceMap() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const isGuest = sessionRestoreAttempted && accessToken == null;

  const syncError = useExperienceListStore((s) => s.syncError);
  const isContentLoading = useExperienceListStore((s) => s.isContentLoading);
  const setContentLoading = useExperienceListStore((s) => s.setContentLoading);
  const hydrateFromServer = useExperienceListStore((s) => s.hydrateFromServer);

  useEffect(() => {
    resetExperienceMapSync();
  }, []);

  useEffect(() => {
    setExperienceMapGuestMode(isGuest);
  }, [isGuest]);

  const templates = useTemplateControllerGetTemplates({
    query: {
      // 카탈로그도 로그인해야 읽을 수 있다. 비로그인은 기본 문구를 쓴다.
      enabled: !isGuest && sessionRestoreAttempted,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  });

  useEffect(() => {
    setTemplateCatalog(templates.data?.result);
  }, [templates.data]);

  const { error } = useQuery({
    queryKey: getExperienceMapControllerGetMapQueryKey(),
    queryFn: () => loadExperienceMap(),
    // 세션 복원이 끝나고, 카탈로그 조회가 끝난(성공/실패 무관) 뒤에 트리를 읽는다.
    enabled: sessionRestoreAttempted && !isGuest && !templates.isPending,
    // 스토어가 원본이라 캐시를 다시 읽어 화면을 덮어쓸 필요가 없다.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 비로그인은 서버 대신 기본 제공 데이터로 채운다. (한 번만)
  const seeded = useExperienceListStore((s) => s.groups.length > 0);
  useEffect(() => {
    if (!isGuest || seeded) return;
    hydrateFromServer(createGuestSeed());
  }, [isGuest, seeded, hydrateFromServer]);

  /*
   * 비로그인으로 편집하다 로그인하고 돌아왔으면 그 내용을 서버에 옮긴다.
   * (화면설계서: "로그인 이후 본 페이지로 돌아왔을 때 이전의 편집 내용이 모두 저장된다")
   * 맵을 한 번 읽어 서버 상태를 확보한 뒤에 시작한다.
   */
  const mapLoaded = !isContentLoading;
  useEffect(() => {
    if (isGuest || !mapLoaded) return;
    const draft = readGuestDraft();
    if (!draft) return;
    // 한 번만 시도한다. 실패해도 다시 시도하지 않는다. (중복 생성 방지)
    clearGuestDraft();
    syncImportGuestDraft(draft);
  }, [isGuest, mapLoaded]);

  // 조회에 실패하면 스켈레톤에 머무르지 않고 빈 상태를 보여준다.
  // 화면에는 빈 상태와 구분이 안 되므로 실패 사실은 콘솔에 남긴다.
  useEffect(() => {
    if (!error) return;
    console.error('[experience-map] 맵 조회 실패', error);
    setContentLoading(false);
  }, [error, setContentLoading]);

  useEffect(() => {
    if (!templates.error) return;
    console.error(
      '[experience-map] 템플릿 카탈로그 조회 실패',
      templates.error,
    );
  }, [templates.error]);

  return { isGuest, isLoading: isContentLoading, error: error ?? syncError };
}
