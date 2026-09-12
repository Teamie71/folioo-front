'use client';

import { CommonButton } from '@/components/CommonButton';
import { RecommendationLandingIllustration } from '@/features/recommendation/components/RecommendationLandingIllustration';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

export function RecommendationLandingMobile() {
  const reset = useRecommendationTestStore((s) => s.reset);

  return (
    <div className='flex min-h-[calc(100dvh-52px)] w-full flex-col items-center bg-white px-[1rem] pt-[5rem]'>
      <div className='flex w-full max-w-[17.3125rem] flex-col items-center gap-[1.75rem]'>
        <div className='flex w-full flex-col items-center gap-[1rem] text-center'>
          <p className='typo-b2-sb text-gray9'>
            전공, 흥미, 선호 조건으로 3분 만에 알아보는
          </p>
          <h1 className='typo-h3 text-gray9'>
            <span className='block'>나에게 딱 맞는</span>
            <span className='block'>직무 찾기 테스트</span>
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
