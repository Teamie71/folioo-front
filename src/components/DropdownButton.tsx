'use client';

import { useState, useRef, useEffect } from 'react';
import { DropdownIcon } from './icons/DropdownIcon';
import { cn } from '@/utils/utils';
import { DeleteIcon } from './icons/DeleteIcon';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-selected='true'] svg path[fill],
            [data-selected='true'] svg g path[fill] {
              fill: #5060C5 !important;
            }
            [data-selected='true'] svg path[stroke],
            [data-selected='true'] svg g path[stroke] {
              stroke: #5060C5 !important;
            }
          `,
        }}
      />
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
              const isSelected = value === item.id;

              return (
                <div
                  key={item.id}
                  data-selected={isSelected ? 'true' : 'false'}
                  className={cn(
                    'group relative flex cursor-pointer items-center justify-between px-[1.25rem] py-[0.75rem] transition-colors',
                    (isHovered || isSelected) && 'bg-[#F6F5FF]',
                    (isHovered || isSelected) &&
                      isFirst &&
                      'rounded-tl-[0.5rem] rounded-tr-[0.5rem]',
                    (isHovered || isSelected) &&
                      isLast &&
                      'rounded-br-[0.5rem] rounded-bl-[0.5rem]',
                  )}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className='flex items-center gap-[0.75rem]'>
                    {item.icon && (
                      <div
                        className={cn(
                          'flex flex-shrink-0 items-center justify-center',
                          isSelected && 'text-[#5060C5]',
                        )}
                      >
                        {item.icon}
                      </div>
                    )}
                    <span
                      className={cn(
                        'text-[1rem]',
                        isSelected
                          ? 'font-semibold text-[#5060C5]'
                          : 'text-[#1A1A1A]',
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className='flex h-[1.75rem] w-[1.75rem] flex-shrink-0 items-center justify-center'>
                    {hasDelete && isHovered && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onDelete?.(item.id);
                        }}
                        className='cursor-pointer border-none bg-transparent text-[#1A1A1A] hover:opacity-80'
                      >
                        <DeleteIcon />
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
