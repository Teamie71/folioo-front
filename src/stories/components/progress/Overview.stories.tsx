import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CorrectionProgressBar } from '@/components/CorrectionProgressBar';
import { StepProgressBar } from '@/components/StepProgressBar';
import { CreditExpireAlert } from '@/components/CreditExpireAlert';

const meta = {
  title: 'Components/Progress/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Progress & Alert Overview

진행률 표시 및 알림 컴포넌트들의 전체 컬렉션입니다.
다양한 상태와 스타일의 프로그레스 바와 알림을 한눈에 확인할 수 있습니다.

## 카테고리

### 진행률 표시
- **CorrectionProgressBar**: 첨삭 프로세스의 단계별 진행 상태를 표시
- **StepProgressBar**: 일반적인 다단계 프로세스의 진행 상태를 표시

### 알림
- **CreditExpireAlert**: 이용권 만료 예정 알림
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllComponents: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Progress & Alert Collection
        </h1>

        {/* CorrectionProgressBar */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              CorrectionProgressBar
            </h2>
            <p className='text-sm text-gray-600'>
              첨삭 프로세스의 단계별 진행 상태 표시
            </p>
          </div>
          <div className='flex flex-col gap-6 rounded-lg bg-white p-6 shadow'>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                Step 1: 지원 정보 (25%)
              </h3>
              <CorrectionProgressBar step='information' />
            </div>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                Step 2: 포트폴리오 선택 (50%)
              </h3>
              <CorrectionProgressBar step='portfolio' />
            </div>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                Step 3: 기업 분석 (75%)
              </h3>
              <CorrectionProgressBar step='analysis' />
            </div>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                분석 중 상태 (100%)
              </h3>
              <CorrectionProgressBar step='analysis' status='ANALYZING' />
            </div>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                분석 실패 상태 (100%)
              </h3>
              <CorrectionProgressBar
                step='analysis'
                status='ANALYZING_FAILED'
              />
            </div>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                완료 상태 (100%)
              </h3>
              <CorrectionProgressBar step='result' status='DONE' />
            </div>
          </div>
        </section>

        {/* StepProgressBar */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              StepProgressBar
            </h2>
            <p className='text-sm text-gray-600'>
              일반적인 다단계 프로세스의 진행 상태 표시
            </p>
          </div>
          <div className='flex flex-col gap-6 rounded-lg bg-white p-6 shadow'>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                3단계 프로세스 - Step 1 (33%)
              </h3>
              <StepProgressBar
                steps={['기본 정보', '상세 정보', '완료']}
                currentStep={1}
              />
            </div>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                3단계 프로세스 - Step 2 (67%)
              </h3>
              <StepProgressBar
                steps={['기본 정보', '상세 정보', '완료']}
                currentStep={2}
              />
            </div>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                3단계 프로세스 - Step 3 (100%)
              </h3>
              <StepProgressBar
                steps={['기본 정보', '상세 정보', '완료']}
                currentStep={3}
              />
            </div>
            <div className='mt-4'>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                4단계 프로세스 - Step 2 (50%)
              </h3>
              <StepProgressBar
                steps={['시작', '진행 중', '검토', '완료']}
                currentStep={2}
              />
            </div>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                5단계 프로세스 - Step 3 (60%)
              </h3>
              <StepProgressBar
                steps={['1단계', '2단계', '3단계', '4단계', '5단계']}
                currentStep={3}
              />
            </div>
          </div>
        </section>

        {/* CreditExpireAlert */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              CreditExpireAlert
            </h2>
            <p className='text-sm text-gray-600'>
              이용권 만료 예정 알림 (실제 데이터는 API에서 로드)
            </p>
          </div>
          <div className='flex flex-col gap-4 rounded-lg bg-white p-6 shadow'>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                기본 알림
              </h3>
              <CreditExpireAlert message='만료 예정 이용권이 있어요' />
            </div>
            <div className='mt-4'>
              <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                커스텀 메시지
              </h3>
              <CreditExpireAlert message='곧 만료되는 이용권을 확인하세요' />
            </div>
            <div className='mt-4'>
              <p className='text-xs text-gray-500'>
                참고: 실제 만료 예정 이용권이 없으면 컴포넌트가 표시되지
                않습니다.
                <br />
                클릭하면 만료 예정 이용권 상세 정보가 팝오버로 표시됩니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};

export const ProgressComparison: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Progress Bars Comparison
        </h1>

        {/* CorrectionProgressBar 비교 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-blue-50 p-4'>
            <h2 className='text-2xl font-bold text-blue-900'>
              CorrectionProgressBar
            </h2>
            <p className='text-sm text-blue-700'>
              첨삭 프로세스별 진행 상태 비교
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                지원 정보 단계
              </h3>
              <CorrectionProgressBar step='information' />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                포트폴리오 선택
              </h3>
              <CorrectionProgressBar step='portfolio' />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>기업 분석</h3>
              <CorrectionProgressBar step='analysis' />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>분석 중</h3>
              <CorrectionProgressBar step='analysis' status='ANALYZING' />
            </div>
          </div>
        </section>

        {/* StepProgressBar 비교 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-purple-50 p-4'>
            <h2 className='text-2xl font-bold text-purple-900'>
              StepProgressBar
            </h2>
            <p className='text-sm text-purple-700'>
              다양한 단계 수와 현재 진행 상태 비교
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                3단계 - 현재 1단계
              </h3>
              <StepProgressBar
                steps={['준비', '실행', '완료']}
                currentStep={1}
              />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                4단계 - 현재 3단계
              </h3>
              <StepProgressBar
                steps={['계획', '개발', '테스트', '배포']}
                currentStep={3}
              />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                5단계 - 현재 5단계 (완료)
              </h3>
              <StepProgressBar
                steps={['접수', '검토', '승인', '처리', '완료']}
                currentStep={5}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};

export const InteractiveDemo: Story = {
  render: () => {
    const CorrectionSteps = () => {
      const [step, setStep] = React.useState<
        'information' | 'portfolio' | 'analysis' | 'result'
      >('information');

      const steps = ['information', 'portfolio', 'analysis', 'result'] as const;
      const currentIndex = steps.indexOf(step);

      return (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 font-semibold text-gray-800'>
            CorrectionProgressBar - 인터랙티브
          </h3>
          <CorrectionProgressBar step={step} />
          <div className='mt-6 flex gap-2'>
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setStep(steps[currentIndex - 1]);
                }
              }}
              disabled={currentIndex === 0}
              className='rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300'
            >
              이전
            </button>
            <button
              onClick={() => {
                if (currentIndex < steps.length - 1) {
                  setStep(steps[currentIndex + 1]);
                }
              }}
              disabled={currentIndex === steps.length - 1}
              className='rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300'
            >
              다음
            </button>
            <span className='ml-4 flex items-center text-sm text-gray-600'>
              현재 단계: {step} ({currentIndex + 1}/{steps.length})
            </span>
          </div>
        </div>
      );
    };

    const StepProgress = () => {
      const [currentStep, setCurrentStep] = React.useState(1);
      const steps = ['정보 입력', '내용 작성', '검토', '제출'];

      return (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 font-semibold text-gray-800'>
            StepProgressBar - 인터랙티브
          </h3>
          <StepProgressBar steps={steps} currentStep={currentStep} />
          <div className='mt-6 flex gap-2'>
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className='rounded bg-purple-500 px-4 py-2 text-white disabled:bg-gray-300'
            >
              이전
            </button>
            <button
              onClick={() =>
                setCurrentStep(Math.min(steps.length, currentStep + 1))
              }
              disabled={currentStep === steps.length}
              className='rounded bg-purple-500 px-4 py-2 text-white disabled:bg-gray-300'
            >
              다음
            </button>
            <span className='ml-4 flex items-center text-sm text-gray-600'>
              {currentStep} / {steps.length} 단계 (
              {Math.round((currentStep / steps.length) * 100)}%)
            </span>
          </div>
        </div>
      );
    };

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Interactive Progress Bars
          </h1>

          <div className='grid grid-cols-1 gap-6'>
            <CorrectionSteps />
            <StepProgress />
          </div>

          <section className='mt-12'>
            <div className='mb-6 rounded-lg bg-red-50 p-4'>
              <h2 className='text-2xl font-bold text-red-900'>Alert Demo</h2>
              <p className='text-sm text-red-700'>
                이용권 만료 예정 알림 (클릭하여 상세 정보 확인)
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CreditExpireAlert message='만료 예정 이용권이 있어요' />
            </div>
          </section>
        </div>
      </div>
    );
  },
};
