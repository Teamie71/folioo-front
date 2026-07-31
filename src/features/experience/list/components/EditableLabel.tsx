'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/utils/utils';

type Props = {
  value: string;
  editable: boolean;
  onCommit: (next: string) => void;
  onEnter?: (draft: string) => void;
  /** true면 위계 이동 성공 */
  onTab?: (
    draft: string,
    direction: 'indent' | 'outdent',
    caret: number,
  ) => boolean;
  requestEdit?: boolean;
  requestEditCaret?: number;
  onRequestEditHandled?: () => void;
  className?: string;
  inputClassName?: string;
  as?: 'span' | 'h1' | 'h3';
  placeholder?: string;
};

function caretOffsetFromPoint(
  root: HTMLElement,
  clientX: number,
  clientY: number,
): number | null {
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null;
  };

  try {
    if (typeof doc.caretRangeFromPoint === 'function') {
      const range = doc.caretRangeFromPoint(clientX, clientY);
      if (!range || !root.contains(range.startContainer)) return null;
      const pre = document.createRange();
      pre.selectNodeContents(root);
      pre.setEnd(range.startContainer, range.startOffset);
      return pre.toString().length;
    }
    if (typeof doc.caretPositionFromPoint === 'function') {
      const pos = doc.caretPositionFromPoint(clientX, clientY);
      if (!pos || !root.contains(pos.offsetNode)) return null;
      const pre = document.createRange();
      pre.selectNodeContents(root);
      pre.setEnd(pos.offsetNode, pos.offset);
      return pre.toString().length;
    }
  } catch {
    return null;
  }
  return null;
}

export function EditableLabel({
  value,
  editable,
  onCommit,
  onEnter,
  onTab,
  requestEdit = false,
  requestEditCaret = 0,
  onRequestEditHandled,
  className,
  inputClassName,
  as = 'span',
  placeholder,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const caretRef = useRef<number | null>(null);
  const skipBlurRef = useRef(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!requestEdit || !editable) return;
    caretRef.current = requestEditCaret;
    setEditing(true);
    onRequestEditHandled?.();
  }, [requestEdit, editable, requestEditCaret]);

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
    const len = el.value.length;
    const offset = Math.min(Math.max(caretRef.current ?? len, 0), len);
    el.setSelectionRange(offset, offset);
    caretRef.current = null;
  }, [editing]);

  useLayoutEffect(() => {
    if (editing) resize();
  }, [draft, editing]);

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== value) onCommit(next);
    else setDraft(value);
  };

  if (editing && editable) {
    return (
      <textarea
        ref={inputRef}
        rows={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (skipBlurRef.current) {
            skipBlurRef.current = false;
            return;
          }
          commit();
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (onEnter) {
              skipBlurRef.current = true;
              setEditing(false);
              onEnter(draft);
            } else {
              commit();
            }
            return;
          }
          if (e.key === 'Tab' && onTab) {
            e.preventDefault();
            const caret = e.currentTarget.selectionStart ?? draft.length;
            const moved = onTab(
              draft,
              e.shiftKey ? 'outdent' : 'indent',
              caret,
            );
            if (moved) {
              skipBlurRef.current = true;
              setEditing(false);
            }
            return;
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            setDraft(value);
            setEditing(false);
          }
        }}
        placeholder={placeholder}
        className={cn(
          'm-0 block w-full min-w-0 flex-1 resize-none overflow-hidden border-0 bg-transparent p-0 break-words outline-none',
          inputClassName,
        )}
      />
    );
  }

  const Tag = as;
  return (
    <Tag
      className={className}
      onDoubleClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!editable) return;
        if (value) {
          caretRef.current = caretOffsetFromPoint(
            e.currentTarget,
            e.clientX,
            e.clientY,
          );
        } else {
          caretRef.current = 0;
        }
        setEditing(true);
      }}
    >
      {value || placeholder}
    </Tag>
  );
}
