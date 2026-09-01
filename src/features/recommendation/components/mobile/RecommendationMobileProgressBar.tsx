import { cn } from '@/utils/utils';
import { RECOMMENDATION_TEST_STEPS } from '@/features/recommendation/constants';

interface RecommendationMobileProgressBarProps {
  currentStep: number;
}

export function RecommendationMobileProgressBar({
  currentStep,
}: RecommendationMobileProgressBarProps) {
  return (
    <div
      className='flex h-[0.25rem] w-full gap-[0.125rem]'
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={RECOMMENDATION_TEST_STEPS.length}
      aria-valuenow={currentStep}
      aria-label='직무 찾기 진행 단계'
    >
      {RECOMMENDATION_TEST_STEPS.map((_, index) => {
        const stepNum = index + 1;
        const isFilled = stepNum <= currentStep;

        return (
          <div
            key={stepNum}
            className={cn(
              'h-full min-w-0 flex-1 rounded-[0.5rem]',
              isFilled
                ? 'bg-gradient-to-b from-[#93B3F4] to-[#5060C5]'
                : 'bg-gray3',
            )}
          />
        );
      })}
    </div>
  );
}
