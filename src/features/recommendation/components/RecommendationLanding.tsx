'use client';

import { CommonButton } from '@/components/CommonButton';
import { RecommendationLandingIllustration } from '@/features/recommendation/components/RecommendationLandingIllustration';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

export function RecommendationLanding() {
  const reset = useRecommendationTestStore((s) => s.reset);

  return (
    <div className='flex min-h-[100dvh] w-full items-center justify-center bg-white'>
      <div className='flex w-[298px] flex-col items-center gap-[28px]'>
        <div className='flex w-full flex-col items-center gap-[16px] text-center'>
          <p className='typo-b2-sb text-gray9'>
            전공, 흥미, 선호 조건으로 3분 만에 알아보는
          </p>
          <h1 className='typo-h3 text-gray9 whitespace-nowrap'>
            나에게 딱 맞는 직무 찾기 테스트
          </h1>
        </div>

        <RecommendationLandingIllustration />

        <CommonButton
          variantType='Primary'
          px='2.25rem'
          py='0.75rem'
          href='/recommendation/major'
          onClick={() => reset()}
        >
          테스트 시작하기
        </CommonButton>
      </div>
    </div>
  );
}
