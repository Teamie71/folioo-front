'use client';

import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { Checkbox } from '@/components/ui/CheckBox';
import TextField from '@/components/TextField';
import { cn } from '@/utils/utils';

export const feedbackFormClassNames = {
  questionTitle: 'typo-h5',
  subQuestionTitle: 'typo-h5',
  body: 'typo-b2',
  fieldError: 'typo-b2 mt-[8px] mb-[12px] ml-[1.25rem] text-error',
  answerStack: 'flex flex-col gap-[1.75rem] ml-[1.25rem]',
  subQuestionBlockTop: 'mt-[6.25rem]',
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
        {required ? <span className='text-error'> *</span> : null}
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
      <div className='mt-[1.75rem]'>{children}</div>
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

const INLINE_UNDERLINE_INPUT =
  'typo-b2 min-h-[1.375rem] min-w-0 flex-1 max-w-[60%] resize-none overflow-hidden border-0 border-b border-gray6 bg-transparent px-0 py-[0.125rem] text-gray9 placeholder:text-gray5 focus:outline-none';

export function CheckboxOtherInlineRow({
  checked,
  onCheckedChange,
  label,
  value,
  onChange,
  maxLength,
  active = false,
  onFocusInput,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  active?: boolean;
  onFocusInput?: () => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!checked) onCheckedChange(true);
      onChange(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    },
    [checked, onChange, onCheckedChange],
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
        className={cn(
          INLINE_UNDERLINE_INPUT,
          !active && 'opacity-50',
        )}
        value={value}
        rows={1}
        maxLength={maxLength}
        onFocus={onFocusInput}
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
    <div className='flex items-start gap-2'>
      <Checkbox
        className='mt-[0.125rem]'
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
      />
      <span className={feedbackFormClassNames.body}>{label}</span>
    </div>
  );
}

export function LongFormTextField(props: {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  height?: string;
}) {
  return (
    <div className='ml-[1.25rem] w-full'>
      <TextField
        className='text-gray9 placeholder:text-gray5'
        height={props.height ?? '8rem'}
        value={props.value}
        maxLength={props.maxLength}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
