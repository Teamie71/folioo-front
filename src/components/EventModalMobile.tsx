'use client';

import { CommonButton } from '@/components/CommonButton';
import { EventModalIcon } from '@/components/icons/EventModalIcon';
import { MobileBottomSheet } from '@/components/MobileBottomSheet';
import type { TicketGrantNoticeResDTO } from '@/api/models';

export function EventModalMobile({
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
    <MobileBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      zIndexClassName='z-[60]'
      heightClassName='h-auto'
      showCloseButton
      contentClassName='overflow-visible'
      contentBottomPaddingClassName='pb-[1rem]'
    >
      <div className='flex flex-col items-center'>
        <div className='flex h-[2.5rem] w-[2.5rem] justify-center mb-[1.5rem]'>
          <EventModalIcon />
        </div>
        <p className='text-[1.125rem] font-bold text-[#1A1A1A] text-center'>
          {notice.payload?.displayReason || notice.title}
        </p>
        <p className='text-[1.125rem] font-bold text-[#1A1A1A] text-center'>
          보상 지급 완료
        </p>
        <div className='mt-[1.25rem] flex flex-col items-center text-center'>
          <p className='text-[0.875rem] text-[#1A1A1A]'>{notice.body}이 지급되었어요.</p>
          <p className='text-[0.875rem] text-[#1A1A1A]'>
            Folioo와 함께 경험을 강력한 서류로 만들어보세요.
          </p>
          <p className='mt-[0.25rem] text-[0.75rem] text-[#74777D]'>
            지급된 이용권은 일요일까지 사용 가능해요.
          </p>
        </div>
        <CommonButton
          variantType='Execute'
          style={{ width: '20.5rem' }}
          className='mt-[2rem] rounded-[0.75rem] py-[0.75rem] text-[1rem] font-bold hover:bg-[#4352B3]'
          onClick={handleClick}
        >
          {typeof notice.ctaText === 'string' ? notice.ctaText : '확인'}
        </CommonButton>
      </div>
    </MobileBottomSheet>
  );
}
