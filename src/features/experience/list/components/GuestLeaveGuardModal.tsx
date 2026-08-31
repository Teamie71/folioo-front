'use client';

import { CommonModal } from '@/components/CommonModal';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** '로그인' 선택 — 로그인 페이지로 이동한다. */
  onLogin: () => void;
  /** '나가기' 선택 — 모달을 닫고 원래 이탈을 진행한다. */
  onLeave: () => void;
  className?: string;
  overlayClassName?: string;
};

/**
 * 이탈 방지 모달 (화면설계서 0-2).
 *
 * 비로그인 상태에서 페이지를 벗어나려고 하면 표시한다.
 * 편집 내용이 클라이언트에만 있어 이동하면 사라지기 때문이다.
 */
export function GuestLeaveGuardModal({
  open,
  onOpenChange,
  onLogin,
  onLeave,
  className,
  overlayClassName,
}: Props) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      className={className}
      overlayClassName={overlayClassName}
      title={
        <span className='typo-b1-sb text-gray9 block w-full text-center'>
          페이지 이동 시
          <br />
          편집 내용이 초기화됩니다.
          <br />
          로그인 후 저장하시겠습니까?
        </span>
      }
      cancelBtnText='나가기'
      onCancelClick={onLeave}
      primaryBtnText='로그인'
      onPrimaryClick={onLogin}
    />
  );
}
