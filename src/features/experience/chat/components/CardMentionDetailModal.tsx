'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { CommonButton } from '@/components/CommonButton';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import EtcIcon from '@/components/icons/EtcIcon';

interface CardMentionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMention?: (title: string) => void;
  title: string;
  date: string;
  content: string;
  activityName: string;
  category: string;
}

export function CardMentionDetailModal({
  isOpen,
  onClose,
  onMention,
  title,
  date,
  content,
  activityName,
  category,
}: CardMentionDetailModalProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '대인관계':
        return (
          <div className=''>
            <InterpersonIcon />
          </div>
        );
      case '문제해결':
        return (
          <div className=''>
            <ProblemSolveIcon />
          </div>
        );
      case '학습':
        return (
          <div className=''>
            <LearningIcon />
          </div>
        );
      case '레퍼런스':
        return (
          <div className=''>
            <ReferenceIcon />
          </div>
        );
      case '기타':
      default:
        return (
          <div className=''>
            <EtcIcon />
          </div>
        );
    }
  };

  const handleMention = () => {
    onMention?.(title);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='w-[50rem] max-w-[50rem] items-start gap-[1.25rem] px-[5rem] py-[3.75rem] text-left'>
        <DialogTitle className='sr-only'>{title}</DialogTitle>

        {/* 헤더: 제목, 날짜 */}
        <div className='flex w-full items-center gap-[1.25rem]'>
          <h2 className='flex-1 text-[1.5rem] font-bold text-[#1A1A1A]'>
            {title}
          </h2>
          <span className='text-[1rem] text-[#74777D]'>{date}</span>
        </div>

        {/* 내용 */}
        <div className='flex w-full flex-col gap-[1.5rem]'>
          <div className='text-[1rem] leading-[150%] whitespace-pre-line text-[#1A1A1A]'>
            {content}
          </div>
        </div>

        {/* 태그 + 멘션하기 버튼 */}
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

          {/* 멘션하기 버튼 */}
          <CommonButton
            variantType='Execute'
            px='1.5rem'
            py='0.5rem'
            onClick={handleMention}
          >
            멘션하기
          </CommonButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
