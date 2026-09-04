'use client';

import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { Checkbox } from '@/components/ui/CheckBox';
import TextField from '@/components/TextField';
import {
  FEEDBACK_TEXT_FIELD_HEIGHT,
  FEEDBACK_TEXT_FIELD_RADIUS_CLASS,
} from '../constants';
import { cn } from '@/utils/utils';

export const feedbackFormClassNames = {
  questionTitle: 'typo-h5',
  body: 'typo-b2',
  fieldError: 'typo-b2 mt-[8px] mb-[12px] ml-[1.25rem] text-error',
  answerStack: 'flex flex-col gap-[1.75rem] ml-[1.25rem]',
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
  'typo-b2 min-h-[1.375rem] min-w-0 flex-1 max-w-[60%] resize-none overflow-hidden border-0 border-b border-gray6 bg-transparent px-0 py-[0.125rem] text-gray9 placeholder:text-gray6 focus:outline-none';

export function CheckboxOtherInlineRow({
  checked,
  onCheckedChange,
  label,
  value,
  onChange,
  maxLength,
  active = false,
  onFocusInput,
  placeholder,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  active?: boolean;
  onFocusInput?: () => void;
  placeholder?: string;
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
    <div
      className='flex w-full min-w-0 cursor-pointer items-start gap-2'
      onClick={(e) => {
        e.preventDefault();
        if (!checked) onCheckedChange(true);
      }}
    >
      <Checkbox
        className='mt-[0.25rem] shrink-0'
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
        onClick={(e) => e.stopPropagation()}
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
        onClick={(e) => e.stopPropagation()}
        onChange={handleChange}
        placeholder={placeholder}
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
    <div
      className='flex cursor-pointer items-start gap-2'
      onClick={(e) => {
        e.preventDefault();
        onCheckedChange(true);
      }}
    >
      <Checkbox
        className='mt-[0.125rem]'
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
        onClick={(e) => e.stopPropagation()}
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
  placeholder?: string;
}) {
  return (
    <div className='ml-[1.25rem] w-full'>
      <TextField
        className={cn(
          FEEDBACK_TEXT_FIELD_RADIUS_CLASS,
          'typo-text-field text-gray9 placeholder:text-gray5',
        )}
        height={props.height ?? FEEDBACK_TEXT_FIELD_HEIGHT}
        value={props.value}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
