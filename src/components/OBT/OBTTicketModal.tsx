'use client';

import { CommonModal } from '@/components/CommonModal';

interface OBTTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OBTTicketModal = ({
  open,
  onOpenChange,
}: OBTTicketModalProps) => {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      closeButtonOnly
      title={
        <span className='text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
          이번 주의 이용권이 모두 소진되었어요.
          <br />
          다음주 월요일에 다시 이용권을 받으실 수 있어요.
        </span>
      }
    />
  );
};
