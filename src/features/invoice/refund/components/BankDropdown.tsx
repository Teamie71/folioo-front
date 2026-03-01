'use client';

import { useState, useRef, useEffect } from 'react';
import { DropdownIcon } from '@/components/icons/DropdownIcon';

const BANKS = [
  'NH농협',
  '카카오뱅크',
  'KB국민',
  '토스뱅크',
  '신한',
  '우리',
  'IBK기업',
  '하나',
  '새마을금고',
  '부산',
  'iM뱅크(대구)',
  '케이뱅크',
  '신협',
  '우체국',
  'SC제일',
  '경남',
  '광주',
  '수현',
  '전북',
  '저축은행',
  '제주',
  '씨티',
  'KDB산업',
  '산림조합',
  'SBI저축은행',
] as const;

interface BankDropdownProps {
  value?: string | null;
  onChange?: (bank: string | null) => void;
}

/** 항목 1개 높이(패딩+라인) 기준, 5개 높이로 고정 */
const LIST_HEIGHT_REM = 5 * 3.5;

export function BankDropdown({ value = null, onChange }: BankDropdownProps) {
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
    <div ref={dropdownRef} className='relative'>
      <div className='w-[28.75rem] rounded-[0.5rem] border border-[#74777D] py-[0.75rem] pr-[1.125rem] pl-[1.25rem]'>
        <button
          type='button'
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className='flex w-full cursor-pointer items-center justify-between border-none bg-transparent text-start'
        >
          <span
            className={`text-[1rem] ${value ? 'text-[#1A1A1A]' : 'text-[#74777D]'}`}
          >
            {value ?? '선택'}
          </span>
          <DropdownIcon
            className={`shrink-0 [&_path]:stroke-[#74777D] ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {isDropdownOpen && (
        <ul
          className='absolute top-full left-0 z-10 mt-[0.25rem] w-full overflow-y-auto rounded-[0.5rem] border border-[#CDD0D5] bg-white'
          style={{ height: `${LIST_HEIGHT_REM}rem` }}
          role='listbox'
        >
          {BANKS.map((bank) => (
            <li key={bank} role='option'>
              <button
                type='button'
                onClick={() => {
                  onChange?.(bank);
                  setIsDropdownOpen(false);
                }}
                className='w-full cursor-pointer px-[1.25rem] py-[1rem] text-left text-[1rem] text-[#1A1A1A] hover:bg-[#F6F5FF] hover:font-semibold hover:text-[#5060C5]'
              >
                {bank}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
