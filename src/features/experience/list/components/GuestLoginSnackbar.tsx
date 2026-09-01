'use client';

import { CloseIcon } from '@/components/icons/CloseIcon';
import { cn } from '@/utils/utils';

type Props = {
  onLogin: () => void;
  onDismiss: () => void;
  className?: string;
};

/**
 * 로그인 안내 스낵바 (화면설계서 0-1).
 *
 * 비로그인으로 경험 정리에 들어오면 편집 영역 하단(하단 기준 40px 위)에 표시한다.
 * 로그인하지 않는 한 계속 떠 있고, X를 누르면 사라진다.
 */
export function GuestLoginSnackbar({ onLogin, onDismiss, className }: Props) {
  return (
    <div
      role='status'
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-[40px] z-[80] flex justify-center px-[16px]',
        className,
      )}
    >
      <div className='pointer-events-auto flex w-full max-w-[420px] items-center gap-[12px] rounded-[16px] bg-white px-[20px] py-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]'>
        <p className='typo-b2 text-gray9 flex-1 break-keep'>
          로그인하고 작성하신 내용을
          <br />
          안전하게 보관해 보세요.
        </p>

        <button
          type='button'
          onClick={onLogin}
          className='typo-b2-sb text-main shrink-0 cursor-pointer whitespace-nowrap'
        >
          로그인
        </button>

        <button
          type='button'
          onClick={onDismiss}
          aria-label='안내 닫기'
          className='text-gray5 flex size-[24px] shrink-0 cursor-pointer items-center justify-center'
        >
          <CloseIcon className='size-[20px]' />
        </button>
      </div>
    </div>
  );
}
