'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/utils';
import { ModalFunctionIcon } from './icons/ModalFunctionIcon';

interface ModalFunctionButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const ModalFunctionButton = ({
  onEdit,
  onDelete,
  className,
}: ModalFunctionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleEdit = () => {
    onEdit?.();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete?.();
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        className='flex cursor-pointer items-center border-none bg-transparent text-[#1A1A1A]'
        onClick={() => setIsOpen(!isOpen)}
      >
        <ModalFunctionIcon />
      </button>

      {isOpen && (
        <div className='absolute top-full right-0 z-50 mt-[0.5rem] min-w-[6rem] translate-x-[-0.5rem] overflow-hidden rounded-[0.5rem] border border-[#CDD0D5] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
          <div className='flex cursor-pointer flex-col'>
            <button
              className='cursor-pointer px-[1rem] py-[1rem] text-center text-[0.875rem] font-medium text-[#1A1A1A] transition-colors hover:bg-[#F6F5FF] hover:font-semibold hover:text-[#5060C5]'
              onClick={handleEdit}
            >
              수정
            </button>
            {onDelete && (
              <button
                className='cursor-pointer px-[1rem] py-[0.75rem] text-center text-[0.875rem] font-medium text-[#1A1A1A] transition-colors hover:bg-[#F6F5FF] hover:font-semibold hover:text-[#5060C5]'
                onClick={handleDelete}
              >
                삭제
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
