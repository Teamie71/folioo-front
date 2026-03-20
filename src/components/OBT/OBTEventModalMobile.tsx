'use client';

import { CommonButton } from '@/components/CommonButton';
import { EventModalIcon } from '@/components/icons/EventModalIcon';
import { MobileBottomSheet } from '@/components/MobileBottomSheet';

export function OBTEventModalMobile({
  open,
  onOpenChange,
  eventTitle,
  eventSubTitle,
  reward,
  rewardMessage,
  subMessage,
  validityMessage,
  buttonText,
  onButtonClick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventSubTitle: string;
  reward: string;
  rewardMessage?: string;
  subMessage?: string;
  validityMessage?: string;
  buttonText: string;
  onButtonClick?: () => void;
}) {
  const handleClick = () => {
    onButtonClick?.();
    onOpenChange(false);
  };

  const replaceReward = (text: string) => text.replace(/\{reward\}/g, reward);

  return (
    <MobileBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      zIndexClassName='z-[60]'
      heightClassName='h-auto'
      showCloseButton
      contentClassName='overflow-visible'
    >
      <div className='flex flex-col items-center'>
          <div className="flex justify-center mb-[1.5rem] w-[2.5rem] h-[2.5rem]">
            <EventModalIcon />
          </div>
          <p className="text-[1.125rem] font-bold text-[#1A1A1A] text-center">
            {eventTitle}
          </p>
          <p className="text-[1.125rem] font-bold text-[#1A1A1A] text-center">
            {eventSubTitle}
          </p>
          <div className="flex flex-col items-center mt-[1.25rem] text-center">
            <p className="text-[0.875rem] text-[#1A1A1A]">
              {replaceReward(rewardMessage ?? `${reward}이 지급되었어요.`)}
            </p>
            <p className="text-[0.875rem] text-[#1A1A1A]">
              {replaceReward(
                subMessage ?? 'Folioo와 함께 경험을 강력한 서류로 만들어보세요.',
              )}
            </p>
            <p className="text-[0.75rem] text-[#74777D] mt-[0.25rem]">
              {replaceReward(
                validityMessage ?? '지급된 이용권은 6개월 간 사용 가능해요.',
              )}
            </p>
          </div>
          <CommonButton
            variantType='Execute'
            style={{ width: '20.5rem' }}
            className='rounded-[0.75rem] py-[0.75rem] text-[1rem] font-bold hover:bg-[#4352B3] mt-[2rem]'
            onClick={handleClick}
          >
            {buttonText}
          </CommonButton>
      </div>
    </MobileBottomSheet>
  );
}
