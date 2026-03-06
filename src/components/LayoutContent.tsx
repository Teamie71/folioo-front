'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { BannerBeta } from '@/components/OBT/OBTBanner';
import { OBTEventModal } from '@/components/OBT/OBTEventModal';
import {
  shouldGrantWeeklyVoucher,
  markWeeklyVoucherGranted,
} from '@/utils/weeklyVoucher';
import { CorrectionNavbarContext } from '@/contexts/CorrectionNavbarContext';
import { PortfolioCreationPoller } from '@/features/experience/components/PortfolioCreationPoller';

function isCorrectionNewPath(pathname: string) {
  return /^\/correction\/new\/?$/.test(pathname);
}
function isCorrectionDetailPath(pathname: string) {
  return /^\/correction\/[^/]+$/.test(pathname) && !isCorrectionNewPath(pathname);
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
  const [showNavbarOnResult, setShowNavbarOnResult] = useState(false);
  const [weeklyVoucherModalOpen, setWeeklyVoucherModalOpen] = useState(false);

  const path = pathname ?? '';
  const hideNavbar = isCorrectionNewPath(path)
    ? true
    : isCorrectionDetailPath(path)
      ? false
      : isExperienceSettingsPathWithoutNavbar(path);

  useEffect(() => {
    if (!isCorrectionDetailPath(path)) setShowNavbarOnResult(false);
  }, [path]);

  useEffect(() => {
    // 접속 시 주간 이용권 지급 여부 확인
    if (shouldGrantWeeklyVoucher()) {
      setWeeklyVoucherModalOpen(true);
      markWeeklyVoucherGranted();
    }
  }, []);

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

      {/* 주간 이용권 지급 모달 */}
      <OBTEventModal
        open={weeklyVoucherModalOpen}
        onOpenChange={setWeeklyVoucherModalOpen}
        eventTitle='이번 주의 무료 이용권'
        eventSubTitle='보상 지급 완료'
        reward='경험 정리 2회권 + 포트폴리오 첨삭 6회권'
        rewardMessage='{reward}이 지급되었어요.'
        subMessage='Folioo와 함께 경험을 강력한 서류로 만들어보세요.'
        validityMessage='지급된 이용권은 일요일까지 사용 가능해요.'
        buttonText='첨삭 의뢰하기 '
        onButtonClick={() => router.push('/correction/new')}
      />
    </CorrectionNavbarContext.Provider>
  );
}
