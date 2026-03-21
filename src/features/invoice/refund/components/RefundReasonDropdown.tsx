'use client';

import { useState, useRef, useEffect } from 'react';
import { DropdownIcon } from '@/components/icons/DropdownIcon';

const REFUND_REASONS = [
  '단순 변심',
  '구매 실수',
  '서비스 이용 장애 / 불가',
  '중복 결제',
  '기타',
] as const;

interface RefundReasonDropdownProps {
  value?: string | null;
  onChange?: (reason: string | null) => void;
}

export function RefundReasonDropdown({
  value = null,
  onChange,
}: RefundReasonDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className='relative w-full md:w-auto'>
      <div className='h-[3.75rem] w-full rounded-[0.75rem] border border-[#74777D] py-[1rem] pr-[1.125rem] pl-[1.25rem] md:w-[32.25rem]'>
        <button
          type='button'
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className='flex w-full cursor-pointer items-center justify-between border-none bg-transparent'
        >
          <span
            className={`text-[1.125rem] ${value ? 'text-[#1A1A1A]' : 'text-[#74777D]'}`}
          >
            {value ?? '환불 신청 이유 선택'}
          </span>
          <DropdownIcon
            className={`shrink-0 [&_path]:stroke-[#74777D] ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {isDropdownOpen && (
        <ul
          className='absolute top-full left-0 z-10 mt-[1.25rem] w-full rounded-[0.5rem] border border-[#CDD0D5] bg-white'
          role='listbox'
        >
          {REFUND_REASONS.map((reason) => (
            <li key={reason} role='option'>
              <button
                type='button'
                onClick={() => {
                  onChange?.(reason);
                  setIsDropdownOpen(false);
                }}
                className='w-full cursor-pointer px-[1.25rem] py-[1rem] text-left text-[1rem] text-[#1A1A1A] hover:bg-[#F6F5FF] hover:font-semibold hover:text-[#5060C5]'
              >
                {reason}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
