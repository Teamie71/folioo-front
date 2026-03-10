'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { BannerBeta } from '@/components/OBT/OBTBanner';
import { OBTEventModal } from '@/components/OBT/OBTEventModal';
import { EventModal } from '@/components/EventModal';
import { markWeeklyVoucherGranted } from '@/utils/weeklyVoucher';
import { CorrectionNavbarContext } from '@/contexts/CorrectionNavbarContext';
import { PortfolioCreationPoller } from '@/features/experience/components/PortfolioCreationPoller';
import { useEventControllerClaimEventReward } from '@/api/endpoints/event/event';
import {
  getUserControllerGetTicketBalanceQueryKey,
  getUserControllerGetExpiringTicketsQueryKey,
  useUserControllerGetNextTicketGrantNotice,
  useUserControllerMarkTicketGrantNoticeShown,
  useUserControllerMarkTicketGrantNoticeDismissed,
} from '@/api/endpoints/user/user';

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
function isExperienceSettingsPathWithoutNavbar(pathname: string) {
  return (
    /^\/experience\/settings/.test(pathname) && !pathname.includes('/portfolio')
  );
}

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showNavbarOnResult, setShowNavbarOnResult] = useState(false);
  const [weeklyVoucherModalOpen, setWeeklyVoucherModalOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const claimAttemptedRef = useRef(false);

  const { mutateAsync: claimEventReward } =
    useEventControllerClaimEventReward();
  
  const { data: noticeData } = useUserControllerGetNextTicketGrantNotice();
  const notice = noticeData?.result;

  const { mutateAsync: markShown } = useUserControllerMarkTicketGrantNoticeShown();
  const { mutateAsync: markDismissed } = useUserControllerMarkTicketGrantNoticeDismissed();

  const path = pathname ?? '';
  const hideNavbar = isCorrectionNewPath(path)
    ? true
    : isCorrectionDetailPath(path)
      ? false
      : isExperienceSettingsPathWithoutNavbar(path);

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
            if (
              child instanceof HTMLElement &&
              isSpeedOverlay(child)
            )
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

  // [주석 처리] 회원가입 직후 첫 번째 모달: 루트(/)에서만 모달 오픈 (terms에서 약관 동의 후 가입 한 번만)
  // useEffect(() => {
  //   if (path !== '/') return;
  //   if (typeof window === 'undefined') return;
  //   const fromSignup = sessionStorage.getItem(TERMS_FROM_SIGNUP_KEY);
  //   if (fromSignup) {
  //     sessionStorage.removeItem(TERMS_FROM_SIGNUP_KEY);
  //     setWeeklyVoucherModalOpen(true);
  //   }
  // }, [path]);

  // [주석 처리] 회원가입 직후 첫 번째 모달이 열릴 때 보상 수령 API 호출
  // useEffect(() => {
  //   if (!weeklyVoucherModalOpen) {
  //     claimAttemptedRef.current = false;
  //     return;
  //   }
  //   if (claimAttemptedRef.current) return;
  //   claimAttemptedRef.current = true;
  //   claimEventReward({ eventCode: WEEKLY_VOUCHER_EVENT_CODE })
  //     .then(() => {
  //       markWeeklyVoucherGranted();
  //       queryClient.invalidateQueries({
  //         queryKey: getUserControllerGetTicketBalanceQueryKey(),
  //       });
  //       queryClient.invalidateQueries({
  //         queryKey: getUserControllerGetExpiringTicketsQueryKey(),
  //       });
  //     })
  //     .catch(() => {
  //       claimAttemptedRef.current = false;
  //     });
  // }, [weeklyVoucherModalOpen, claimEventReward, queryClient]);

  // 새 보상 안내 모달 로직
  useEffect(() => {
    if (notice && !noticeModalOpen) {
      setNoticeModalOpen(true);
      markShown({ noticeId: String(notice.id) }).catch(() => {});
    }
  }, [notice, noticeModalOpen, markShown]);

  const handleNoticeModalClose = (open: boolean) => {
    if (!open && noticeModalOpen && notice) {
      markDismissed({ noticeId: String(notice.id) }).catch(() => {});
      setNoticeModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['/users/me/ticket-grant-notices/next'],
      });
      queryClient.invalidateQueries({
        queryKey: ['/users/me/tickets'],
      });
    }
  };

  return (
    <CorrectionNavbarContext.Provider
      value={{
        setShowNavbarOnResult: useCallback(
          (show: boolean) => setShowNavbarOnResult(show),
          [],
        ),
      }}
    >
      {!hideNavbar && <Navbar />}
      {!hideNavbar && <BannerBeta />}
      <div className={hideNavbar ? '' : 'layout-content-below-header'}>
        {children}
      </div>

      {/* 포트폴리오 생성 완료 시 어디서든 portfolio 페이지로 리다이렉트 */}
      <PortfolioCreationPoller />

      {/* [주석 처리] 회원가입 직후 첫 번째 모달: 주간 이용권 지급 */}
      {/* <OBTEventModal
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
      /> */}

      {/* 동적 지급 보상 안내 모달 */}
      <EventModal
        open={noticeModalOpen}
        onOpenChange={handleNoticeModalClose}
        notice={notice ?? null}
        onButtonClick={() => {
          if (typeof notice?.ctaLink === 'string') {
            router.push(notice.ctaLink);
          }
        }}
      />
    </CorrectionNavbarContext.Provider>
  );
}
