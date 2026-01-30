'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChatFileUploader } from './ChatFileUploader';
import { ChatSendButton } from './ChatSendButton';
import { PdfIcon } from '@/components/icons/PdfIcon';

interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
}

interface FileItem {
  id: string;
  file: File;
  preview?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
}: ChatInputProps): React.ReactElement => {
  const contentRef = useRef<HTMLSpanElement>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);

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
    const text = contentRef.current?.textContent || '';
    onChange?.(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend?.();
    }
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    const newFiles: FileItem[] = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== fileId));
  };

  return (
    <div className='flex w-full flex-col gap-[0.75rem] rounded-[2rem] bg-[#FDFDFD] px-[1.5rem] py-[1rem] shadow-[0px_1px_4px_0px_#0000001A] shadow-[inset_0px_2px_4px_0px_#00000040]'>
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
                  <span className='text-[1rem] font-semibold text-[#1A1A1A]'>
                    {fileItem.file.name}
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
          <ChatSendButton onClick={onSend} />
        </div>
      </div>
    </div>
  );
};
