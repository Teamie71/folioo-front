'use client';

import { CommonModal } from '@/components/CommonModal';
import { CommonButton } from '@/components/CommonButton';
import { EventModalIcon } from '@/components/icons/EventModalIcon';
import type { TicketGrantNoticeResDTO } from '@/api/models';

export function EventModal({
  open,
  onOpenChange,
  notice,
  onButtonClick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: TicketGrantNoticeResDTO | null;
  onButtonClick?: () => void;
}) {
  const handleClick = () => {
    onButtonClick?.();
    onOpenChange(false);
  };

  if (!notice) return null;

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      primaryBtnText={
        typeof notice.ctaText === 'string' ? notice.ctaText : '확인'
      }
      onPrimaryClick={handleClick}
      className='w-full max-w-[40rem] items-center gap-[1.5rem] py-[3.75rem] text-center'
      footer={
        <CommonButton
          variantType='Execute'
          px='1.75rem'
          py='0.5rem'
          className='w-full rounded-[6.25rem] text-[1rem] font-bold'
          onClick={handleClick}
        >
          {typeof notice.ctaText === 'string' ? notice.ctaText : '확인'}
        </CommonButton>
      }
    >
      <div className='flex flex-col items-center gap-[0.75rem]'>
        <div className='flex justify-center'>
          <EventModalIcon />
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-[1.5rem] font-bold text-[#1A1A1A]'>
            {notice.payload?.displayReason || notice.title}
          </p>
          <p className='text-[1.5rem] font-bold text-[#1A1A1A]'>
            보상 지급 완료
          </p>
        </div>
        <div className='flex flex-col gap-[0.25rem]'>
          <div className='mt-[1rem] text-[1rem] text-[#1A1A1A]'>
            <p>{notice.body}이 지급되었어요.</p>
            <p>Folioo와 함께 경험을 강력한 서류로 만들어보세요.</p>
          </div>
          <div className='text-[0.75rem] text-[#74777D]'>
            <p>지급된 이용권은 일요일까지 사용 가능해요.</p>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
