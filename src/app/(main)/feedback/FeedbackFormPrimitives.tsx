'use client';

import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { Checkbox } from '@/components/ui/CheckBox';
import TextField from '@/components/TextField';
import { cn } from '@/utils/utils';

/** Class map for feedback form (typo-* from globals) */
export const feedbackFormClassNames = {
  questionTitle: 'typo-h5 text-[#1A1A1A]',
  subQuestionTitle: 'typo-h5 text-[#1A1A1A]',
  body: 'typo-b2 text-[#1A1A1A]',
  fieldError: 'typo-b2 mt-[8px] mb-[12px] text-[#DC0000]',
  answerStack: 'flex flex-col gap-6 px-4',
  subQuestionBlockTop: 'mt-[4.5rem]',
} as const;

export function QuestionSection({
  title,
  required,
  error,
  children,
}: {
  title: ReactNode;
  required?: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <section className='flex flex-col'>
      <h2 className={feedbackFormClassNames.questionTitle}>
        {title}
        {required ? <span className='text-[#DC0000]'> *</span> : null}
      </h2>
      <FieldError message={error} />
      <div className={cn(!error && 'mt-6')}>{children}</div>
    </section>
  );
}

export function SubQuestionSection({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col',
        feedbackFormClassNames.subQuestionBlockTop,
      )}
    >
      <h3 className={feedbackFormClassNames.subQuestionTitle}>{title}</h3>
      <div className='mt-6'>{children}</div>
    </div>
  );
}

export function FieldError({
  message,
}: {
  message: string | null | undefined;
}) {
  if (!message) return null;
  return (
    <p className={feedbackFormClassNames.fieldError} role='alert'>
      {message}
    </p>
  );
}

/** Checkbox + "기타" inline underline field */
const INLINE_UNDERLINE_INPUT =
  'typo-b2 min-h-[1.375rem] min-w-0 flex-1 max-w-[60%] resize-none overflow-hidden border-0 border-b border-[#74777D] bg-transparent px-0 py-[0.125rem] text-[#1A1A1A] placeholder:text-[#9EA4A9] focus:outline-none';

export function CheckboxOtherInlineRow({
  checked,
  onCheckedChange,
  label,
  placeholder,
  value,
  onChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    },
    [onChange],
  );

  return (
    <div className='flex w-full min-w-0 items-start gap-2'>
      <Checkbox
        className='mt-[0.25rem] shrink-0'
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
      />
      <span
        className={cn(feedbackFormClassNames.body, 'mt-[0.25rem] shrink-0')}
      >
        {label}
      </span>
      <textarea
        className={INLINE_UNDERLINE_INPUT}
        placeholder={placeholder}
        value={value}
        rows={1}
        onChange={handleChange}
      />
    </div>
  );
}

export function CheckboxChoiceRow({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className='flex cursor-pointer items-start gap-2'>
      <Checkbox
        className='mt-[0.125rem]'
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
      />
      <span className={feedbackFormClassNames.body}>{label}</span>
    </label>
  );
}

export function LongFormTextField(props: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  height?: string;
}) {
  return (
    <div className='w-full px-4'>
      <TextField
        placeholder={props.placeholder}
        height={props.height ?? '8rem'}
        value={props.value}
        maxLength={props.maxLength}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
