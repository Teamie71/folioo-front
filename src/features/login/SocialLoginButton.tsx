'use client';

import { type ReactNode } from 'react';

const variantStyles = {
  kakao: 'bg-[#FEE500] text-[#1A1A1A]',
  naver: 'bg-[#03A94D] text-[#FDFDFD]',
  google: 'border border-[#747775] bg-[#ffffff] text-[#1A1A1A]',
} as const;

const baseClassName =
  'flex h-[2.5rem] w-[19rem] cursor-pointer items-center justify-center gap-[0.5rem] rounded-[0.5rem] text-[1rem] font-semibold';

type Variant = keyof typeof variantStyles;

interface SocialLoginButtonProps {
  variant: Variant;
  onClick: () => void;
  children: ReactNode;
}

export function SocialLoginButton({
  variant,
  onClick,
  children,
}: SocialLoginButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`${baseClassName} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
}
