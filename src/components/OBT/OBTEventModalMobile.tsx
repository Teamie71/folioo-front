'use client';

import { CommonButton } from '@/components/CommonButton';
import { EventModalIcon } from '@/components/icons/EventModalIcon';

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

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col animate-in slide-in-from-bottom duration-300 bg-white rounded-t-[1.25rem]">
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-[1rem] pb-[1.5rem] shrink-0">
          <div className="w-[3.75rem] h-[0.25rem] bg-[#CDD0D5] rounded-[0.5rem]" />
        </div>

        {/* 닫기 버튼 */}
        <button
          type="button"
          className="absolute top-[1rem] right-[1rem] p-[0.25rem]"
          onClick={() => onOpenChange(false)}
          aria-label="닫기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 컨텐츠 */}
        <div className="flex flex-col items-center px-[1.5rem] pb-[1rem]">
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
      </div>
    </>
  );
}
