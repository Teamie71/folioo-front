'use client';

import { CommonModal } from '@/components/CommonModal';

interface LogDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
  errorMessage?: string | null;
}

export function LogDeleteModal({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
  errorMessage,
}: LogDeleteModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
      title='이 로그를 정말 삭제하시겠습니까?'
      cancelBtnText='취소'
      secondaryBtnText={isDeleting ? '삭제 중...' : '삭제'}
      onSecondaryClick={isDeleting ? () => {} : onConfirm}
      onCancelClick={() => onOpenChange(false)}
    >
      {errorMessage && (
        <p className='mt-2 text-sm text-[#DC0000]'>{errorMessage}</p>
      )}
    </CommonModal>
  );
}
