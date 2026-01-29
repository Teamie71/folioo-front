'use client';

import { useState, useRef, useEffect } from 'react';
import { DropdownIcon } from './icons/DropdownIcon';
import { cn } from '@/utils/utils';

interface DropdownItem {
  id: string;
  label: string;
  onDelete?: (id: string) => void;
}

interface DropdownButtonProps {
  items: DropdownItem[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  menuClassName?: string;
  menuWidth?: string | number;
}

export const DropdownButton = ({
  items,
  value,
  onChange,
  className,
  menuClassName,
  menuWidth,
}: DropdownButtonProps) => {
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

  const handleItemClick = (itemId: string) => {
    onChange?.(itemId);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex cursor-pointer items-center border-none bg-transparent text-[#1A1A1A]'
      >
        <DropdownIcon
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full right-0 z-50 mt-[2rem] min-w-[10rem] translate-x-[1.25rem] overflow-hidden rounded-[0.5rem] border border-[#CDD0D5] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_#00000033]',
            menuClassName,
          )}
          style={
            menuWidth
              ? {
                  width:
                    typeof menuWidth === 'number'
                      ? `${menuWidth}px`
                      : menuWidth,
                }
              : undefined
          }
        >
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
                    isHovered &&
                      isFirst &&
                      'rounded-tl-[0.5rem] rounded-tr-[0.5rem]',
                    isHovered &&
                      isLast &&
                      'rounded-br-[0.5rem] rounded-bl-[0.5rem]',
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
};
