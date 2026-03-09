'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolioCreationStore } from '@/store/usePortfolioCreationStore';
import { useExperienceControllerGetExperience } from '@/api/endpoints/experience/experience';
import { ExperienceStateResDTOStatus } from '@/api/models';

const POLL_INTERVAL_MS = 2000;

export function PortfolioCreationPoller() {
  const router = useRouter();
  const pending = usePortfolioCreationStore((s) => s.pending);
  const clearPending = usePortfolioCreationStore((s) => s.clearPending);
  const didRedirectRef = useRef(false);

  const experienceId =
    pending?.experienceId != null ? Number(pending.experienceId) : NaN;

  const { data, isSuccess } = useExperienceControllerGetExperience(
    experienceId,
    {
      query: {
        enabled: !!pending && Number.isFinite(experienceId),
        refetchInterval: POLL_INTERVAL_MS,
        refetchIntervalInBackground: true,
        retry: true,
      },
    },
  );

  const setResolved = usePortfolioCreationStore((s) => s.setResolved);
  const status = data?.result?.status;

  useEffect(() => {
    if (
      !pending ||
      !isSuccess ||
      status !== ExperienceStateResDTOStatus.DONE ||
      didRedirectRef.current
    )
      return;
    didRedirectRef.current = true;
    setResolved(pending.experienceId, pending.portfolioId);
    clearPending();
    router.replace(
      `/experience/settings/${pending.experienceId}/portfolio?portfolioId=${pending.portfolioId}`,
    );
  }, [pending, isSuccess, status, setResolved, clearPending, router]);

  useEffect(() => {
    if (!pending) didRedirectRef.current = false;
  }, [pending]);

  return null;
}
