'use client';

import { Suspense, type ReactNode } from 'react';
import { useRecommendationEntryRedirect } from '@/features/recommendation/hooks/useRecommendationEntryRedirect';

function RecommendationEntryGateInner({ children }: { children: ReactNode }) {
  const { isCheckingEntry } = useRecommendationEntryRedirect();

  if (isCheckingEntry) {
    return <div className='min-h-[100dvh] bg-white' />;
  }

  return <>{children}</>;
}

/** 로그인 사용자의 저장 결과 유무에 따라 메인/결과로 분기한다. */
export function RecommendationEntryGate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className='min-h-[100dvh] bg-white' />}>
      <RecommendationEntryGateInner>{children}</RecommendationEntryGateInner>
    </Suspense>
  );
}
