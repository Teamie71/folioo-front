'use client';

import { CommonModal } from '@/components/CommonModal';

interface LogDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogDeleteModal({
  open,
  onOpenChange,
  onConfirm,
}: LogDeleteModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title='이 로그를 정말 삭제하시겠습니까?'
      cancelBtnText='취소'
      secondaryBtnText='삭제'
      onSecondaryClick={onConfirm}
      onCancelClick={() => onOpenChange(false)}
    />
  );
}
