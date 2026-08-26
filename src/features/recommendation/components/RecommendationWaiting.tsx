'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RecommendationTestHeader } from '@/features/recommendation/components/RecommendationTestHeader';

export function RecommendationWaiting() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/recommendation/result');
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className='min-h-[100dvh] bg-white'>
      <div className='mx-auto w-[66rem] pt-[1.75rem]'>
        <RecommendationTestHeader currentStep={3} hideStepLabels />

        <div className='mt-[8.75rem] flex flex-col items-center gap-[1.25rem]'>
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
        </div>
      </div>
    </div>
  );
}
