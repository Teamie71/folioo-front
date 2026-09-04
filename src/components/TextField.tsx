import * as React from 'react';
import { cn } from '@/utils/utils';

export interface TextFieldProps extends Omit<
  React.ComponentProps<'textarea'>,
  'width' | 'height'
> {
  variant?: 'default' | 'wide';
  width?: string | number;
  height?: string | number;
}

const TextField = React.forwardRef<HTMLTextAreaElement, TextFieldProps>(
  (
    { className, variant = 'default', width, height, onChange, ...props },
    ref,
  ) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef =
      (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    const widthStyle = width
      ? typeof width === 'number'
        ? `${width}px`
        : width
      : '100%';

    const minHeightStyle = height
      ? typeof height === 'number'
        ? `${height}px`
        : height
      : undefined;

    const adjustHeight = React.useCallback(() => {
      const textarea =
        typeof textareaRef === 'function'
          ? internalRef.current
          : textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        const sh = textarea.scrollHeight;

        if (!textarea.value.trim()) {
          const linesCount = (textarea.placeholder || '').split('\n').length;

          textarea.style.height = `${sh}px`;
        } else {
          textarea.style.height = `${sh}px`;
        }
      }
    }, [textareaRef]);

    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight, props.value]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        adjustHeight();
        if (onChange) {
          onChange(e);
        }
      },
      [adjustHeight, onChange],
    );

    return (
      <textarea
        className={cn(
          'typo-text-field w-full resize-none bg-transparent text-gray9',
          'px-[1.25rem] py-[0.75rem]',
          'border border-gray6',
          'placeholder:text-gray6',
          variant === 'default' && 'rounded-[0.5rem] leading-[150%]',
          variant === 'wide' && 'rounded-[1rem] leading-[160%]',
          className,
        )}
        style={{
          width: widthStyle,
          minHeight: minHeightStyle,
          overflow: 'hidden',
        }}
        ref={
          typeof ref === 'function'
            ? ref
            : (node) => {
                internalRef.current = node;
                if (ref) {
                  (
                    ref as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = node;
                }
              }
        }
        rows={props.placeholder?.split('\n').length || 1}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

TextField.displayName = 'TextField';

export default TextField;
