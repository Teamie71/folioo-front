'use client';

import { CommonButton } from '@/components/CommonButton';
import { CommonModal } from '@/components/CommonModal';
import { openFeedbackForm } from '@/constants/feedback';

interface OBTPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFeedbackClick: () => void;
}

export const OBTPaymentModal = ({
  open,
  onOpenChange,
  onFeedbackClick,
}: OBTPaymentModalProps) => {
  const handleFeedbackClick = () => {
    openFeedbackForm();
    onFeedbackClick();
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      closeButtonOnly
      title={
        <span className='text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
          더 이용해보고 싶으신가요?
          <br />
          피드백 제출 후 추가 이용권을 받아보세요.
        </span>
      }
      description={
        <span className='text-[0.875rem] leading-[150%] text-[#74777D]'>
          <br />
          이번 주에 이미 추가 이용권을 획득하셨다면,
          <br />
          다음 주 월요일에 다시 방문해주세요.
          <br />
          Beta 기간에는 매주 무료 이용권을 드려요!
        </span>
      }
      footer={
        <CommonButton
          variantType='Execute'
          px='2rem'
          py='0.5rem'
          className='rounded-[3.75rem] text-[1rem] font-bold'
          onClick={handleFeedbackClick}
        >
          이번 주 피드백 남기기
        </CommonButton>
      }
    />
  );
};
