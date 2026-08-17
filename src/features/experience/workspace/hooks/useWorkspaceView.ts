'use client';

import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  DEFAULT_WORKSPACE_VIEW,
  WORKSPACE_VIEW_PARAM,
  parseWorkspaceView,
  type WorkspaceView,
} from '@/features/experience/workspace/model/workspaceView';

type HistoryMode = 'replace' | 'push';

/**
 * URL의 ?view= 가 뷰 상태의 원본(single source of truth)이다.
 *
 * 전환에는 Router 탐색 대신 History API를 사용한다.
 * Next.js가 pushState/replaceState를 Router와 연동하므로
 * useSearchParams()는 갱신되지만 RSC 왕복도, 페이지 교체도 발생하지 않는다.
 */
export function useWorkspaceView() {
  const searchParams = useSearchParams();
  const rawView = searchParams.get(WORKSPACE_VIEW_PARAM);
  const view = parseWorkspaceView(rawView);

  const setView = useCallback(
    (next: WorkspaceView, history: HistoryMode = 'replace') => {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      if (params.get(WORKSPACE_VIEW_PARAM) === next) return;

      params.set(WORKSPACE_VIEW_PARAM, next);
      const url = `${window.location.pathname}?${params.toString()}`;

      if (history === 'push') {
        window.history.pushState(null, '', url);
      } else {
        window.history.replaceState(null, '', url);
      }
    },
    [],
  );

  // view 파라미터가 없거나 잘못된 값이면 URL을 정규화한다.
  useEffect(() => {
    if (rawView === view) return;
    setView(rawView == null ? DEFAULT_WORKSPACE_VIEW : view);
  }, [rawView, view, setView]);

  return { view, setView };
}
