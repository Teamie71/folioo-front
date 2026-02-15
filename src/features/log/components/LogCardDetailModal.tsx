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
              className='flex-1 text-[1.5rem] font-bold'
            />
          ) : (
            <h2 className='flex-1 text-[1.5rem] font-bold text-[#1A1A1A]'>
              {title}
            </h2>
          )}
          <div className='flex items-center gap-[1rem]'>
            <span className='text-[1rem] text-[#74777D]'>{date}</span>
            <ModalFunctionButton onEdit={handleEdit} onDelete={onDelete} />
          </div>
        </div>

        {/* 내용 */}
        <div className='flex w-full flex-col gap-[1.5rem]'>
          {isEditing ? (
            <TextField
              variant='wide'
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder='내용을 입력하세요.'
            />
          ) : (
            <div className='text-[1rem] leading-[150%] whitespace-pre-line text-[#1A1A1A]'>
              {content}
            </div>
          )}
        </div>

        {/* 태그 및 수정 완료 버튼 */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-[0.5rem]'>
            <div className='rounded-[3.75rem] border border-[#CDD0D5] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
              {activityName}
            </div>

            {category && (
              <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                {getCategoryIcon(category)}
                <span>{category}</span>
              </div>
            )}
          </div>

          {/* 수정 완료 버튼 (편집 모드일 때만 표시) */}
          {isEditing && (
            <CommonButton
              variantType='Primary'
              px='1.5rem'
              py='0.375rem'
              onClick={handleSave}
            >
              수정 완료
            </CommonButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
