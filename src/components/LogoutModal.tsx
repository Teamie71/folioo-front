'use client';

import { CommonModal } from '@/components/CommonModal';

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  variant?: 'desktop' | 'mobile';
}

export function LogoutModal({
  open,
  onOpenChange,
  onConfirm,
  variant = 'desktop',
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
        <span
          className={
            variant === 'mobile'
              ? 'typo-b2-sb text-gray9'
              : 'text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'
          }
        >
          정말 로그아웃 하시겠습니까?
        </span>
      }
      cancelBtnText='취소'
      secondaryBtnText='로그아웃'
      onCancelClick={() => onOpenChange(false)}
      onSecondaryClick={handleConfirm}
      closeButtonOnly={false}
      overlayClassName={variant === 'mobile' ? 'z-[100]' : undefined}
      footer={
        variant === 'mobile' ? (
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => onOpenChange(false)}
              className='typo-b2 border-gray6 h-10 w-[108px] rounded-lg border bg-white'
            >
              취소
            </button>
            <button
              type='button'
              onClick={handleConfirm}
              className='typo-b2 border-gray6 h-10 w-[108px] rounded-lg border bg-white'
            >
              로그아웃
            </button>
          </div>
        ) : undefined
      }
      className={
        variant === 'mobile'
          ? 'z-[110] w-[280px] max-w-[calc(100vw-32px)] gap-6 rounded-2xl px-[26px] py-8 sm:rounded-2xl [&_h2]:text-base [&_h2]:leading-6 [&_h2]:tracking-normal [&>button]:hidden'
          : undefined
      }
    />
  );
}
