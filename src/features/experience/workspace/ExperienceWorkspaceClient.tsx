'use client';

import { Suspense } from 'react';
import { ExperienceWorkspaceShell } from '@/features/experience/workspace/ExperienceWorkspaceShell';

/**
 * useSearchParams()를 쓰는 shell을 Suspense로 감싼다.
 * (prerender 단계에서 useSearchParams는 가장 가까운 Suspense 경계를 요구한다)
 */
export default function ExperienceWorkspaceClient() {
  return (
    <Suspense fallback={<WorkspaceBootFallback />}>
      <ExperienceWorkspaceShell />
    </Suspense>
  );
}

function WorkspaceBootFallback() {
  return <div className='h-[100dvh] w-full bg-white' />;
}
