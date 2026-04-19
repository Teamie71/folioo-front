'use client';

import { CommonModal } from '@/components/CommonModal';
import { EventModalIcon } from '@/components/icons/EventModalIcon';

export function FeedbackSubmittedModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      closeButtonOnly
      className='w-full max-w-[40rem] items-center gap-[1.5rem] py-[3.75rem] text-center'
    >
      <div className='flex flex-col items-center gap-[0.75rem]'>
        <div className='flex justify-center'>
          <EventModalIcon />
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-[1.5rem] font-bold text-[#1A1A1A]'>
            피드백 제출 완료!
          </p>
        </div>
        <div className='mt-[1rem] flex flex-col gap-[0.25rem] text-[1rem] leading-[150%] text-[#1A1A1A]'>
          <p>소중한 의견을 남겨주셔서 감사합니다.</p>
          <p>보내주신 의견을 바탕으로 더 나은 Folioo를 만들어 나가겠습니다.</p>
          <p className='mt-[0.75rem]'>Folioo가 당신의 커리어를 응원해요!</p>
        </div>
      </div>
    </CommonModal>
  );
}
