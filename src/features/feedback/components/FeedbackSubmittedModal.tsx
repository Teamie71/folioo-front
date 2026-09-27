'use client';

import { useRouter } from 'next/navigation';

import { CommonModal } from '@/components/CommonModal';
import { EventModalIcon } from '@/components/icons/EventModalIcon';

export function FeedbackSubmittedModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      router.back();
    }
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={handleOpenChange}
      closeButtonOnly
      className='w-[calc(100%-2rem)] max-w-[40rem] items-center gap-0 rounded-[1.5rem] px-6 py-10 text-center md:px-[5rem] md:py-[3.75rem]'
    >
      <div className='flex w-full flex-col items-center gap-[1.75rem]'>
        <div className='flex flex-col items-center gap-3'>
          <EventModalIcon />
          <p className='typo-h3 text-gray9'>피드백 제출 완료!</p>
        </div>
        <div className='typo-b2 text-gray9 flex flex-col items-center'>
          <p>소중한 의견을 남겨주셔서 감사합니다.</p>
          <p>보내주신 의견을 바탕으로 더 나은 Folioo를 만들어 나가겠습니다.</p>
        </div>
        <p className='typo-b2 text-gray9'>Folioo가 당신의 커리어를 응원해요!</p>
      </div>
    </CommonModal>
  );
}
