'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from '@/components/ui/Button';
import { cn } from '@/utils/utils';
import { PlusIcon } from '@/components/icons/PlusIcon';

// 스타일 정의 타입
export type CommonButtonVariant =
  | 'Primary'
  | 'Execute'
  | 'Cancel'
  | 'Outline'
  | 'StartChat'
  | 'Gradient';

interface CommonButtonProps extends Omit<ButtonProps, 'variant'> {
  variantType: CommonButtonVariant;
  px?: string | number; // padding x 값
  py?: string | number; // padding y 값
  href?: string | number; // 링크 주소
  children: React.ReactNode;
}

export function CommonButton({
  variantType,
  px,
  py,
  className,
  style,
  href,
  children,
  ...props
}: CommonButtonProps) {
  // 스타일 매핑 객체
  const styles = {
    // Primary: 주로 사용하는 버튼
    Primary:
      'rounded-full bg-[#5060C5] text-[#ffffff] text-[1rem] font-bold cursor-pointer',

    // Execute: 모달에서 실행하거나 동작할 때 사용하는 버튼
    Execute:
      'rounded-[0.5rem] bg-[#5060C5] text-[#ffffff] text-[1rem] font-bold cursor-pointer',

    // Cancel: 취소 버튼
    Cancel:
      'rounded-[0.5rem] bg-white text-[#000000] border border-[#74777D] text-[1rem] cursor-pointer',

    // Outline: border가 존재하는 버튼
    Outline:
      'rounded-[6.25rem] bg-[#F6F5FF] text-[#5060C5] border-[0.09375rem] border-[#5060C5] text-[1rem] font-semibold cursor-pointer',

    // StartChat: 채팅 시작 버튼 - px&py 고정
    StartChat:
      'rounded-[6.25rem] bg-[#ffffff] px-[2rem] py-[1.25rem] text-[#1A1A1A] text-[1.125rem] font-bold shadow-[0px_0px_8px_0px_#00000026] gap-[0.5rem] cursor-pointer inline-flex items-center justify-center [&_svg]:!w-6 [&_svg]:!h-6',

    // Gradient: 그라디언트 배경 버튼
    Gradient:
      'rounded-[6.25rem] bg-gradient-to-b from-[#93B3F4] to-[#5060C5] text-[#ffffff] text-[1rem] font-bold cursor-pointer',
  };

  // px, py 값을 그대로 사용
  const formatPadding = (
    value?: string | number,
  ): string | number | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return `${value}px`;
    return value; //
  };

  const paddingStyle = {
    paddingLeft: formatPadding(px),
    paddingRight: formatPadding(px),
    paddingTop: formatPadding(py),
    paddingBottom: formatPadding(py),
    height: 'auto', // 고정 높이 해제
    width: 'auto', // 고정 너비 해제
    ...style,
  };

  const ButtonContent = (
    <Button
      className={cn('h-auto w-auto', styles[variantType], className)}
      style={paddingStyle}
      {...props}
    >
      {/* StartChat 버튼일 때만 PlusIcon 추가 */}
      {variantType === 'StartChat' ? (
        <>
          <PlusIcon />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );

  // href가 있으면 Link로 감싸서 반환
  if (href) {
    return <Link href={String(href)}>{ButtonContent}</Link>;
  }

  // href가 없으면 그냥 버튼 반환
  return ButtonContent;
}
