'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { WORKSPACE_ACTIVITY_PARAM } from '@/features/experience/workspace/model/workspaceView';

/** 맵 조회 후 카카오톡에서 전달된 활동 ID를 한 번만 적용한다. */
export function useExperienceAgentDeepLink(
  isLoading: boolean,
  onOpen?: (blockId: string) => void,
) {
  const blockId = useSearchParams().get(WORKSPACE_ACTIVITY_PARAM);
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (state) => state.sessionRestoreAttempted,
  );
  const experiences = useExperienceListStore((state) => state.experiences);
  const selectExperience = useExperienceListStore(
    (state) => state.selectExperience,
  );
  const handledId = useRef<string | null>(null);

  useEffect(() => {
    if (!blockId || !sessionRestoreAttempted || accessToken) return;
    const returnTo = `${window.location.pathname}${window.location.search}`;
    router.replace(`/login?redirect_to=${encodeURIComponent(returnTo)}`);
  }, [accessToken, blockId, router, sessionRestoreAttempted]);

  useEffect(() => {
    if (!blockId || !accessToken || isLoading || handledId.current === blockId)
      return;
    if (!experiences.some((experience) => experience.id === blockId)) return;

    handledId.current = blockId;
    selectExperience(blockId);
    onOpen?.(blockId);
  }, [accessToken, blockId, experiences, isLoading, onOpen, selectExperience]);
}
