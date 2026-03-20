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
      secondaryBtnText='삭제'
      onSecondaryClick={isDeleting ? () => {} : onConfirm}
      onCancelClick={() => onOpenChange(false)}
      className='gap-[2rem] px-[2.5rem] py-[3rem] min-w-[20rem] sm:px-[5rem] sm:py-[3.75rem] sm:min-w-0'
      overlayClassName='bg-black/60'
    >
      {errorMessage && (
        <p className='mt-2 text-sm text-[#DC0000]'>{errorMessage}</p>
      )}
    </CommonModal>
  );
}
