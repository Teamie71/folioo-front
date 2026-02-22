'use client';

import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';

export function NewCorrectionStartButton() {
  const router = useRouter();

  const handleCreateNewCorrection = () => {
    const id = crypto.randomUUID();
    router.push(`/correction/${id}`);
  };

  return (
    <CommonButton
      variantType='StartChat'
      onClick={handleCreateNewCorrection}
    >
      새로운 포트폴리오 첨삭 시작하기
    </CommonButton>
  );
}
