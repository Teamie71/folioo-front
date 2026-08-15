'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { registerEditSessionHandlers, notifyEditSessionChanged } from '@/features/experience/list/utils/editSessionUndo';
import { cn } from '@/utils/utils';

type Props = {
  value: string;
  editable: boolean;
  onCommit: (next: string) => void;
  onEnter?: (draft: string, start: number, end: number) => void;
  requestEdit?: boolean;
  requestEditCaret?: number;
  requestEditSelectAll?: boolean;
  onRequestEditHandled?: () => void;
  className?: string;
  inputClassName?: string;
  as?: 'span' | 'h1' | 'h3';
  placeholder?: string;
  editOn?: 'click' | 'doubleClick';
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
  requestEdit = false,
  requestEditCaret = 0,
  requestEditSelectAll = false,
  onRequestEditHandled,
  className,
  inputClassName,
  as = 'span',
  placeholder,
  editOn = 'doubleClick',
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const caretRef = useRef<number | null>(null);
  const selectAllRef = useRef(false);
  const skipBlurRef = useRef(false);
  const draftPastRef = useRef<string[]>([]);
  const draftFutureRef = useRef<string[]>([]);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const clearDraftHistory = () => {
    draftPastRef.current = [];
    draftFutureRef.current = [];
  };

  useEffect(() => {
    setDraft(value);
    clearDraftHistory();
  }, [value]);

  useEffect(() => {
    if (!requestEdit || !editable) return;
    selectAllRef.current = requestEditSelectAll;
    caretRef.current = requestEditSelectAll ? null : requestEditCaret;
    clearDraftHistory();
    setEditing(true);
    onRequestEditHandled?.();
  }, [requestEdit, editable, requestEditCaret, requestEditSelectAll]);

  useEffect(() => {
    if (!editing) return;

    const applyDraft = (next: string) => {
      caretRef.current = next.length;
      setDraft(next);
    };

    return registerEditSessionHandlers({
      canUndo: () => draftPastRef.current.length > 0,
      canRedo: () => draftFutureRef.current.length > 0,
      undo: () => {
        const prev = draftPastRef.current.pop();
        if (prev == null) {
          skipBlurRef.current = true;
          setEditing(false);
          return false;
        }
        draftFutureRef.current.push(draftRef.current);
        applyDraft(prev);
        return true;
      },
      redo: () => {
        const next = draftFutureRef.current.pop();
        if (next == null) return false;
        draftPastRef.current.push(draftRef.current);
        applyDraft(next);
        return true;
      },
    });
  }, [editing]);

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
    if (selectAllRef.current) {
      selectAllRef.current = false;
      el.focus();
      el.setSelectionRange(0, el.value.length);
      return;
    }
    if (caretRef.current != null) {
      const offset = Math.min(Math.max(caretRef.current, 0), el.value.length);
      el.focus();
      el.setSelectionRange(offset, offset);
      caretRef.current = null;
      return;
    }
    if (document.activeElement !== el) el.focus();
  }, [editing, draft]);

  const commit = () => {
    setEditing(false);
    clearDraftHistory();
    if (!draft.trim()) {
      setDraft(value);
      return;
    }
    if (draft !== value) onCommit(draft);
    else setDraft(value);
  };

  const cancel = () => {
    skipBlurRef.current = true;
    clearDraftHistory();
    setDraft(value);
    setEditing(false);
  };

  const undoFromSession = () => {
    const prev = draftPastRef.current.pop();
    if (prev != null) {
      draftFutureRef.current.push(draft);
      caretRef.current = prev.length;
      setDraft(prev);
      notifyEditSessionChanged();
      return;
    }
    skipBlurRef.current = true;
    setEditing(false);
    useExperienceListStore.getState().undo();
  };

  const redoFromSession = () => {
    const next = draftFutureRef.current.pop();
    if (next != null) {
      draftPastRef.current.push(draft);
      caretRef.current = next.length;
      setDraft(next);
      notifyEditSessionChanged();
      return;
    }
    useExperienceListStore.getState().redo();
  };

  const startEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!editable) return;
    clearDraftHistory();
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
  };

  if (editing && editable) {
    return (
      <textarea
        ref={inputRef}
        rows={1}
        value={draft}
        onChange={(e) => {
          draftPastRef.current.push(draft);
          draftFutureRef.current = [];
          setDraft(e.target.value);
          notifyEditSessionChanged();
        }}
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
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;

          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            if (e.shiftKey) redoFromSession();
            else undoFromSession();
            return;
          }

          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (onEnter) {
              const start = e.currentTarget.selectionStart ?? draft.length;
              const end = e.currentTarget.selectionEnd ?? draft.length;
              skipBlurRef.current = true;
              clearDraftHistory();
              setEditing(false);
              onEnter(draft, start, end);
            } else {
              skipBlurRef.current = true;
              commit();
            }
            return;
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
        }}
        placeholder={placeholder}
        className={cn(
          'm-0 box-border block w-full min-w-0 flex-1 resize-none overflow-hidden border-0 bg-transparent p-0 font-[inherit] leading-[inherit] tracking-[inherit] break-words whitespace-pre-wrap outline-none',
          className,
          inputClassName,
        )}
        style={{ padding: 0, margin: 0 }}
      />
    );
  }

  const Tag = as;
  return (
    <Tag
      className={cn(
        'whitespace-pre-wrap',
        className,
        editable && editOn === 'click' && 'cursor-text',
      )}
      onClick={editOn === 'click' ? startEdit : undefined}
      onDoubleClick={editOn === 'doubleClick' ? startEdit : undefined}
    >
      {value || placeholder}
    </Tag>
  );
}
