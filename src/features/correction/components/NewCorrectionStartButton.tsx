'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { CorrectionLimitModal } from '@/components/CorrectionLimitModal';
import { portfolioCorrectionControllerGetCorrections } from '@/api/endpoints/portfolio-correction/portfolio-correction';
import { useAuthStore } from '@/store/useAuthStore';

const MAX_CORRECTION_COUNT = 30;

export function NewCorrectionStartButton() {
  const router = useRouter();
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (state) => state.sessionRestoreAttempted,
  );
  const isLoggedIn = accessToken != null;

  const handleCreateNewCorrection = async () => {
    if (!sessionRestoreAttempted || isCheckingLimit) return;

    if (!isLoggedIn) {
      router.push('/correction/new');
      return;
    }

    setIsCheckingLimit(true);
    try {
      const response = await portfolioCorrectionControllerGetCorrections();
      if ((response?.result?.length ?? 0) >= MAX_CORRECTION_COUNT) {
        setIsLimitModalOpen(true);
        return;
      }
      router.push('/correction/new');
    } catch {
      router.push('/correction/new');
    } finally {
      setIsCheckingLimit(false);
    }
  };

  return (
    <>
      <CommonButton
        variantType='StartChat'
        disabled={!sessionRestoreAttempted || isCheckingLimit}
        onClick={handleCreateNewCorrection}
      >
        새로운 포트폴리오 첨삭 시작하기
      </CommonButton>
      <CorrectionLimitModal
        open={isLimitModalOpen}
        onOpenChange={setIsLimitModalOpen}
      />
    </>
  );
}
