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
          <p className='text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A] md:underline-none'>
            환불 신청이 완료되었습니다.
          </p>
          <p className='font-regular text-[0.875rem] leading-[150%] text-[#74777D]'>
            영업일 기준 <span className='md:hidden'>7</span><span className='hidden md:inline'>3</span>일 이내에 환급이 진행돼요.
          </p>
        </div>
      }
      className='!p-0 flex items-center justify-center md:!p-[3.75rem] md:!px-[5rem] w-[17.5rem] h-[7.375rem] md:w-auto md:h-auto'
    />
  );
}
