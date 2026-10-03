'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Google Analytics 페이지 뷰 이벤트 전송
export function GoogleAnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', 'page_view', {
      page_path: pathname,
      // OAuth 콜백의 link_token 등 URL 쿼리를 분석 이벤트에 남기지 않는다.
      page_location: `${window.location.origin}${pathname}`,
      page_title: typeof document !== 'undefined' ? document.title : '',
    });
  }, [pathname]);

  return null;
}
