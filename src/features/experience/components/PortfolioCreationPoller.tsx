'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolioCreationStore } from '@/store/usePortfolioCreationStore';
import { usePortfolioControllerGetPortfolio } from '@/api/endpoints/portfolio/portfolio';

const POLL_INTERVAL_MS = 2000;

/**
 * 포트폴리오 생성 대기 중이면 주기적으로 조회하고, 완료 시 해당 experience의 portfolio 페이지로 이동합니다.
 * createloading을 떠나 다른 페이지로 이동해도 생성 완료 시 portfolio로 리다이렉트됩니다.
 */
export function PortfolioCreationPoller() {
  const router = useRouter();
  const pending = usePortfolioCreationStore((s) => s.pending);
  const clearPending = usePortfolioCreationStore((s) => s.clearPending);
  const didRedirectRef = useRef(false);

  const { data, isSuccess } = usePortfolioControllerGetPortfolio(
    pending?.portfolioId ?? 0,
    {
      query: {
        enabled: !!pending?.portfolioId,
        refetchInterval: POLL_INTERVAL_MS,
        refetchIntervalInBackground: true,
        retry: true,
      },
    },
  );

  const setResolved = usePortfolioCreationStore((s) => s.setResolved);

  useEffect(() => {
    if (!pending || !isSuccess || !data?.result || didRedirectRef.current)
      return;
    didRedirectRef.current = true;
    setResolved(pending.experienceId, pending.portfolioId);
    clearPending();
    router.replace(
      `/experience/settings/${pending.experienceId}/portfolio?portfolioId=${pending.portfolioId}`,
    );
  }, [pending, isSuccess, data?.result, setResolved, clearPending, router]);

  useEffect(() => {
    if (!pending) didRedirectRef.current = false;
  }, [pending]);

  return null;
}
