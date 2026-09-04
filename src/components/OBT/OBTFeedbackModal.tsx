'use client';

import { FeedbackModal } from '@/components/FeedbackModal';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFirstFeedback: boolean; // 첫 피드백 여부
  onFeedbackClick: () => void;
}

export function OBTFeedbackModal({
  open,
  onOpenChange,
  isFirstFeedback,
  onFeedbackClick,
}: FeedbackModalProps) {
  return (
    <FeedbackModal
      open={open}
      onOpenChange={onOpenChange}
      isFirstFeedback={isFirstFeedback}
      onFeedbackClick={onFeedbackClick}
      variant='obt'
      navigateToFeedback={false}
    />
  );
}
