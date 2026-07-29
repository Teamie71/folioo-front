'use client';

import { CommonModal } from '@/components/CommonModal';

interface PortfolioDeleteBlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PortfolioDeleteBlockModal({
  open,
  onOpenChange,
}: PortfolioDeleteBlockModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <>
          이 포트폴리오로 진행된 첨삭이 있어요.
          <br />
          첨삭을 삭제하면 포트폴리오도 삭제할 수 있어요.
        </>
      }
      closeButtonOnly={false}
    />
  );
}
