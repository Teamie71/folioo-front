'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RecommendationTestHeader } from '@/features/recommendation/components/RecommendationTestHeader';
import { useCreateAssessment } from '@/features/recommendation/hooks/useCreateAssessment';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';

export function RecommendationWaiting() {
  const router = useRouter();
  const { error, retry } = useCreateAssessment();
  const resetValueSession = useRecommendationTestStore(
    (s) => s.resetValueSession,
  );

  return (
    <div className='min-h-[100dvh] bg-white'>
      <div className='mx-auto w-[66rem] pt-[1.75rem]'>
        <RecommendationTestHeader currentStep={3} hideStepLabels />

        <div className='mt-[8.75rem] flex flex-col items-center gap-[1.25rem]'>
          {error ? (
            <>
              <p className='typo-b2-sb text-gray9'>{error}</p>
              <button
                type='button'
                onClick={retry}
                className='typo-b2 text-main underline'
              >
                다시 시도
              </button>
              <button
                type='button'
                onClick={() => {
                  // ranking이 남아 있으면 values 진입 즉시 waiting으로 되돌아간다.
                  resetValueSession();
                  router.push('/recommendation/values');
                }}
                className='typo-c1 text-gray6 underline'
              >
                가치관 단계로 돌아가기
              </button>
            </>
          ) : (
            <>
              <motion.div
                animate={{ rotate: 720 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeOut',
                }}
              >
                <Image
                  src='/LoadingSpinnerIcon.svg'
                  alt=''
                  width={64}
                  height={64}
                />
              </motion.div>
              <p className='typo-b2-sb text-gray9'>맞춤 직무를 분석 중이에요.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
