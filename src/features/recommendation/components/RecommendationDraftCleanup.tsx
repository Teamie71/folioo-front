'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

const DRAFT_STEPS = new Set([
  '/recommendation/major',
  '/recommendation/interest',
  '/recommendation/values',
]);

let draftCleanupMountId = 0;

/**
 * 전공/흥미/가치관에서 이탈하면 진행 내용을 버린다.
 * 대기 중 create는 스냅샷으로 계속되고, 로그인 유저 결과는 uuid/status로 저장된다.
 */
export function RecommendationDraftCleanup({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const clearDraft = useRecommendationTestStore((s) => s.clearDraft);

  useEffect(() => {
    if (!pathname) return;
    if (DRAFT_STEPS.has(pathname)) return;
    if (pathname.startsWith('/recommendation/waiting')) return;
    clearDraft();
  }, [clearDraft, pathname]);

  useEffect(() => {
    const mountId = ++draftCleanupMountId;
    return () => {
      // Strict Mode 즉시 remount 시 clear를 건너뛴다.
      queueMicrotask(() => {
        if (mountId !== draftCleanupMountId) return;
        clearDraft();
      });
    };
  }, [clearDraft]);

  return <>{children}</>;
}
