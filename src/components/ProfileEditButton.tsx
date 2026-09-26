'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { ModifyIcon } from '@/components/icons/ModifyIcon';
import { cn } from '@/utils/utils';
import Image from 'next/image';

interface ProfileEditButtonProps {
  value: string;
  onSave?: (newValue: string) => void;
  className?: string;
  textClassName?: string;
  inputClassName?: string;
  variant?: 'desktop' | 'mobile';
}

export function ProfileEditButton({
  value,
  onSave,
  className,
  textClassName,
  inputClassName,
  variant = 'desktop',
}: ProfileEditButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = variant === 'mobile';

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleComplete = () => {
    const trimmed = editValue.trim();
    if (!trimmed) return;

    onSave?.(trimmed);
    setEditValue(trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleComplete();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 items-center gap-[1.25rem]',
        isMobile && !isEditing && 'items-start',
        isMobile && isEditing && 'gap-4',
        className,
      )}
    >
      {isEditing ? (
        <>
          <Input
            ref={inputRef}
            type='text'
            value={editValue}
            maxLength={25}
            aria-label='이름'
            onChange={(e) => setEditValue(e.target.value.slice(0, 25))}
            onKeyDown={handleKeyDown}
            className={cn(
              'min-w-0 flex-1 rounded-[0.375rem] border border-[#74777D] px-[0.75rem] py-[0.5rem]',
              'h-auto font-bold text-[#1A1A1A]',
              isMobile &&
                'h-[39px] rounded-lg bg-white px-3 py-[7px] text-[1.125rem] leading-[1.3] shadow-none focus-visible:ring-0 md:text-[1.125rem]',
              inputClassName,
            )}
          />
          <button
            type='button'
            onClick={handleComplete}
            disabled={!editValue.trim()}
            className='shrink-0 cursor-pointer border-none bg-transparent disabled:cursor-not-allowed disabled:opacity-40'
            aria-label='수정 완료'
          >
            {isMobile ? (
              <Image
                src='/mobile/profile-save.svg'
                alt=''
                width={20}
                height={20}
              />
            ) : (
              <CheckCircleIcon />
            )}
          </button>
        </>
      ) : (
        <>
          <p
            className={cn(
              'min-w-0 flex-1 cursor-pointer font-bold text-[#1A1A1A]',
              textClassName || 'typo-h3',
            )}
            onClick={() => setIsEditing(true)}
          >
            {value || '-'}
          </p>
          <button
            type='button'
            onClick={() => setIsEditing(true)}
            className={cn(
              'shrink-0 cursor-pointer border-none bg-transparent',
              isMobile && 'mt-[1.5px]',
            )}
            aria-label='이름 수정'
          >
            {isMobile ? (
              <span className='relative block size-5'>
                <Image
                  src='/mobile/profile-edit.svg'
                  alt=''
                  width={14.4086}
                  height={16.8148}
                  className='absolute top-[3.03px] left-[2.56px]'
                />
              </span>
            ) : (
              <ModifyIcon />
            )}
          </button>
        </>
      )}
    </div>
  );
}
