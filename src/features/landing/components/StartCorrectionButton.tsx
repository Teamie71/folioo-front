'use client';

import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import type { CommonButtonVariant } from '@/components/CommonButton';
import { ReactNode } from 'react';

interface StartCorrectionButtonProps {
  children: ReactNode;
  /* ContentCard에서는 'Outline', 하단 CTA 등에서는 'Gradient' (기본값) */
  variantType?: CommonButtonVariant;
  px?: string | number;
  py?: string | number;
}

/* 클릭 시 새 UUID를 부여한 /correction/[id] 첫 상태 페이지로 이동하는 버튼 */
export function StartCorrectionButton({
  children,
  variantType = 'Gradient',
  px = '2.25rem',
  py = '0.75rem',
}: StartCorrectionButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    const id = crypto.randomUUID();
    router.push(`/correction/${id}`);
  };

  return (
    <CommonButton
      variantType={variantType}
      px={px}
      py={py}
      onClick={handleClick}
    >
      {children}
    </CommonButton>
  );
}
