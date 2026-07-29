'use client';

import { CommonModal } from '@/components/CommonModal';

interface PortfolioCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PortfolioCreateModal = ({
  open,
  onOpenChange,
}: PortfolioCreateModalProps) => {
  return (
    <CommonModal
      className='w-[37.25rem]'
      open={open}
      onOpenChange={onOpenChange}
      title={
        <>
          AI 컨설턴트가 충분한 정보를 학습했어요!
          <br />
          대화 내용을 바탕으로 텍스트형 포트폴리오 생성을 시작할게요.
        </>
      }
    />
  );
};
