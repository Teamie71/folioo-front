'use client';

import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import type { CommonButtonVariant } from '@/components/CommonButton';
import { useAuthStore } from '@/store/useAuthStore';
import { ReactNode } from 'react';

interface StartCorrectionButtonProps {
  children: ReactNode;
  /* ContentCard에서는 'Outline', 하단 CTA 등에서는 'Gradient' (기본값) */
  variantType?: CommonButtonVariant;
  px?: string | number;
  py?: string | number;
}

/* 클릭 시 /correction/new(지원 정보 입력) 페이지로 이동하는 버튼 */
export function StartCorrectionButton({
  children,
  variantType = 'Gradient',
  px = '2.25rem',
  py = '0.75rem',
}: StartCorrectionButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const handleClick = () => {
    const target = '/correction/new';

    if (!accessToken) {
      router.push(`/login?redirect_to=${encodeURIComponent(target)}`);
      return;
    }

    router.push(target);
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
