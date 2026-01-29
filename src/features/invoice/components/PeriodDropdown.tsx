'use client';

import { useState, useRef, useEffect } from 'react';
import { PeriodDropdownIcon } from '@/components/icons/PeriodDropdownIcon';

type PeriodType = '전체 기간' | '3개월 이내' | '6개월 이내';

export function PeriodDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('전체 기간');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const periods: PeriodType[] = ['전체 기간', '3개월 이내', '6개월 이내'];

  const handlePeriodSelect = (period: PeriodType) => {
    setSelectedPeriod(period);
    setIsOpen(false);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className='relative flex-col items-center gap-[0.375rem]'
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent pl-[0.25rem]'
      >
        <span className='text-[1rem] whitespace-nowrap text-[#464B53]'>
          {selectedPeriod}
        </span>
        <PeriodDropdownIcon />
      </button>

      <div className='h-[0.0625rem] w-full rounded-[0.5rem] border border-[#74777D]' />

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className='absolute top-[3rem] left-1/2 z-10 flex w-[6.875rem] -translate-x-1/2 flex-col gap-[2rem] rounded-[0.5rem] bg-white py-[1rem] text-center text-[1rem] leading-[150%] shadow-[0px_4px_8px_0px_#00000033]'>
          {periods.map((period) => (
            <p
              key={period}
              onClick={() => handlePeriodSelect(period)}
              className='cursor-pointer text-[#464B53]'
            >
              {period}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
