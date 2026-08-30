'use client';

import { useEffect } from 'react';
import { preloadExperienceMapView } from '@/features/experience/workspace/model/mapViewLoader';

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void) => number;
  cancelIdleCallback?: (id: number) => void;
};

const FALLBACK_DELAY_MS = 1500;

/**
 * 리스트 뷰에 머무는 동안 idle 시점에 맵 번들을 미리 받아둔다.
 * 토글을 눌렀을 때 네트워크 대기가 생기지 않게 하는 것이 목적이다.
 */
export function usePreloadMapView(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const w = window as IdleWindow;

    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(() => preloadExperienceMapView());
      return () => w.cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(
      preloadExperienceMapView,
      FALLBACK_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [enabled]);
}
