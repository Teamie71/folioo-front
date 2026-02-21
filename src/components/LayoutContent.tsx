'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { BannerBeta } from '@/components/BannerBeta';
import { OBTEventModal } from '@/components/OBT/OBTEventModal';
import {
  shouldGrantWeeklyVoucher,
  markWeeklyVoucherGranted,
} from '@/utils/weeklyVoucher';
import { CorrectionNavbarContext } from '@/contexts/CorrectionNavbarContext';

const HIDE_NAVBAR_PATTERNS = [/^\/correction\/[^/]+$/];

function isCorrectionDetailPath(pathname: string) {
  return /^\/correction\/[^/]+$/.test(pathname);
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

  const isCorrectionDetail = isCorrectionDetailPath(pathname ?? '');
  const hideNavbar = isCorrectionDetail
    ? !showNavbarOnResult
    : HIDE_NAVBAR_PATTERNS.some((p) => p.test(pathname ?? ''));

  useEffect(() => {
    if (!isCorrectionDetail) setShowNavbarOnResult(false);
  }, [isCorrectionDetail]);

  useEffect(() => {
    // 접속 시 주간 이용권 지급 여부 확인
    if (shouldGrantWeeklyVoucher()) {
      setWeeklyVoucherModalOpen(true);
      markWeeklyVoucherGranted();
    }
  }, []);

  return (
    <CorrectionNavbarContext.Provider
      value={{ setShowNavbarOnResult: useCallback((show: boolean) => setShowNavbarOnResult(show), []) }}
    >
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? '' : 'pt-[80px]'}>
        {!hideNavbar && <BannerBeta />}
        {children}
      </div>

      {/* 주간 이용권 지급 모달 */}
      <OBTEventModal
        open={weeklyVoucherModalOpen}
        onOpenChange={setWeeklyVoucherModalOpen}
        eventTitle='이번 주의 무료 이용권'
        eventSubTitle='보상 지급 완료'
        reward='경험 정리 2회권 + 포트폴리오 첨삭 6회권'
        rewardMessage='{reward}이 지급되었어요.'
        subMessage='Folioo와 함께 경험을 강력한 서류로 만들어보세요.'
        validityMessage='지급된 이용권은 6개월 간 사용 가능해요.'
        buttonText='첨삭 의뢰하기 '
        onButtonClick={() => {
          const id = crypto.randomUUID();
          router.push(`/correction/${id}`);
        }}
      />
    </CorrectionNavbarContext.Provider>
  );
}
