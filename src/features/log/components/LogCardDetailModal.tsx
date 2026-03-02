'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { ModalFunctionButton } from '@/components/ModalFunctionButton';
import { CommonButton } from '@/components/CommonButton';
import { ButtonSpinnerIcon } from '@/components/icons/ButtonSpinnerIcon';
import InputArea from '@/components/InputArea';
import TextField from '@/components/TextField';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import EtcIcon from '@/components/icons/EtcIcon';
import { cn } from '@/utils/utils';

const MAX_CONTENT_LENGTH = 250;
const COUNT_WARN_THRESHOLD = 240;

/* 수정 모달: 라벨 포함 전체 글자수(엔터 1자 포함). 템플릿과 동일한 방식 */
function getContentFullLength(content: string): number {
  return content.length;
}

/* 250자 초과 시 앞쪽 250자만 유지 (라벨 포함 전체 기준) */
function enforceContentMaxLength(content: string, max: number): string {
  if (content.length <= max) return content;
  return content.slice(0, max);
}

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (data: { title: string; content: string }) => void | Promise<void>;
  isSaving?: boolean;
  saveError?: string | null;
  title: string;
  date: string;
  content: string;
  activityName: string;
  category: string;
}

export function LogDetailModal({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onSave,
  isSaving = false,
  saveError,
  title,
  date,
  content,
  activityName,
  category,
}: LogDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  // 모달이 열릴 때마다 초기값으로 리셋
  useEffect(() => {
    if (isOpen) {
      setEditTitle(title);
      setEditContent(content);
      setIsEditing(false);
    }
  }, [isOpen, title, content]);

  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.();
  };

  const handleSave = async () => {
    await onSave?.({ title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(enforceContentMaxLength(e.target.value, MAX_CONTENT_LENGTH));
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditContent(content);
    setIsEditing(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '대인관계':
        return (
          <div className='scale-90 text-[#74777D]'>
            <InterpersonIcon />
          </div>
        );
      case '문제해결':
        return (
          <div className='scale-90 text-[#74777D]'>
            <ProblemSolveIcon />
          </div>
        );
      case '학습':
        return (
          <div className='scale-90 text-[#74777D]'>
            <LearningIcon />
          </div>
        );
      case '레퍼런스':
        return (
          <div className='scale-90 text-[#74777D]'>
            <ReferenceIcon />
          </div>
        );
      case '기타':
      default:
        return (
          <div className='scale-90 text-[#74777D]'>
            <EtcIcon />
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          'w-[50rem] max-w-[50rem] items-start gap-[1.25rem] px-[5rem] text-left',
          isEditing ? 'px-[3.25rem] py-[1.75rem] pt-[3rem]' : 'py-[3.75rem]',
        )}
      >
        {/* 접근성을 위한 DialogTitle (시각적으로 숨김) */}
        <DialogTitle className='sr-only'>{title}</DialogTitle>

        {/* 커스텀 헤더: 제목, 날짜, 옵션 메뉴 */}
        <div className='flex w-full items-center gap-[1.25rem]'>
          {isEditing ? (
            <InputArea
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value.slice(0, 20))}
              maxLength={20}
              className='flex-1 text-[1.125rem] font-bold'
            />
          ) : (
            <h2 className='flex-1 text-[1.125rem] font-bold text-[#1A1A1A]'>
              {title}
            </h2>
          )}
          <div className='flex items-center gap-[1rem]'>
            <span className='w-[6.25rem] text-[1rem] text-[#74777D]'>
              {date}
            </span>
            {!isEditing && (
              <ModalFunctionButton onEdit={handleEdit} onDelete={onDelete} />
            )}
          </div>
        </div>

        {/* 내용 */}
        <div className='flex w-full flex-col gap-[1.5rem]'>
          {isEditing ? (
            <TextField
              variant='wide'
              value={editContent}
              onChange={handleContentChange}
              onKeyDown={(e) => {
                if (editContent.length >= MAX_CONTENT_LENGTH) {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    return;
                  }
                  if (
                    e.key.length === 1 &&
                    !e.ctrlKey &&
                    !e.metaKey &&
                    !e.altKey
                  ) {
                    const el = e.currentTarget;
                    const newContent =
                      editContent.slice(0, el.selectionStart) +
                      e.key +
                      editContent.slice(el.selectionEnd);
                    if (newContent.length > MAX_CONTENT_LENGTH) {
                      e.preventDefault();
                    }
                  }
                }
              }}
              onPaste={(e) => {
                const el = e.currentTarget;
                const pasted = e.clipboardData.getData('text/plain');
                const merged =
                  editContent.slice(0, el.selectionStart) +
                  pasted +
                  editContent.slice(el.selectionEnd);
                const truncated = enforceContentMaxLength(
                  merged,
                  MAX_CONTENT_LENGTH,
                );
                if (truncated !== merged) {
                  e.preventDefault();
                  setEditContent(truncated);
                }
              }}
              placeholder='내용을 입력하세요.'
            />
          ) : (
            <div className='text-[1rem] leading-[150%] whitespace-pre-line text-[#1A1A1A]'>
              {content}
            </div>
          )}
        </div>

        {/* 수정 중 */}
        {isEditing ? (
          <>
            <div className='flex w-full translate-y-[-0.75rem] items-center justify-between'>
              <div className='flex w-full translate-y-[0.75rem] justify-start gap-[0.5rem]'>
                <div className='rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                  {activityName}
                </div>
                {category && (
                  <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                    {getCategoryIcon(category)}
                    <span>{category}</span>
                  </div>
                )}
              </div>
              <div
                className={cn(
                  'text-right text-[0.875rem]',
                  getContentFullLength(editContent) >= COUNT_WARN_THRESHOLD &&
                    'text-[#DC0000]',
                )}
              >
                {getContentFullLength(editContent)}/{MAX_CONTENT_LENGTH}
              </div>
            </div>

            <div className='flex w-full translate-y-[-0.75rem] flex-col items-end gap-2'>
              {saveError && (
                <p className='w-full text-sm text-[#DC0000]'>{saveError}</p>
              )}
              <CommonButton
                variantType='Primary'
                px='1.5rem'
                py='0.375rem'
                style={{ width: '6.75rem', height: '2.25rem' }}
                className={
                  isSaving
                    ? '!bg-[#5060C5] disabled:!bg-[#5060C5] disabled:hover:!bg-[#404D9E]'
                    : undefined
                }
                onClick={handleSave}
                disabled={isSaving || !editTitle.trim() || !editContent.trim()}
              >
                {isSaving ? <ButtonSpinnerIcon size={24} /> : '수정 완료'}
              </CommonButton>
            </div>
          </>
        ) : (
          /* 보기 모드: 태그만 */
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-[0.5rem]'>
              <div className='rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                {activityName}
              </div>
              {category && (
                <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
