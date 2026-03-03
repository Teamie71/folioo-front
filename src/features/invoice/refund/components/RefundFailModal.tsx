'use client';

import { CommonModal } from '@/components/CommonModal';

interface RefundFailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RefundFailModal({ open, onOpenChange }: RefundFailModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className='flex flex-col items-center gap-[0.75rem]'>
          <p className='text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
            환불 신청에 실패하였습니다.
          </p>
          <p className='font-regular text-[0.875rem] leading-[150%] text-[#74777D]'>
            문제가 계속될 경우
            <br />
            <span className='underline'>teamie0701@gmail.com</span>으로
            문의해주세요.
          </p>
        </div>
      }
    />
  );
}
