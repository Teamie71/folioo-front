'use client';

import { CommonModal } from '@/components/CommonModal';

interface CorrectionLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CorrectionLimitModal = ({
  open,
  onOpenChange,
}: CorrectionLimitModalProps) => {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      closeButtonOnly
      title={
        <span className='text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
          첨삭은 최대 15 개까지만 저장할 수 있어요.
          <br />
          기존 첨삭을 삭제한 후, 새로운 첨삭을 정리해주세요.
        </span>
      }
    />
  );
};
