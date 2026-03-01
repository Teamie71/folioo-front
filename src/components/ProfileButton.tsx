'use client';

import { forwardRef } from 'react';
import { ProfileIcon } from '@/components/icons/ProfileIcon';
import { cn } from '@/utils/utils';

interface ProfileButtonProps {
  onClick: () => void;
  /* 드롭다운이 열려 있을 때 true → 네비 링크 활성 스타일(굵게 + #5060C5) */
  isOpen?: boolean;
  className?: string;
}

export const ProfileButton = forwardRef<HTMLButtonElement, ProfileButtonProps>(
  ({ onClick, isOpen = false, className }, ref) => {
    return (
      <button
        ref={ref}
        type='button'
        onClick={onClick}
        className={cn(
          'inline-flex cursor-pointer items-center gap-[0.25rem] border-none bg-transparent py-[8px] font-[16px] no-underline transition-colors outline-none hover:font-bold focus:outline-none',
          isOpen ? 'font-bold text-[#5060C5]' : 'text-[#333333]',
          className,
        )}
      >
        <ProfileIcon />
        <span>MY</span>
      </button>
    );
  },
);

ProfileButton.displayName = 'ProfileButton';
