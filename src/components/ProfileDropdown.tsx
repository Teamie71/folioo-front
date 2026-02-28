'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/utils';

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
  /** MY 버튼(트리거) 요소의 ref */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onProfileClick: () => void;
  onLogoutClick: () => void;
}

export function ProfileDropdown({
  open,
  onClose,
  triggerRef,
  onProfileClick,
  onLogoutClick,
}: ProfileDropdownProps) {
  const DROPDOWN_WIDTH_PX = 11.25 * 16; // 11.25rem
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || typeof document === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 1.25 * 16, // 1.25rem
      left: rect.right - DROPDOWN_WIDTH_PX, // 드롭다운 오른쪽 끝이 버튼 오른쪽과 일치
    });
  };

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    const rafId = requestAnimationFrame(() => updatePosition());
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, triggerRef]);

  const handleProfileClick = () => {
    onClose();
    onProfileClick();
  };

  const handleLogoutClick = () => {
    onClose();
    onLogoutClick();
  };

  if (!open || position === null) return null;

  const dropdown = (
    <div
      ref={dropdownRef}
      className='fixed z-[100] h-[6rem] w-[11.25rem] translate-y-[-0.75rem] overflow-hidden rounded-[0.5rem] border border-[#CDD0D5] bg-[#FFFFFF] shadow-[0_6px_20px_-2px_rgba(0,0,0,0.15)]'
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        type='button'
        onClick={handleProfileClick}
        className={cn(
          'font-regular flex w-full cursor-pointer items-center px-[1.25rem] py-[0.75rem] text-[1rem] text-[#1A1A1A] transition-colors',
          'hover:bg-[#F6F5FF] hover:font-semibold hover:text-[#5060C5]',
        )}
      >
        프로필
      </button>
      <button
        type='button'
        onClick={handleLogoutClick}
        className={cn(
          'font-regular flex w-full cursor-pointer items-center px-[1.25rem] py-[0.75rem] text-[1rem] text-[#1A1A1A] transition-colors',
          'hover:bg-[#F6F5FF] hover:font-semibold hover:text-[#5060C5]',
        )}
      >
        로그아웃
      </button>
    </div>
  );

  return createPortal(dropdown, document.body);
}
