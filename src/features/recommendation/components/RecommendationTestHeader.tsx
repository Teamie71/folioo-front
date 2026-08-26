import { StepProgressBar } from '@/components/StepProgressBar';
import { RECOMMENDATION_TEST_STEPS } from '@/features/recommendation/constants';

interface RecommendationTestHeaderProps {
  currentStep: number;
  hideStepLabels?: boolean;
}

export function RecommendationTestHeader({
  currentStep,
  hideStepLabels = false,
}: RecommendationTestHeaderProps) {
  return (
    <div className='flex flex-col'>
      <h1 className='typo-h4 text-gray9'>직무 찾기</h1>
      <div className='mt-[1.25rem]'>
        <StepProgressBar
          steps={[...RECOMMENDATION_TEST_STEPS]}
          currentStep={currentStep}
          hideLabels={hideStepLabels}
        />
      </div>
    </div>
  );
}
