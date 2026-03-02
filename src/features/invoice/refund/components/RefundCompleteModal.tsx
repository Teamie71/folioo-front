'use client';

import { CommonModal } from '@/components/CommonModal';

interface RefundCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RefundCompleteModal({
  open,
  onOpenChange,
}: RefundCompleteModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className='flex flex-col items-center gap-[0.75rem]'>
          <p className='text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
            환불 신청이 완료되었습니다.
          </p>
          <p className='font-regular text-[0.875rem] leading-[150%] text-[#74777D]'>
            영업일 기준 3일 이내에 환급이 진행돼요.
          </p>
        </div>
      }
    />
  );
}
