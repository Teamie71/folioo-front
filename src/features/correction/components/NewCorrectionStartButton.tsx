'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { CorrectionLimitModal } from '@/components/CorrectionLimitModal';
import { usePortfolioCorrectionControllerGetCorrections } from '@/api/endpoints/portfolio-correction/portfolio-correction';
import { useAuthStore } from '@/store/useAuthStore';

const MAX_CORRECTION_COUNT = 30;

export function NewCorrectionStartButton() {
  const router = useRouter();
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (state) => state.sessionRestoreAttempted,
  );
  const { data } = usePortfolioCorrectionControllerGetCorrections(undefined, {
    query: { enabled: sessionRestoreAttempted && accessToken != null },
  });

  const handleCreateNewCorrection = () => {
    if ((data?.result?.length ?? 0) >= MAX_CORRECTION_COUNT) {
      setIsLimitModalOpen(true);
      return;
    }
    router.push('/correction/new');
  };

  return (
    <>
      <CommonButton variantType='StartChat' onClick={handleCreateNewCorrection}>
        새로운 포트폴리오 첨삭 시작하기
      </CommonButton>
      <CorrectionLimitModal
        open={isLimitModalOpen}
        onOpenChange={setIsLimitModalOpen}
      />
    </>
  );
}
