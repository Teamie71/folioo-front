'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronCircleIcon } from '@/components/icons/ChevronCircleIcon';
import { LandingVideo } from './LandingVideo';

const DEFAULT_VIDEO_SOURCES = [
  '/landing/correction1.mp4',
  '/landing/correction2.mp4',
  '/landing/correction3.mp4',
  '/landing/correction4.mp4',
];

const steps = [
  {
    step: '01',
    label: '지원 정보',
    description:
      '기업과 직무, JD를 입력하여 맞춤 첨삭을 시작하세요.\nJD는 텍스트를 복사하여 붙여넣거나, 화면을 캡쳐하여 이미지로 붙여넣을 수 있어요.',
  },
  {
    step: '02',
    label: '포트폴리오 선택',
    description:
      '경험 정리를 통해 생성한 텍스트형 포트폴리오 또는 가지고 있는 PDF 포트폴리오 중 선택할 수 있어요.\nAI 컨설턴트가 문서의 구조와 내용을 빠짐없이 파악하여 첨삭을 준비해요.',
  },
  {
    step: '03',
    label: '기업 분석',
    description:
      'AI 컨설턴트가 최신 정보를 반영하여 지원하는 기업의 심층 분석 자료를 생성해요.\n강조할 부분을 정해주시면, 참고하여 첨삭을 진행할게요.',
  },
  {
    step: '04',
    label: '첨삭 결과',
    description:
      '총평과 구체적인 개선 방향이 제시된 지원 맞춤 첨삭 보고서를 받아보세요!\n수정 예시를 함께 제공하여, 가이드대로 고치기만 하면 바로 서류가 완성돼요.',
  },
];

export const PortfolioHIW = ({
  videoSources = DEFAULT_VIDEO_SOURCES,
}: {
  videoSources?: string[];
} = {}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const sources = steps.map(
    (_, i) => videoSources?.[i] ?? DEFAULT_VIDEO_SOURCES[i],
  );

  const handlePrev = () => {
    setDirection(-1);
    setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  const handleStepClick = (index: number) => {
    setDirection(index > activeStep ? 1 : -1);
    setActiveStep(index);
  };

  const slideVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
    }),
  };

  return (
    <div className='flex flex-col items-center justify-center gap-[2rem]'>
      {/* 상단 탭 영역 */}
      <div className='relative flex w-[66rem]'>
        {/* 회색 배경 바 */}
        <div className='absolute right-0 bottom-0 left-0 h-[0.25rem] bg-[#E9EAEC]' />

        {/* 활성 파란색 바 */}
        <motion.div
          className='absolute bottom-0 h-[0.25rem] bg-[#5060C5]'
          initial={false}
          animate={{
            left: `${(activeStep / steps.length) * 100}%`,
            width: `${100 / steps.length}%`,
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        />

        {steps.map((step, index) => (
          <button
            key={step.step}
            onClick={() => handleStepClick(index)}
            className='relative flex flex-1 cursor-pointer flex-col py-[0.75rem]'
          >
            <motion.div
              className='flex flex-col items-center gap-[0.5rem]'
              animate={{
                color: activeStep === index ? '#5060C5' : '#D1D5DB',
              }}
              transition={{ duration: 0.4 }}
            >
              <p
                className={`text-[0.875rem] leading-[150%] transition-colors duration-300 ${
                  activeStep === index ? 'text-[#5060C5]' : 'text-[#D1D5DB]'
                }`}
              >
                STEP {step.step}
              </p>
              <p
                className={`text-[1.25rem] leading-[130%] font-bold transition-colors duration-300 ${
                  activeStep === index ? 'text-[#5060C5]' : 'text-[#D1D5DB]'
                }`}
              >
                {step.label}
              </p>
            </motion.div>
          </button>
        ))}
      </div>

      {/* 설명 텍스트 */}
      <AnimatePresence mode='wait' custom={direction}>
        <motion.div
          key={activeStep}
          custom={direction}
          className='flex flex-col items-center text-center'
          variants={slideVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <p className='text-[1.125rem] leading-[150%] whitespace-pre-line text-[#000000]'>
            {steps[activeStep].description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* 영상 */}
      <div className='flex items-center justify-center gap-[1.5rem]'>
        {activeStep > 0 ? (
          <button
            onClick={handlePrev}
            className='scale-y-[-1] rotate-180 cursor-pointer'
          >
            <ChevronCircleIcon />
          </button>
        ) : (
          <div className='w-[3rem]'></div>
        )}
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={activeStep}
            custom={direction}
            variants={slideVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <LandingVideo
              src={sources[activeStep]}
              width='66rem'
              height='37.125rem'
            />
          </motion.div>
        </AnimatePresence>
        {activeStep < steps.length - 1 ? (
          <button onClick={handleNext} className='cursor-pointer'>
            <ChevronCircleIcon />
          </button>
        ) : (
          <div className='w-[3rem]'></div>
        )}
      </div>
    </div>
  );
};
