'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/utils';

interface DropdownItem {
  id: string;
  label: string;
  onDelete?: (id: string) => void;
}

interface DropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export function Dropdown({
  items,
  placeholder = '선택하세요',
  value,
  onChange,
  className,
  inputClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedItem = items.find((item) => item.id === value);

  const handleItemClick = (itemId: string) => {
    onChange?.(itemId);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Input */}
      <div
        className={cn(
          'flex w-[28.5rem] items-center rounded-[0.5rem] border-[1px] border-[#74777D] px-[1.25rem] py-[0.75rem]',
          inputClassName,
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type='text'
          readOnly
          value={selectedItem?.label || ''}
          placeholder={placeholder}
          className='flex-1 cursor-pointer border-none bg-transparent outline-none'
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className='ml-[0.5rem] flex-shrink-0 cursor-pointer border-none bg-transparent'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            className={cn('transition-transform', isOpen && 'rotate-180')}
          >
            <path
              d='M6 9L12 15L18 9'
              stroke='#74777D'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute top-full z-50 mt-[1.25rem] w-[28.5rem] overflow-hidden rounded-[0.5rem] border border-[#CDD0D5] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
          <div className='flex flex-col'>
            {items.map((item, index) => {
              const isHovered = hoveredItemId === item.id;
              const hasDelete = !!item.onDelete;
              const isFirst = index === 0;
              const isLast = index === items.length - 1;

              return (
                <div
                  key={item.id}
                  className={cn(
                    'group relative flex cursor-pointer items-center justify-between px-[1.25rem] py-[1rem] transition-colors',
                    isHovered && 'bg-[#F6F5FF]',
                    isHovered && isFirst && 'rounded-tl-[0.5rem] rounded-tr-[0.5rem]',
                    isHovered && isLast && 'rounded-bl-[0.5rem] rounded-br-[0.5rem]',
                  )}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className='text-[1rem] text-[#1A1A1A]'>
                    {item.label}
                  </span>
                  <div className='flex h-[28px] w-[28px] flex-shrink-0 items-center justify-center'>
                    {hasDelete && isHovered && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onDelete?.(item.id);
                        }}
                        className='cursor-pointer border-none bg-transparent text-[#1A1A1A] hover:opacity-80'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='28'
                          height='28'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='#DC0000'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M3 6h18' />
                          <path d='M8 6V4h8v2' />
                          <rect x='5' y='6' width='14' height='15' rx='1' />
                          <path d='M10 11v6' />
                          <path d='M14 11v6' />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
