import { useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { RecreateModal } from './RecreateModal';

export const SlideContent = ({ selectedIndex }: { selectedIndex: number }) => {
  const [isRecreateModalOpen, setIsRecreateModalOpen] = useState(false);
  const [remainingCount, setRemainingCount] = useState(10);

  return (
    <div className='border-gray6 text-gray5 relative flex h-[42.1875rem] w-full flex-col rounded-[1.25rem] border bg-white'>
      {selectedIndex === 0 ? (
        <div className='flex h-full flex-col items-center justify-center'>
          {/* 로딩 스피너 */}
          <div className='flex items-center justify-center'>
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
                alt='loading'
                width={64}
                height={64}
              />
            </motion.div>
          </div>
          <span className='text-gray7 mt-[2.5rem] text-center text-[1.125rem] leading-[130%] font-bold'>
            AI 컨설턴트가 텍스트형 포트폴리오를 생성 중이에요.
            <br />
            페이지를 떠나도 작업은 계속돼요.
          </span>
        </div>
      ) : selectedIndex === 1 ? (
        <div className='flex h-full flex-col items-center justify-center gap-[2.5rem]'>
          <span className='text-gray7 text-center text-[1.125rem] leading-[130%] font-bold'>
            앗, 시각화 포트폴리오 생성 중 오류가 발생했어요.
            <br />
            아래 버튼을 눌러 다시 시도해주세요.
          </span>
          <CommonButton variantType='Outline' px='2.25rem' py='0.5rem'>
            다시 시도하기
          </CommonButton>
        </div>
      ) : selectedIndex === 2 ? (
        <div className='relative flex h-full w-full flex-col items-center justify-center'>
          <div className='absolute top-[1.5rem] right-[1.5rem]'>
            <CommonButton
              variantType='Outline'
              px='2.25rem'
              py='0.5rem'
              onClick={() => setIsRecreateModalOpen(true)}
            >
              다시 생성하기 ({remainingCount}/10)
            </CommonButton>
          </div>
          <span className='text-[4rem] font-bold'>Page {selectedIndex + 1}</span>
        </div>
      ) : (
        <div className='flex h-full items-center justify-center'>
          <span className='text-[4rem] font-bold'>Page {selectedIndex + 1}</span>
        </div>
      )}

      <RecreateModal
        open={isRecreateModalOpen}
        onOpenChange={setIsRecreateModalOpen}
        remainingCount={remainingCount}
      />
    </div>
  );
};
