'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { ModifyIcon } from '@/components/icons/ModifyIcon';
import { cn } from '@/utils/utils';

interface ProfileEditButtonProps {
  value: string;
  onSave?: (newValue: string) => void;
  className?: string;
}

export function ProfileEditButton({
  value,
  onSave,
  className,
}: ProfileEditButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const trimmed = editValue.trim() || value;
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
            onChange={(e) => setEditValue(e.target.value.slice(0, 25))}
            onKeyDown={handleKeyDown}
            className={cn(
              'min-w-0 flex-1 rounded-[0.375rem] border border-[#74777D] px-[0.75rem] py-[0.5rem]',
              'h-auto !text-[1.125rem] !leading-[130%] !font-bold text-[#1A1A1A]',
            )}
          />
          <button
            type='button'
            onClick={handleComplete}
            className='shrink-0 cursor-pointer border-none bg-transparent'
            aria-label='수정 완료'
          >
            <CheckCircleIcon />
          </button>
        </>
      ) : (
        <>
          <p
            className='min-w-0 flex-1 cursor-pointer text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'
            onClick={() => setIsEditing(true)}
          >
            {value || '-'}
          </p>
          <button
            type='button'
            onClick={() => setIsEditing(true)}
            className='shrink-0 cursor-pointer border-none bg-transparent'
            aria-label='이름 수정'
          >
            <ModifyIcon />
          </button>
        </>
      )}
    </div>
  );
}
