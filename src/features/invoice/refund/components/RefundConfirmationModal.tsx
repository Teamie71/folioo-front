'use client';

import { CommonModal } from '@/components/CommonModal';

interface RefundConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RefundConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
}: RefundConfirmationModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title='환불 신청을 진행하시겠습니까?'
      cancelBtnText='취소'
      secondaryBtnText='진행'
      onSecondaryClick={onConfirm}
      className='gap-[1.5rem] !px-[1.625rem] !py-[2rem] [&>button:last-child]:hidden'
    />
  );
}
