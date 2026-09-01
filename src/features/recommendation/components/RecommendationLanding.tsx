'use client';

import { CommonButton } from '@/components/CommonButton';
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

        <div className='h-[280px] w-[250px] overflow-hidden'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='250'
            height='280'
            viewBox='0 0 250.27 280.962'
            fill='none'
            preserveAspectRatio='none'
            aria-hidden
          >
            <rect
              x='0.770289'
              y='1.46211'
              width='249'
              height='279'
              fill='#FDFDFD'
              stroke='#CDD0D5'
            />
            <line
              y1='-0.5'
              x2='374.991'
              y2='-0.5'
              transform='matrix(0.665178 0.746685 -0.27266 0.96211 0.556178 0.96211)'
              stroke='#CDD0D5'
            />
            <line
              y1='-0.5'
              x2='373.877'
              y2='-0.5'
              transform='matrix(0.66867 -0.74356 0.270289 0.962779 0.270289 279.962)'
              stroke='#CDD0D5'
            />
          </svg>
        </div>

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
