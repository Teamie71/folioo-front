'use client';

import { CommonModal } from '@/components/CommonModal';

interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginRequiredModal({
  open,
  onOpenChange,
}: LoginRequiredModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title='로그인이 필요한 서비스입니다.'
      closeButtonOnly
      className='w-[23.625rem] px-[5rem] py-[3.75rem]'
    />
  );
}
