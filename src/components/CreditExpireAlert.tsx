'use client';

import type { ButtonProps } from '@/components/ui/Button';

interface CreditExpireAlertProps extends Omit<
  ButtonProps,
  'variant' | 'children'
> {
  message: string;
  px?: string | number;
  py?: string | number;
  href?: string | number;
  expiringDays?: number;
  hideWhenEmpty?: boolean;
  wrapperClassName?: string;
}

/**
 * 이용권 만료 API가 백엔드 계약에서 제거되어 더 이상 표시할 수 없다.
 * 호출부 호환성을 유지하되, 존재하지 않는 데이터를 임의로 만들어 보여주지 않는다.
 */
export function CreditExpireAlert(_props: CreditExpireAlertProps) {
  return null;
}
