'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import { OBTEventModal } from '@/components/OBT/OBTEventModal';

export function FeedbackRewardDistributedModal({
  open,
  onOpenChange,
  onProofreadRequestClick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProofreadRequestClick?: () => void;
}) {
  const router = useRouter();
  const isLeavingForProofreadRef = useRef(false);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen && !isLeavingForProofreadRef.current) {
      router.back();
    }

    if (!nextOpen) {
      isLeavingForProofreadRef.current = false;
    }
  };

  const handleProofreadRequest = () => {
    isLeavingForProofreadRef.current = true;
    onProofreadRequestClick?.();
    router.push('/correction/new');
  };

  return (
    <OBTEventModal
      open={open}
      onOpenChange={handleOpenChange}
      eventTitle='피드백 제출'
      eventSubTitle='보상 지급 완료'
      reward='경험 정리 1회권 + 포트폴리오 첨삭 1회권'
      validityMessage='지급된 이용권은 6개월 간 사용 가능해요.'
      buttonText='첨삭 의뢰하기'
      onButtonClick={handleProofreadRequest}
    />
  );
}
