import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StepProgressBar } from '@/components/StepProgressBar';

const meta = {
  title: 'Components/Progress/StepProgressBar',
  component: StepProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'range', min: 1, max: 4, step: 1 },
      description: '현재 진행 단계',
    },
  },
} satisfies Meta<typeof StepProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSteps = ['정보 입력', '대화 진행', '포트폴리오 생성', '완료'];

// 1단계
export const Step1: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 1,
  },
};

// 2단계
export const Step2: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 2,
  },
};

// 3단계
export const Step3: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 3,
  },
};

// 4단계 (완료)
export const Step4: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 4,
  },
};

// 모든 단계 한눈에 보기
export const AllSteps: Story = {
  args: { steps: defaultSteps, currentStep: 1 },
  render: () => (
    <div className='flex w-[1056px] flex-col gap-8 p-8'>
      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>1단계</h3>
        <StepProgressBar steps={defaultSteps} currentStep={1} />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>2단계</h3>
        <StepProgressBar steps={defaultSteps} currentStep={2} />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>3단계</h3>
        <StepProgressBar steps={defaultSteps} currentStep={3} />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>4단계 (완료)</h3>
        <StepProgressBar steps={defaultSteps} currentStep={4} />
      </div>
    </div>
  ),
};
