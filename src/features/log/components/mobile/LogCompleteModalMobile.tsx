'use client';

import { CommonModal } from '@/components/CommonModal';

interface LogCompleteModalMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogCompleteModalMobile({
  open,
  onOpenChange,
}: LogCompleteModalMobileProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      className='flex h-[7rem] w-[17.5rem] min-w-0 items-center justify-center p-0 md:h-[7rem] md:w-[17.5rem]'
    >
      <p className='typo-b2-sb text-gray9 text-center whitespace-pre-line'>
        새로운 인사이트 로그가
        <br />
        등록되었습니다.
      </p>
    </CommonModal>
  );
}
