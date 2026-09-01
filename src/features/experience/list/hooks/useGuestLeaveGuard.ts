'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 비로그인 이탈 방지 (화면설계서 0-2).
 *
 * 편집 내용이 클라이언트에만 있으므로 페이지를 벗어나려 할 때 모달로 한 번 확인한다.
 *
 * - 앱 안의 링크 클릭: 캡처 단계에서 가로채 모달을 띄우고, '나가기'를 고르면 그대로 이동한다.
 * - 새로고침 · 탭 닫기: 브라우저 기본 확인창(beforeunload)으로 대신한다.
 *   (브라우저가 커스텀 모달을 허용하지 않는다)
 */
export function useGuestLeaveGuard(enabled: boolean) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pendingHrefRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const onClickCapture = (event: MouseEvent) => {
      // 새 탭/다운로드 등 브라우저에 맡겨야 하는 클릭은 건드리지 않는다.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // 같은 페이지 안에서의 이동(뷰 전환 등)은 이탈이 아니다.
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      pendingHrefRef.current = `${url.pathname}${url.search}`;
      setOpen(true);
    };

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    document.addEventListener('click', onClickCapture, true);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [enabled]);

  /** '나가기' — 원래 가려던 곳으로 그대로 이동한다. */
  const leave = useCallback(() => {
    const href = pendingHrefRef.current;
    pendingHrefRef.current = null;
    setOpen(false);
    if (href) router.push(href);
  }, [router]);

  const cancel = useCallback(() => {
    pendingHrefRef.current = null;
    setOpen(false);
  }, []);

  return { open, leave, cancel, setOpen };
}
