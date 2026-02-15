'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/utils';
import InputArea from '@/components/InputArea';

interface InlineEditProps {
  title: string;
  isEditing?: boolean;
  editable?: boolean; // false면 수정 아이콘 미표시
  onEdit?: () => void;
  onSave?: (newTitle: string) => void;
  className?: string;
}

export function InlineEdit({
  title,
  isEditing = false,
  editable = true,
  onEdit,
  onSave,
  className,
}: InlineEditProps) {
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(0);

  useEffect(() => {
    setValue(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing || !measureRef.current) return;
    const w = measureRef.current.offsetWidth;
    // px-[0.75rem] = 12px each side → 텍스트 너비에 맞춰 좌우 여백 동일하게
    setInputWidth(w + 2 * 12);
  }, [value, isEditing]);

  const handleSave = () => {
    if (onSave) {
      onSave(value.trim() || title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(title);
      if (onSave) {
        onSave(title);
      }
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-[1.5rem]',
        !isEditing && editable && 'cursor-pointer',
        className,
      )}
    >
      {isEditing
        ? editable && (
            <div className='relative inline-flex items-center'>
              <div className='relative inline-block'>
                <span
                  ref={measureRef}
                  aria-hidden
                  className='invisible absolute top-0 left-0 text-[1.25rem] font-bold whitespace-pre'
                >
                  {value || ' '}
                </span>

                <InputArea
                  ref={inputRef}
                  type='text'
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  width={inputWidth > 0 ? inputWidth : undefined}
                  className='rounded-[0.375rem] border-[#1A1A1A] px-[0.75rem] py-[0.5rem] text-[1.25rem] font-bold'
                />
              </div>

              {/* 수정 완료 버튼 */}
              <button
                onClick={() => onSave?.(value)}
                className='ml-[1rem] cursor-pointer border-none bg-transparent'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <circle cx='12' cy='12' r='10' fill='#4F63D3' />
                  <path
                    d='M7.5 12.3 L10.4 15.2 L16.6 9'
                    stroke='#FFFFFF'
                    strokeWidth='2.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
          )
        : (
            <>
              {/* 제목 텍스트 (editable일 때만 클릭 가능) */}
              <span
                className={cn(
                  'rounded-[0.375rem] border border-transparent py-[0.5rem] pr-0 pl-[0.75rem] text-[1.25rem] font-bold',
                  editable && 'cursor-pointer',
                )}
                onClick={editable ? onEdit : undefined}
              >
                {title}
              </span>

              {/* 수정 아이콘 버튼 (editable일 때만, hover 시 표시) */}
              {editable && (
                <button
                  onClick={onEdit}
                  className='cursor-pointer border-none bg-transparent opacity-0 transition-opacity group-hover:opacity-100'
                  aria-label='제목 수정'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M18.9993 19.0001C19.2542 19.0003 19.4993 19.0979 19.6847 19.2729C19.87 19.4479 19.9815 19.687 19.9965 19.9415C20.0114 20.1959 19.9286 20.4464 19.765 20.6419C19.6015 20.8373 19.3694 20.963 19.1163 20.9931L18.9993 21.0001H11.9993C11.7444 20.9998 11.4993 20.9022 11.3139 20.7272C11.1286 20.5522 11.0171 20.3131 11.0021 20.0587C10.9872 19.8042 11.07 19.5537 11.2336 19.3582C11.3972 19.1628 11.6292 19.0372 11.8823 19.0071L11.9993 19.0001H18.9993ZM16.0953 4.36806C16.5533 3.91036 17.171 3.64819 17.8183 3.63674C18.4657 3.62529 19.0923 3.86545 19.5662 4.30667C20.04 4.74789 20.3242 5.35574 20.359 6.00229C20.3937 6.64883 20.1762 7.28363 19.7523 7.77306L19.6303 7.90306L8.73431 18.8001C8.63908 18.8954 8.53145 18.9775 8.41431 19.0441L8.29431 19.1041L4.49031 20.8341C3.68231 21.2011 2.85231 20.4171 3.12531 19.6091L3.16531 19.5091L4.89531 15.7041C4.95076 15.5817 5.0224 15.4673 5.10831 15.3641L5.19831 15.2641L16.0953 4.36806Z'
                      fill='#74777D'
                    />
                  </svg>
                </button>
              )}
            </>
          )}
    </div>
  );
}
