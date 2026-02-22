'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { ModalFunctionButton } from '@/components/ModalFunctionButton';
import { CommonButton } from '@/components/CommonButton';
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

/* 카운팅 로직: 템플릿과 동일하게 라벨 제외 입력값 합만 표시. 태그 미포함. */
function getContentUserLength(content: string): number {
  if (!content.trim()) return 0;
  return content.split('\n').reduce((sum, line) => {
    const sep = line.indexOf(' - ');
    if (sep >= 0) return sum + line.slice(sep + 3).length;
    return sum + line.length;
  }, 0);
}

/** content를 라벨+텍스트 세그먼트로 파싱. 250자 초과 시 마지막 세그먼트 텍스트를 잘라서 다시 조합. */
function enforceContentUserMax(content: string, max: number): string {
  const lines = content.split('\n');
  const segments: { label: string; text: string }[] = lines.map((line) => {
    const sep = line.indexOf(' - ');
    if (sep >= 0)
      return { label: line.slice(0, sep), text: line.slice(sep + 3) };
    return { label: '', text: line };
  });
  const total = segments.reduce((s, seg) => s + seg.text.length, 0);
  if (total <= max) return content;
  let remain = total - max;
  for (let i = segments.length - 1; i >= 0 && remain > 0; i--) {
    const len = segments[i].text.length;
    if (len <= remain) {
      segments[i].text = '';
      remain -= len;
    } else {
      segments[i].text = segments[i].text.slice(0, len - remain);
      remain = 0;
    }
  }
  return segments
    .map((s) => (s.label ? `${s.label} - ${s.text}` : s.text))
    .join('\n');
}

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (data: { title: string; content: string }) => void;
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

  const handleSave = () => {
    onSave?.({ title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(enforceContentUserMax(e.target.value, MAX_CONTENT_LENGTH));
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
          'w-[50rem] max-w-[50rem] items-start gap-[1.25rem] px-[5rem] py-[3.75rem] text-left',
        )}
      >
        {/* 접근성을 위한 DialogTitle (시각적으로 숨김) */}
        <DialogTitle className='sr-only'>{title}</DialogTitle>

        {/* 커스텀 헤더: 제목, 날짜, 옵션 메뉴 */}
        <div className='flex w-full items-center gap-[1.25rem]'>
          {isEditing ? (
            <InputArea
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
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
                  getContentUserLength(editContent) >= COUNT_WARN_THRESHOLD &&
                    'text-[#DC0000]',
                )}
              >
                {getContentUserLength(editContent)}/{MAX_CONTENT_LENGTH}
              </div>
            </div>

            <div className='flex w-full translate-y-[-0.75rem] justify-end'>
              <CommonButton
                variantType='Primary'
                px='1.5rem'
                py='0.375rem'
                onClick={handleSave}
              >
                수정 완료
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
