'use client';

import type { ReactNode } from 'react';
import {
  useRecommendationStepGuard,
  type RecommendationTestStep,
} from '@/features/recommendation/hooks/useRecommendationStepGuard';

export function RecommendationStepGate({
  step,
  children,
}: {
  step: RecommendationTestStep;
  children: ReactNode;
}) {
  const allowed = useRecommendationStepGuard(step);

  if (!allowed) {
    return <div className='min-h-[100dvh] bg-white' />;
  }

  return <>{children}</>;
}
