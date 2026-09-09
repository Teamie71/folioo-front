'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RecommendationMobileProgressBar } from '@/features/recommendation/components/mobile/RecommendationMobileProgressBar';
import { useCreateAssessment } from '@/features/recommendation/hooks/useCreateAssessment';

export function RecommendationWaitingMobile() {
  const router = useRouter();
  const { error, retry } = useCreateAssessment();

  return (
    <div className='flex min-h-[calc(100dvh-52px)] flex-col bg-white'>
      <div className='px-[1rem] pt-[0.75rem]'>
        <RecommendationMobileProgressBar currentStep={3} />
      </div>

      <div className='flex flex-1 flex-col items-center justify-center gap-[1.25rem] pb-[3.25rem]'>
        {error ? (
          <>
            <p className='typo-b2-sb px-[1rem] text-center text-gray9'>
              {error}
            </p>
            <button
              type='button'
              onClick={retry}
              className='typo-b2 text-main underline'
            >
              다시 시도
            </button>
            <button
              type='button'
              onClick={() => router.push('/recommendation/values')}
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
  );
}
