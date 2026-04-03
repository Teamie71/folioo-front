'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChatErrorMessage, type ChatErrorType } from './ChatErrorMessage';
import { ChatFileUploader } from './ChatFileUploader';
import { ChatSendButton } from './ChatSendButton';
import { ChatMention } from './ChatMention';
import { PdfIcon } from '@/components/icons/PdfIcon';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];
const MAX_CHARS = 250;

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
}

/* 전송/표시 시 멘션과 일반 텍스트 구분 */
export type ContentPart =
  | { type: 'mention'; title: string }
  | { type: 'text'; text: string };

function getContentParts(root: HTMLElement): ContentPart[] {
  const parts: ContentPart[] = [];
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (text.length > 0) parts.push({ type: 'text', text });
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.dataset.mention !== undefined) {
        parts.push({ type: 'mention', title: el.dataset.mention });
        return;
      }
      el.childNodes.forEach(walk);
    }
  }
  root.childNodes.forEach(walk);
  return parts;
}

interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (payload: {
    content: string;
    contentParts?: ContentPart[];
    files: FileItem[];
  }) => void;
  /* true면 전송 버튼 비활성화 */
  disabled?: boolean;
}

const MAX_TITLE_LENGTH = 15;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* 제목만 생략, 확장자(.pdf, .jpg 등)는 항상 표시 */
function truncateFileName(
  name: string,
  maxTitleLen: number = MAX_TITLE_LENGTH,
): string {
  const lastDot = name.lastIndexOf('.');
  if (lastDot <= 0) {
    return name.length <= maxTitleLen
      ? name
      : `${name.slice(0, maxTitleLen)}...`;
  }
  const title = name.slice(0, lastDot);
  const ext = name.slice(lastDot);
  if (title.length <= maxTitleLen) return name;
  return `${title.slice(0, maxTitleLen)}...${ext}`;
}

function getFileIcon(file: File) {
  if (file.type === 'application/pdf') {
    return <PdfIcon />;
  }
  if (file.type.startsWith('image/')) {
    return null; // 이미지는 미리보기로 표시
  }
  return null;
}

export const ChatInput = ({
  value = '',
  onChange,
  onSend,
  disabled = false,
}: ChatInputProps): React.ReactElement => {
  const contentRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);
  const [formatErrorShown, setFormatErrorShown] = useState(false);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionPos, setMentionPos] = useState<{
    left: number;
    bottom: number;
  } | null>(null);
  const [capacityErrorShown, setCapacityErrorShown] = useState(false);
  const [fileLimitErrorShown, setFileLimitErrorShown] = useState(false);
  const [charLimitToastShown, setCharLimitToastShown] = useState(false);

  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== value) {
      contentRef.current.textContent = value;
    }
  }, [value]);

  useEffect(() => {
    // 이미지 파일 미리보기 생성
    files.forEach((fileItem) => {
      if (fileItem.file.type.startsWith('image/') && !fileItem.preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles((prev) =>
            prev.map((item) =>
              item.id === fileItem.id
                ? { ...item, preview: e.target?.result as string }
                : item,
            ),
          );
        };
        reader.readAsDataURL(fileItem.file);
      }
    });
  }, [files]);

  const handleInput = () => {
    const el = contentRef.current;
    const text = el?.textContent || '';

    // 250자 초과 시 입력 차단 + 토스트 표시
    if (text.length > MAX_CHARS) {
      setCharLimitToastShown(true);
      const truncated = text.slice(0, MAX_CHARS);
      if (el) {
        el.textContent = truncated;
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      onChange?.(truncated);
      return;
    }

    // 내용이 완전히 비어 있으면 DOM도 비움 :empty placeholder가 다시 보이도록 처리
    if (el && text.length === 0) {
      el.innerHTML = '';
    }

    onChange?.(text);

    // @ 입력 감지
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const cursorNode = range.startContainer;

      // 커서가 멘션 span 내부에 있으면 무시
      const parentEl =
        cursorNode.nodeType === Node.TEXT_NODE
          ? cursorNode.parentElement
          : (cursorNode as Element);
      if (parentEl?.closest('[data-mention]')) return;

      // 현재 텍스트 노드에서만 @ 감지
      const nodeText =
        cursorNode.nodeType === Node.TEXT_NODE
          ? cursorNode.textContent || ''
          : '';
      const charBeforeCursor = nodeText.charAt(range.startOffset - 1);

      if (charBeforeCursor === '@' && containerRef.current) {
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setMentionPos({
          left: rect.left - containerRect.left - 12,
          bottom: containerRect.bottom - rect.top + 44,
        });
        setMentionOpen(true);
      } else if (mentionOpen) {
        const atIdx = nodeText.slice(0, range.startOffset).lastIndexOf('@');
        if (atIdx === -1) {
          setMentionOpen(false);
        }
      }
    }
  };

  const handleCloseMention = useCallback(() => {
    setMentionOpen(false);
    setMentionPos(null);
  }, []);

  const handleMentionSelect = useCallback(
    (title: string) => {
      setMentionOpen(false);
      setMentionPos(null);

      if (!contentRef.current) return;

      // 텍스트 노드에서 @ 찾기
      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
      );
      let targetNode: Text | null = null;
      let atOffset = -1;

      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        const idx = (node.textContent ?? '').lastIndexOf('@');
        if (idx !== -1) {
          targetNode = node;
          atOffset = idx;
        }
      }

      if (targetNode && atOffset !== -1) {
        // 멘션 인라인 요소 생성 (CommonButton Outline 스타일)
        const mentionEl = document.createElement('span');
        mentionEl.contentEditable = 'false';
        mentionEl.className =
          'inline-flex items-center rounded-[6.25rem] bg-[#F6F5FF] text-[#5060C5] border-[0.09375rem] border-[#5060C5] text-[0.875rem] font-semibold px-[1rem] py-[0.125rem] mx-[0.125rem] cursor-default align-baseline';
        mentionEl.textContent = `@ ${title}`;
        mentionEl.dataset.mention = title;

        // @ 위치에서 텍스트 분할 후 멘션 삽입
        const afterAt = targetNode.splitText(atOffset);
        afterAt.textContent = afterAt.textContent?.substring(1) || '';
        targetNode.parentNode?.insertBefore(mentionEl, afterAt);

        // 멘션 뒤에 공백 추가하여 계속 입력 가능하게
        const space = document.createTextNode('\u00A0');
        if (afterAt.textContent) {
          targetNode.parentNode?.insertBefore(space, afterAt);
        } else {
          afterAt.parentNode?.replaceChild(space, afterAt);
        }

        // 커서를 공백 뒤로 이동
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStartAfter(space);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }

      onChange?.(contentRef.current.textContent || '');
    },
    [onChange],
  );

  const canSend = (value.trim() !== '' || files.length > 0) && !disabled;

  const handleSend = () => {
    const root = contentRef.current;
    const content = root?.textContent?.trim() ?? '';
    const contentParts = root ? getContentParts(root) : [];
    if (!content && files.length === 0) return;
    onSend?.({ content, contentParts, files });
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Escape' && mentionOpen) {
      e.preventDefault();
      handleCloseMention();
      return;
    }
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      canSend
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    const allowed = selectedFiles.filter((f) =>
      ALLOWED_FILE_TYPES.includes(f.type),
    );
    const hasRejected = allowed.length < selectedFiles.length;
    if (hasRejected) setFormatErrorShown(true);

    // 개수 제한 체크 (최대 3개)
    if (files.length + allowed.length > 3) {
      setFileLimitErrorShown(true);
      return;
    }

    const currentTotal = files.reduce((sum, item) => sum + item.file.size, 0);
    let runningTotal = currentTotal;
    const toAdd: File[] = [];
    for (const f of allowed) {
      if (runningTotal + f.size > MAX_UPLOAD_BYTES) break;
      runningTotal += f.size;
      toAdd.push(f);
    }

    // 용량 초과로 일부 파일이 추가되지 않은 경우
    if (toAdd.length < allowed.length && !hasRejected) {
      setCapacityErrorShown(true);
    }

    const newItems: FileItem[] = toAdd.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    setFiles((prev) => [...prev, ...newItems]);
    if (!hasRejected && toAdd.length === allowed.length) {
      setFormatErrorShown(false);
      setCapacityErrorShown(false);
      setFileLimitErrorShown(false);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== fileId));
  };

  const totalBytes = files.reduce((sum, item) => sum + item.file.size, 0);
  const error: ChatErrorType | null = charLimitToastShown
    ? 'charLimit'
    : fileLimitErrorShown
      ? 'fileCountLimit'
      : capacityErrorShown || totalBytes > MAX_UPLOAD_BYTES
        ? 'capacity'
        : formatErrorShown
          ? 'format'
          : null;

  const [errorSuppressed, setErrorSuppressed] = useState(false);

  useEffect(() => {
    if (!error) {
      setErrorSuppressed(false);
      return;
    }
    setErrorSuppressed(false);
    const t = setTimeout(() => setErrorSuppressed(true), 2000);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    if (!formatErrorShown) return;
    const t = setTimeout(() => setFormatErrorShown(false), 2000);
    return () => clearTimeout(t);
  }, [formatErrorShown]);

  useEffect(() => {
    if (!capacityErrorShown) return;
    const t = setTimeout(() => setCapacityErrorShown(false), 2000);
    return () => clearTimeout(t);
  }, [capacityErrorShown]);

  useEffect(() => {
    if (!fileLimitErrorShown) return;
    const t = setTimeout(() => setFileLimitErrorShown(false), 2000);
    return () => clearTimeout(t);
  }, [fileLimitErrorShown]);

  useEffect(() => {
    if (!charLimitToastShown) return;
    const t = setTimeout(() => setCharLimitToastShown(false), 2000);
    return () => clearTimeout(t);
  }, [charLimitToastShown]);

  const showError = error && !errorSuppressed ? error : null;

  return (
    <div
      ref={containerRef}
      className='relative flex w-full flex-col gap-[0.75rem] rounded-[2rem] bg-[#FDFDFD] px-[1.5rem] py-[1rem] shadow-[0px_1px_4px_0px_#0000001A] shadow-[inset_0px_2px_4px_0px_#00000040] hover:cursor-text'
    >
      {/* @ 멘션 팝업 */}
      {mentionOpen && mentionPos && (
        <div
          className='absolute z-50'
          style={{
            left: mentionPos.left,
            bottom: mentionPos.bottom,
          }}
        >
          <ChatMention onSelect={handleMentionSelect} />
        </div>
      )}
      <ChatErrorMessage error={showError} positionAboveRight />
      {/* 채팅창 안 파일 카드 */}
      {files.length > 0 && (
        <div className='flex flex-wrap gap-[0.75rem]'>
          {files.map((fileItem) => {
            const isImage = fileItem.file.type.startsWith('image/');
            const isPdf = fileItem.file.type === 'application/pdf';
            return (
              <div
                key={fileItem.id}
                className='relative flex h-[4.125rem] w-[17.875rem] items-center gap-[0.75rem] rounded-[0.75rem] border border-[#D1D5DB] bg-white px-[1rem] py-[0.75rem]'
                onMouseEnter={() => setHoveredFileId(fileItem.id)}
                onMouseLeave={() => setHoveredFileId(null)}
              >
                {/* 아이콘 또는 이미지 미리보기 */}
                {isImage && fileItem.preview ? (
                  <div className='h-[2.5rem] w-[2.5rem] shrink-0 overflow-hidden'>
                    <Image
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      width={40}
                      height={40}
                      className='h-full w-full object-cover'
                    />
                  </div>
                ) : isPdf ? (
                  <div className='shrink-0'>{getFileIcon(fileItem.file)}</div>
                ) : null}

                {/* 파일 정보 */}
                <div className='flex flex-col'>
                  <span
                    className='truncate text-[1rem] font-semibold text-[#1A1A1A]'
                    title={fileItem.file.name}
                  >
                    {truncateFileName(fileItem.file.name)}
                  </span>
                  <span className='text-[0.75rem] text-[#74777D]'>
                    {formatFileSize(fileItem.file.size)}
                  </span>
                </div>

                {/* 닫기 버튼 (카드 오른쪽 위, hover 시 나타남) */}
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(fileItem.id);
                  }}
                  className={`absolute top-[0.5rem] right-[0.5rem] flex items-center justify-center rounded-[0.25rem] bg-[#6B7280] p-[0.25rem] transition-opacity ${hoveredFileId === fileItem.id ? 'opacity-100' : 'opacity-0'}`}
                  aria-label='파일 제거'
                >
                  <img
                    src='/FileClose.svg'
                    alt=''
                    width={18}
                    height={18}
                    className='block cursor-pointer'
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 입력 영역 */}
      <div className='flex w-full items-end gap-[0.75rem]'>
        <span
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className='font-regular min-h-[1.5rem] w-full flex-1 border-none bg-transparent text-[1rem] break-words whitespace-pre-wrap outline-none empty:before:text-[#74777D] empty:before:content-[attr(data-placeholder)]'
          data-placeholder='답변을 입력하거나 @를 입력하여 인사이트 로그를 멘션하세요.'
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
        <div className='flex shrink-0 items-center gap-[0.5rem]'>
          <ChatFileUploader onFileSelect={handleFileSelect} />
          <ChatSendButton onClick={handleSend} disabled={!canSend} />
        </div>
      </div>
    </div>
  );
};
