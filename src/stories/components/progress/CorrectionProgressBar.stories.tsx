import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CorrectionProgressBar } from '@/components/CorrectionProgressBar';

const meta = {
  title: 'Components/Progress/CorrectionProgressBar',
  component: CorrectionProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CorrectionProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1단계 - 지원 정보
export const Step1Information: Story = {
  args: {
    step: 'information',
    className: 'w-[1056px]',
  },
};

// 2단계 - 포트폴리오 선택
export const Step2Portfolio: Story = {
  args: {
    step: 'portfolio',
    className: 'w-[1056px]',
  },
};

// 3단계 - 기업 분석
export const Step3Analysis: Story = {
  args: {
    step: 'analysis',
    className: 'w-[1056px]',
  },
};

// 분석 중
export const Analyzing: Story = {
  args: {
    step: 'analysis',
    status: 'ANALYZING',
    className: 'w-[1056px]',
  },
};

// 모든 단계 한눈에 보기
export const AllSteps: Story = {
  args: { step: 'information' },
  render: () => (
    <div className='flex w-[1056px] flex-col gap-8 p-8'>
      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>1단계 - 지원 정보</h3>
        <CorrectionProgressBar step='information' />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>2단계 - 포트폴리오 선택</h3>
        <CorrectionProgressBar step='portfolio' />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>3단계 - 기업 분석</h3>
        <CorrectionProgressBar step='analysis' />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>분석 중</h3>
        <CorrectionProgressBar step='analysis' status='ANALYZING' />
      </div>
    </div>
  ),
};
