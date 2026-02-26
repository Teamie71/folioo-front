'use client';

import { CommonModal } from '@/components/CommonModal';

interface LogCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogCompleteModal({
  open,
  onOpenChange,
}: LogCompleteModalProps) {
  return (
    <CommonModal open={open} onOpenChange={onOpenChange} closeButtonOnly>
      <p className='text-center text-[1.125rem] font-bold text-[#1A1A1A]'>
        새로운 인사이트 로그가 등록되었습니다.
      </p>
    </CommonModal>
  );
}
