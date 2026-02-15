'use client';

import { CommonModal } from '@/components/CommonModal';
import { CommonButton } from '@/components/CommonButton';
import { EventModalIcon } from '@/components/icons/EventModalIcon';

export function EventModal({
  open,
  onOpenChange,
  eventName,
  reward,
  buttonText,
  onButtonClick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 이벤트명 (예: 인사이트 로그 작성 챌린지) */
  eventName: string;
  /** 지급된 보상 내용 (예: 경험 정리 1회권) */
  reward: string;
  /** 하단 CTA 버튼 문구 */
  buttonText: string;
  onButtonClick?: () => void;
}) {
  const handleClick = () => {
    onButtonClick?.();
    onOpenChange(false);
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      primaryBtnText={buttonText}
      onPrimaryClick={handleClick}
      className='max-w-[40rem] w-full items-center gap-[1.5rem] py-[3.75rem] text-center'
      footer={
        <CommonButton
          variantType='Execute'
          px='1.75rem'
          py='0.5rem'
          className='w-full rounded-[6.25rem] text-[1rem] font-bold'
          onClick={handleClick}
        >
          {buttonText}
        </CommonButton>
      }
    >
      <div className='flex flex-col items-center gap-[0.75rem]'>
        <div className='flex justify-center'>
          <EventModalIcon />
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-[1.5rem] font-bold text-[#1A1A1A]'>{eventName}</p>
          <p className='text-[1.5rem] font-bold text-[#1A1A1A]'>보상 지급 완료</p>
        </div>
        <div className='flex flex-col gap-[0.25rem]'>
          <div className='text-[1rem] text-[#1A1A1A] mt-[1rem]'>
            <p>{reward}이 지급되었어요.</p>
            <p>Folioo와 함께 경험을 강력한 서류로 만들어보세요.</p>
          </div>
          <div className='text-[0.75rem] text-[#74777D]'>
            <p>지급된 이용권은 6개월 간 사용 가능해요.</p>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
