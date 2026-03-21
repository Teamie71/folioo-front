'use client';

import { useState, useEffect } from 'react';
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
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';

const MAX_CONTENT_LENGTH = 250;
const COUNT_WARN_THRESHOLD = 240;

function getContentFullLength(content: string): number {
  return content.length;
}

function enforceContentMaxLength(content: string, max: number): string {
  if (content.length <= max) return content;
  return content.slice(0, max);
}

interface MobileLogDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onSave?: (data: { title: string; content: string }) => void | Promise<void>;
  isSaving?: boolean;
  saveError?: string | null;
  otherLogTitles?: string[];
  title: string;
  date: string;
  content: string;
  activityName: string;
  category: string;
}

export function MobileLogDetailView({
  isOpen,
  onClose,
  onDelete,
  onSave,
  isSaving = false,
  saveError,
  otherLogTitles = [],
  title,
  date,
  content,
  activityName,
  category,
}: MobileLogDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  const isTitleDuplicate =
    editTitle.trim() !== '' &&
    otherLogTitles.some((t) => t.trim() === editTitle.trim());

  useEffect(() => {
    if (isOpen) {
      setEditTitle(title);
      setEditContent(content);
      setIsEditing(false);
    }
  }, [isOpen, title, content]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await onSave?.({ title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(enforceContentMaxLength(e.target.value, MAX_CONTENT_LENGTH));
  };

  const handleCancel = () => {
    if (isEditing) {
      setEditTitle(title);
      setEditContent(content);
      setIsEditing(false);
    } else {
      onClose();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '대인관계':
        return <InterpersonIcon />;
      case '문제해결':
        return <ProblemSolveIcon />;
      case '학습':
        return <LearningIcon />;
      case '레퍼런스':
        return <ReferenceIcon />;
      default:
        return <EtcIcon />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-white'>
      {/* 헤더 */}
      <div className='bg-sub1 px-[1.25rem] py-[1.5rem]'>
        <div className='flex items-start justify-between'>
          {isEditing ? (
            <input
              type='text'
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value.slice(0, 20))}
              className='w-[calc(100%-3rem)] rounded-[0.5rem] border border-[#74777D] bg-white px-[1rem] py-[0.75rem] text-[1.125rem] font-bold outline-none focus:border-[#5060C5]'
              placeholder='제목 입력'
            />
          ) : (
            <h2 className='flex-1 pr-4 text-[1.125rem] font-bold text-[#1A1A1A]'>
              {title}
            </h2>
          )}
          <ModalFunctionButton
            onEdit={handleEdit}
            onDelete={onDelete}
            className={isEditing ? 'mt-3' : ''}
          />
        </div>
        <div className='mt-[0.5rem] text-[1rem] text-[#74777D]'>{date}</div>
      </div>

      {/* 내용 */}
      <div className='flex flex-1 flex-col gap-[1.25rem] bg-white px-[1.25rem] py-[2rem]'>
        {/* 태그 */}
        <div className='flex flex-wrap items-center gap-[0.5rem]'>
          <div className='rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
            {activityName}
          </div>
          {category && (
            <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
              <div className='flex scale-75 items-center justify-center text-[#74777D]'>
                {getCategoryIcon(category)}
              </div>
              <span>{category}</span>
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className='mt-[0.5rem]'>
          {isEditing ? (
            <div className='flex flex-col gap-[0.75rem]'>
              <textarea
                value={editContent}
                onChange={handleContentChange}
                className='min-h-[16rem] w-full resize-none rounded-[1.25rem] border border-[#74777D] p-[1.25rem] text-[1rem] leading-[1.6] outline-none focus:border-[#5060C5]'
                placeholder='내용을 입력하세요.'
              />
              <div className='flex items-center justify-between'>
                <p
                  className={cn(
                    'text-[0.875rem] text-[#DC0000]',
                    !isTitleDuplicate && 'invisible',
                  )}
                >
                  인사이트 로그의 제목은 중복 될 수 없어요.
                </p>
                <div
                  className={cn(
                    'text-[0.875rem]',
                    getContentFullLength(editContent) >= COUNT_WARN_THRESHOLD
                      ? 'text-[#DC0000]'
                      : 'text-[#9EA4A9]',
                  )}
                >
                  {getContentFullLength(editContent)} / {MAX_CONTENT_LENGTH}
                </div>
              </div>

              {saveError && (
                <p className='text-[0.875rem] text-[#DC0000]'>{saveError}</p>
              )}

              <div className='mt-[1.5rem] flex justify-center'>
                <CommonButton
                  variantType='Primary'
                  className={cn(
                    'h-[2.25rem] w-[6.75rem]',
                    isSaving && '!bg-[#5060C5] disabled:!bg-[#5060C5]',
                  )}
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    !editTitle.trim() ||
                    !editContent.trim() ||
                    isTitleDuplicate
                  }
                >
                  {isSaving ? <ButtonSpinnerIcon size={24} /> : '수정 완료'}
                </CommonButton>
              </div>
            </div>
          ) : (
            <div className='text-[1rem] leading-[1.8] whitespace-pre-line text-[#1A1A1A]'>
              {content}
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <button
          onClick={onClose}
          className='fixed right-[1.25rem] bottom-[2rem] flex h-12 w-12 items-center justify-center rounded-full bg-white/50 shadow-md md:hidden'
          title='닫기'
        >
          <ChevronLeftIcon />
        </button>
      )}
    </div>
  );
}
