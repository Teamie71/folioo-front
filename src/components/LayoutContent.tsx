'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import MobileNavbar from '@/components/MobileNavbar';
import Sidebar from '@/components/Sidebar';
import { OBTBannerMobile } from '@/components/OBT/OBTBannerMobile';
import { BannerBeta } from '@/components/OBT/OBTBanner';
import { OBTEventModal } from '@/components/OBT/OBTEventModal';
import { OBTEventModalMobile } from '@/components/OBT/OBTEventModalMobile';
import { markWeeklyVoucherGranted } from '@/utils/weeklyVoucher';
import { CorrectionNavbarContext } from '@/contexts/CorrectionNavbarContext';
import { useEventControllerClaimEventReward } from '@/api/endpoints/event/event';
import { cn } from '@/utils/utils';

/** 회원가입 직후 / 주간 이용권 지급 이벤트 코드 (백엔드와 동일해야 함) */
const WEEKLY_VOUCHER_EVENT_CODE = 'weekly-voucher';
/** terms에서 약관 동의 후 가입 시 세션에 세팅되는 키 (랜딩에서 모달 띄운 뒤 제거) */
const TERMS_FROM_SIGNUP_KEY = 'terms_from_signup';

function isCorrectionNewPath(pathname: string) {
  return /^\/correction\/new\/?$/.test(pathname);
}
function isCorrectionDetailPath(pathname: string) {
  return (
    /^\/correction\/[^/]+$/.test(pathname) && !isCorrectionNewPath(pathname)
  );
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
  const router = useRouter();
  const [showNavbarOnResult, setShowNavbarOnResult] = useState(false);
  const [weeklyVoucherModalOpen, setWeeklyVoucherModalOpen] = useState(false);
  const claimAttemptedRef = useRef(false);

  const { mutateAsync: claimEventReward } =
    useEventControllerClaimEventReward();

  const path = pathname ?? '';
  const isCorrectionDetail = isCorrectionDetailPath(path);
  const isMobileExperienceList =
    isMobileDevice &&
    (path === '/experience' ||
      path === '/experience/list' ||
      path === '/experience/workspace');
  const showMobileChrome = isMobileDevice;
  const hideNavbar =
    isCorrectionNewPath(path) ||
    (isCorrectionDetail && !showNavbarOnResult) ||
    (isExperiencePath(path) && !isMobileExperienceList);
  const showDesktopSidebar =
    !showMobileChrome && path !== '/' && !isCorrectionDetail;

  useEffect(() => {
    if (!isCorrectionDetailPath(path)) setShowNavbarOnResult(false);
  }, [path]);

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

    setWeeklyVoucherModalOpen(false);
    const isDismissed = sessionStorage.getItem('obt_banner_mobile_dismissed');
    if (!isDismissed) setIsOBTBannerVisible(true);

    const fromSignup = sessionStorage.getItem(TERMS_FROM_SIGNUP_KEY);
    if (fromSignup) {
      sessionStorage.removeItem(TERMS_FROM_SIGNUP_KEY);
      if (path === '/') {
        setWeeklyVoucherModalOpen(true);
      }
    }
  }, [path]);

  const handleDismissBanner = () => {
    setIsOBTBannerVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('obt_banner_mobile_dismissed', 'true');
    }
  };

  // 회원가입 직후 첫 번째 모달이 열릴 때 보상 수령 API 호출
  useEffect(() => {
    if (!weeklyVoucherModalOpen) {
      claimAttemptedRef.current = false;
      return;
    }
    if (claimAttemptedRef.current) return;
    claimAttemptedRef.current = true;
    claimEventReward({ eventCode: WEEKLY_VOUCHER_EVENT_CODE })
      .then(() => {
        markWeeklyVoucherGranted();
      })
      .catch(() => {
        claimAttemptedRef.current = false;
      });
  }, [weeklyVoucherModalOpen, claimEventReward]);

  return (
    <CorrectionNavbarContext.Provider
      value={{
        setShowNavbarOnResult: useCallback(
          (show: boolean) => setShowNavbarOnResult(show),
          [],
        ),
      }}
    >
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
                  {isOBTBannerVisible && (
                    <OBTBannerMobile onDismiss={handleDismissBanner} />
                  )}
                </>
              ) : (
                <>
                  <Navbar wide={isCorrectionDetail && showNavbarOnResult} />
                  <BannerBeta />
                </>
              )}
            </>
          )}
          <div
            className={cn(
              hideNavbar ? '' : 'layout-content-below-header',
              !hideNavbar &&
                (showMobileChrome
                  ? isOBTBannerVisible
                    ? 'pt-[102px]'
                    : 'pt-[52px]'
                  : 'pt-[140px]'),
            )}
          >
            {children}
          </div>
        </>
      )}

      {/* 주간 이용권 지급 */}
      {isMobileDevice ? (
        <OBTEventModalMobile
          open={weeklyVoucherModalOpen}
          onOpenChange={setWeeklyVoucherModalOpen}
          eventTitle='이번 주의 무료 이용권'
          eventSubTitle='보상 지급 완료'
          reward='경험 정리 2회권 + 포트폴리오 첨삭 6회권'
          rewardMessage='{reward}이 지급되었어요.'
          subMessage='Folioo와 함께 경험을 강력한 서류로 만들어보세요.'
          validityMessage='지급된 이용권은 일요일까지 사용 가능해요.'
          buttonText='경험 정리하기'
          onButtonClick={() => router.push('/experience/settings')}
        />
      ) : (
        <OBTEventModal
          open={weeklyVoucherModalOpen}
          onOpenChange={setWeeklyVoucherModalOpen}
          eventTitle='이번 주의 무료 이용권'
          eventSubTitle='보상 지급 완료'
          reward='경험 정리 2회권 + 포트폴리오 첨삭 6회권'
          rewardMessage='{reward}이 지급되었어요.'
          subMessage='Folioo와 함께 경험을 강력한 서류로 만들어보세요.'
          validityMessage='지급된 이용권은 일요일까지 사용 가능해요.'
          buttonText='경험 정리하기'
          onButtonClick={() => router.push('/experience/settings')}
        />
      )}
    </CorrectionNavbarContext.Provider>
  );
}
