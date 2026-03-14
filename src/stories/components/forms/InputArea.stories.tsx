import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import InputArea from '@/components/InputArea';

const meta = {
  title: 'Components/Forms/InputArea',
  component: InputArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 입력 필드
export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
    width: '400px',
  },
};

// Rounded 스타일
export const Rounded: Story = {
  args: {
    variant: 'rounded',
    placeholder: '검색어를 입력하세요',
    width: '400px',
  },
};

// ReadOnly
export const ReadOnly: Story = {
  args: {
    value: '읽기 전용 텍스트',
    readOnly: true,
    width: '400px',
  },
};

// 우측 요소 포함
export const WithRightElement: Story = {
  args: {
    placeholder: '검색',
    width: '400px',
    rightElement: (
      <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
        <path
          d='M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35'
          stroke='#74777D'
          strokeWidth='2'
          strokeLinecap='round'
        />
      </svg>
    ),
  },
};

// 모든 변형
export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-6 p-8'>
      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>Default</h3>
        <InputArea placeholder='기본 입력 필드' width='400px' />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>Rounded</h3>
        <InputArea
          variant='rounded'
          placeholder='둥근 입력 필드'
          width='400px'
        />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>ReadOnly</h3>
        <InputArea value='읽기 전용' readOnly width='400px' />
      </div>
    </div>
  ),
};
