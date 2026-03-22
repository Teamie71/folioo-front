'use client';

import { CommonModal } from '@/components/CommonModal';

interface OBTRedirectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OBTRedirectModal = ({
  open,
  onOpenChange,
}: OBTRedirectModalProps) => {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className='h-[10.375rem] w-[19.625rem] text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
          준비 중인 기능입니다.
          <br />
          출시 후 이용해주세요!
        </span>
      }
    />
  );
};
