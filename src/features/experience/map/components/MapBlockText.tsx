'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/utils/utils';

type Props = {
  value: string;
  placeholder: string;
  editable: boolean;
  maxLength: number;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onCommit: (next: string) => void;
};

/**
 * 맵 뷰 블록의 텍스트 표시 · 편집 영역.
 *
 * 리스트 뷰의 EditableLabel과 달리
 * - 최대 글자수를 넘어서면 입력이 진행되지 않는다.
 * - 빈 값도 그대로 저장하고 placeholder를 보여준다. (블록은 삭제되지 않는다)
 */
export function MapBlockText({
  value,
  placeholder,
  editable,
  maxLength,
  editing,
  onEditingChange,
  onCommit,
}: Props) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const skipBlurRef = useRef(false);

  /*
   * 이미 제한을 넘는 텍스트는 잘라내지 않는다.
   *
   * 기존 경험 정리 산출물에서 옮겨 온 활동명·본문은 20자/500자를 넘길 수 있는데,
   * 그대로 maxLength를 적용하면 한 글자만 지워도 나머지가 통째로 날아간다.
   * 화면설계서의 규칙은 "초과 시 입력 진행 불가"이므로, 더 늘리지 못하게만 막고
   * 기존 내용은 보존한다. (편집으로 제한 안까지 줄이면 다시 원래 제한이 적용된다)
   */
  const effectiveMaxLength = Math.max(maxLength, value.length);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const resize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    if (!editing) return;
    resize();
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [editing]);

  const commit = () => {
    onEditingChange(false);
    if (draft !== value) onCommit(draft);
  };

  const cancel = () => {
    skipBlurRef.current = true;
    setDraft(value);
    onEditingChange(false);
  };

  if (editing && editable) {
    return (
      <textarea
        ref={inputRef}
        rows={1}
        value={draft}
        maxLength={effectiveMaxLength}
        className={cn(
          'nodrag nopan nowheel typo-c1 text-gray9 m-0 block w-full resize-none',
          'overflow-hidden border-0 bg-transparent p-0 leading-[inherit]',
          'break-words whitespace-pre-wrap outline-none',
        )}
        onChange={(e) => {
          setDraft(e.target.value.slice(0, effectiveMaxLength));
          resize();
        }}
        onBlur={() => {
          if (skipBlurRef.current) {
            skipBlurRef.current = false;
            return;
          }
          commit();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;

          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            skipBlurRef.current = true;
            commit();
            return;
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
        }}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      className={cn(
        'typo-c1 block break-words whitespace-pre-wrap',
        value ? 'text-gray9' : 'text-gray5',
        editable && 'cursor-text',
      )}
    >
      {value || placeholder}
    </span>
  );
}
