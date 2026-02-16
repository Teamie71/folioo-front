'use client';

import { CommonModal } from '@/components/CommonModal';
import { CommonButton } from '@/components/CommonButton';
import { EventModalIcon } from '@/components/icons/EventModalIcon';

export function OBTEventModal({
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
  /** 이벤트 제목 (예: 인사이트 로그 작성 챌린지) */
  eventTitle: string;
  /** 이벤트 부제목 (예: 보상 지급 완료) */
  eventSubTitle: string;
  /** 지급된 보상 내용 (예: 경험 정리 1회권) */
  reward: string;
  /** 보상 지급 문구. {reward}는 실제 reward 값으로 치환됨 (미입력 시 `${reward}이 지급되었어요.`) */
  rewardMessage?: string;
  /** 서브 문구. {reward} 치환 가능 (미입력 시 "Folioo와 함께 경험을 강력한 서류로 만들어보세요.") */
  subMessage?: string;
  /** 이용권 유효 안내 문구. {reward} 치환 가능 (미입력 시 "지급된 이용권은 6개월 간 사용 가능해요.") */
  validityMessage?: string;
  /** 하단 CTA 버튼 문구 */
  buttonText: string;
  onButtonClick?: () => void;
}) {
  const handleClick = () => {
    onButtonClick?.();
    onOpenChange(false);
  };

  const replaceReward = (text: string) => text.replace(/\{reward\}/g, reward);

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
          <p className='text-[1.5rem] font-bold text-[#1A1A1A]'>{eventTitle}</p>
          <p className='text-[1.5rem] font-bold text-[#1A1A1A]'>{eventSubTitle}</p>
        </div>
        <div className='flex flex-col gap-[0.25rem]'>
          <div className='text-[1rem] text-[#1A1A1A] mt-[1rem]'>
            <p>{replaceReward(rewardMessage ?? `${reward}이 지급되었어요.`)}</p>
            <p>{replaceReward(subMessage ?? 'Folioo와 함께 경험을 강력한 서류로 만들어보세요.')}</p>
          </div>
          <div className='text-[0.75rem] text-[#74777D]'>
            <p>{replaceReward(validityMessage ?? '지급된 이용권은 6개월 간 사용 가능해요.')}</p>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
