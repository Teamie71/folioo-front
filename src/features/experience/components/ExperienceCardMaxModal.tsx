'use client';

import { CommonModal } from '@/components/CommonModal';

interface ExperienceCardMaxModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExperienceCardMaxModal({
  open,
  onOpenChange,
}: ExperienceCardMaxModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      closeButtonOnly
      title={
        <>
          경험은 최대 15 개까지만 저장할 수 있어요.
          <br />
          기존 경험을 삭제한 후, 새로운 경험을 정리해주세요.
        </>
      }
    >
      <p className='line-height-[150%] text-[0.875rem] text-[#74777D]'>
        텍스트형 포트폴리오는 PDF로 저장할 수 있어요.
      </p>
    </CommonModal>
  );
}
