'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface ChatCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEndConversation?: () => void;
  onContinueWithCredits?: () => void;
}

export const ChatCompleteModal = ({
  open,
  onOpenChange,
  onEndConversation,
  onContinueWithCredits,
}: ChatCompleteModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='w-[41.375rem] items-center gap-[1.75rem] px-[5rem] py-[3.75rem] text-center [&>button:last-child]:hidden'
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className='flex flex-col items-center justify-center gap-[1rem]'>
          <DialogTitle className='text-center text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
            대화의 모든 단계가 완료되었어요!
            <br />더 풍부한 경험 정리를 위해 대화를 더 진행할까요?
          </DialogTitle>
        </DialogHeader>

        <div className='flex justify-center gap-[1.5rem]'>
          <button
            className='w-[14.875rem] cursor-pointer rounded-[0.5rem] border border-[#74777D] bg-white px-[2.25rem] py-[0.75rem] text-[0.875rem] text-[#1A1A1A] hover:bg-[#F6F8FA]'
            onClick={onEndConversation}
          >
            대화 종료하고
            <br />
            텍스트형 포트폴리오 생성하기
          </button>
          <button
            className='w-[14.875rem] cursor-pointer rounded-[0.5rem] border border-[#74777D] bg-white px-[2.25rem] py-[0.75rem] text-[0.875rem] text-[#1A1A1A] hover:bg-[#F6F8FA]'
            onClick={onContinueWithCredits}
          >
            3턴의 대화 계속하기
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
