'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MobileNavbar from '@/components/MobileNavbar';
import Sidebar from '@/components/Sidebar';
import { OBTBannerMobile } from '@/components/OBT/OBTBannerMobile';
import { BannerBeta } from '@/components/OBT/OBTBanner';
import { cn } from '@/utils/utils';

function isCorrectionNewPath(pathname: string) {
  return /^\/correction\/new\/?$/.test(pathname);
}
function isExperiencePath(pathname: string) {
  return pathname === '/experience' || pathname.startsWith('/experience/');
}
export default function LayoutContent({
  children,
  isMobileDevice,
}: {
  children: React.ReactNode;
  isMobileDevice: boolean;
}) {
  const pathname = usePathname();

  const path = pathname ?? '';
  const isMobileExperienceList =
    isMobileDevice &&
    (path === '/experience' ||
      path === '/experience/list' ||
      path === '/experience/workspace');
  const showMobileChrome = isMobileDevice;
  const isMobileProfile = isMobileDevice && path === '/profile';
  const hideNavbar =
    isCorrectionNewPath(path) ||
    (isExperiencePath(path) && !isMobileExperienceList);
  const showDesktopSidebar = !showMobileChrome && path !== '/';

  // 확장 프로그램이 주입하는 재생속도 오버레이 숨김
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const hideInRoot = (root: Document | Element) => {
      const selectors = [
        '#vsc-controller',
        '#controller',
        '[id*="vsc-controller"]',
        '[id^="vsc"]',
        '[class*="vsc-controller"]',
        '[class^="vsc-controller"]',
      ];
      selectors.forEach((sel) => {
        try {
          root.querySelectorAll(sel).forEach((el) => {
            if (el instanceof HTMLElement)
              el.style.setProperty('display', 'none', 'important');
          });
        } catch {
          // ignore
        }
      });

      const check = (el: HTMLElement) => {
        const text = (el.textContent ?? '').trim();
        if (!/^\d\.\d+x?$/.test(text) && text !== '1.00') return;
        const style = window.getComputedStyle(el);
        if (style.position !== 'fixed') return;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (w > 0 && w < 200 && h > 0 && h < 80)
          el.style.setProperty('display', 'none', 'important');
      };
      const children =
        root === document ? document.body.children : (root as Element).children;
      Array.from(children).forEach((node) => {
        if (node instanceof HTMLElement) check(node);
      });
    };

    const hide = () => hideInRoot(document);

    const isSpeedOverlay = (el: HTMLElement) => {
      const text = (el.textContent ?? '').trim();
      if (!/^\d\.\d+x?$/.test(text) && text !== '1.00') return false;
      const style = window.getComputedStyle(el);
      if (style.position !== 'fixed') return false;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      return w < 200 && h < 80;
    };

    const hideAdded = (nodes: NodeList | Node[]) => {
      Array.from(nodes).forEach((node) => {
        if (node instanceof HTMLElement) {
          if (isSpeedOverlay(node))
            node.style.setProperty('display', 'none', 'important');
          node.querySelectorAll('*').forEach((child) => {
            if (child instanceof HTMLElement && isSpeedOverlay(child))
              child.style.setProperty('display', 'none', 'important');
          });
        }
      });
    };

    hide();
    const interval = window.setInterval(hide, 400);
    const timeout = window.setTimeout(
      () => window.clearInterval(interval),
      5000,
    );

    const observer = new MutationObserver((mutations) => {
      hide();
      mutations.forEach((m) => {
        if (m.addedNodes.length) hideAdded(m.addedNodes);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  const [isOBTBannerVisible, setIsOBTBannerVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDismissed = sessionStorage.getItem('obt_banner_mobile_dismissed');
    if (!isDismissed) setIsOBTBannerVisible(true);
  }, [path]);

  const handleDismissBanner = () => {
    setIsOBTBannerVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('obt_banner_mobile_dismissed', 'true');
    }
  };

  return (
    <>
      {showDesktopSidebar ? (
        <div className='flex min-h-[100dvh] w-full'>
          <Sidebar />
          <div className='min-w-0 flex-1'>{children}</div>
        </div>
      ) : (
        <>
          {!hideNavbar && (
            <>
              {showMobileChrome ? (
                <>
                  <MobileNavbar />
                  {isOBTBannerVisible && !isMobileProfile && (
                    <OBTBannerMobile onDismiss={handleDismissBanner} />
                  )}
                </>
              ) : (
                <>
                  <Navbar />
                  <BannerBeta />
                </>
              )}
            </>
          )}
          <div
            className={cn(
              !hideNavbar && !isMobileProfile && 'layout-content-below-header',
              !hideNavbar &&
                (showMobileChrome
                  ? isMobileProfile
                    ? 'pt-14'
                    : isOBTBannerVisible
                      ? 'pt-[102px]'
                      : 'pt-[52px]'
                  : 'pt-[140px]'),
            )}
          >
            {children}
          </div>
        </>
      )}
    </>
  );
}
