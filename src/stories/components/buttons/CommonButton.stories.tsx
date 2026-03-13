import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CommonButton } from '@/components/CommonButton';

const meta = {
  title: 'Components/Buttons/CommonButton/CommonButton',
  component: CommonButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variantType: {
      control: 'select',
      options: [
        'Primary',
        'Execute',
        'Cancel',
        'Outline',
        'StartChat',
        'Gradient',
      ],
      description: '버튼의 스타일 타입',
    },
    px: {
      control: 'text',
      description: '좌우 패딩 (rem 또는 px)',
    },
    py: {
      control: 'text',
      description: '상하 패딩 (rem 또는 px)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
  },
} satisfies Meta<typeof CommonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary 버튼
export const Primary: Story = {
  args: {
    variantType: 'Primary',
    px: '2.25rem',
    py: '0.75rem',
    children: 'Primary 버튼',
  },
};

// Execute 버튼 (모달 실행용)
export const Execute: Story = {
  args: {
    variantType: 'Execute',
    px: '2.25rem',
    py: '0.75rem',
    children: '실행하기',
  },
};

// Cancel 버튼
export const Cancel: Story = {
  args: {
    variantType: 'Cancel',
    px: '2.25rem',
    py: '0.75rem',
    children: '취소',
  },
};

// Outline 버튼
export const Outline: Story = {
  args: {
    variantType: 'Outline',
    px: '2.25rem',
    py: '0.5rem',
    children: 'Outline 버튼',
  },
};

// StartChat 버튼 (px, py 고정)
export const StartChat: Story = {
  args: {
    variantType: 'StartChat',
    children: '대화 시작하기',
  },
};

// Gradient 버튼
export const Gradient: Story = {
  args: {
    variantType: 'Gradient',
    px: '2.25rem',
    py: '0.75rem',
    children: '무료로 시작하기 →',
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    variantType: 'Primary',
    px: '2.25rem',
    py: '0.75rem',
    children: '비활성화된 버튼',
    disabled: true,
  },
};

// 모든 버튼 한눈에 보기
export const AllVariants: Story = {
  args: {
    variantType: 'Primary',
    children: '',
  },
  render: () => (
    <div className='flex flex-col gap-4 p-8'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>Primary</h3>
        <div className='flex gap-4'>
          <CommonButton variantType='Primary' px='2.25rem' py='0.75rem'>
            Primary 버튼
          </CommonButton>
          <CommonButton
            variantType='Primary'
            px='2.25rem'
            py='0.75rem'
            disabled
          >
            비활성화
          </CommonButton>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>Execute</h3>
        <div className='flex gap-4'>
          <CommonButton variantType='Execute' px='2.25rem' py='0.75rem'>
            실행하기
          </CommonButton>
          <CommonButton
            variantType='Execute'
            px='2.25rem'
            py='0.75rem'
            disabled
          >
            비활성화
          </CommonButton>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>Cancel</h3>
        <CommonButton variantType='Cancel' px='2.25rem' py='0.75rem'>
          취소
        </CommonButton>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>Outline</h3>
        <CommonButton variantType='Outline' px='2.25rem' py='0.5rem'>
          Outline 버튼
        </CommonButton>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>StartChat</h3>
        <CommonButton variantType='StartChat'>
          새로운 경험 정리 시작하기
        </CommonButton>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>Gradient</h3>
        <CommonButton variantType='Gradient' px='2.25rem' py='0.75rem'>
          무료로 시작하기 →
        </CommonButton>
      </div>
    </div>
  ),
};
