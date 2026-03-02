'use client';

import { CommonModal } from '@/components/CommonModal';

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutModal({
  open,
  onOpenChange,
  onConfirm,
}: LogoutModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className='text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
          정말 로그아웃 하시겠습니까?
        </span>
      }
      cancelBtnText='취소'
      secondaryBtnText='로그아웃'
      onCancelClick={() => onOpenChange(false)}
      onSecondaryClick={handleConfirm}
      closeButtonOnly={false}
    />
  );
}
