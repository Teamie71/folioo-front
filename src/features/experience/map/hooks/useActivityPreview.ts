'use client';

import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * 활동 미리보기 모달 (6-1)의 대상 활동 id를 URL에 싣는다.
 *
 * "인스타그램 검색처럼 좌우 버튼만으로 빠르게 넘겨보는" 동작을 위해
 * 컴포넌트 로컬 state가 아니라 URL을 원본으로 둔다 — 딥링크가 가능해지고,
 * useWorkspaceView와 같은 history.replaceState 패턴이라 페이지 이동 없이 갱신된다.
 */
const ACTIVITY_PREVIEW_PARAM = 'preview';

export function useActivityPreview() {
  const searchParams = useSearchParams();
  const previewId = searchParams.get(ACTIVITY_PREVIEW_PARAM);

  const setPreviewId = useCallback((id: string | null) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (id) params.set(ACTIVITY_PREVIEW_PARAM, id);
    else params.delete(ACTIVITY_PREVIEW_PARAM);
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState(null, '', url);
  }, []);

  return {
    previewId,
    open: (id: string) => setPreviewId(id),
    close: () => setPreviewId(null),
  };
}
