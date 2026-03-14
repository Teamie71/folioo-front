import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TextField from '@/components/TextField';

const meta = {
  title: 'Components/Forms/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'wide'],
      description: '텍스트 필드의 스타일 변형',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    width: {
      control: 'text',
      description: '너비 (px 또는 rem)',
    },
    height: {
      control: 'text',
      description: '최소 높이 (px 또는 rem)',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 텍스트 필드
export const Default: Story = {
  args: {
    variant: 'default',
    placeholder: '텍스트를 입력하세요...',
    width: '400px',
  },
};

// Wide 변형
export const Wide: Story = {
  args: {
    variant: 'wide',
    placeholder: '텍스트를 입력하세요...',
    width: '500px',
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    variant: 'default',
    placeholder: '비활성화된 필드',
    disabled: true,
    width: '400px',
  },
};

// 모든 변형 한눈에 보기
export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-col gap-8 p-8'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>Default</h3>
        <TextField
          variant='default'
          placeholder='기본 스타일의 텍스트 필드'
          width='400px'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>Wide</h3>
        <TextField
          variant='wide'
          placeholder='Wide 스타일의 텍스트 필드'
          width='400px'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>Disabled</h3>
        <TextField
          variant='default'
          placeholder='비활성화된 텍스트 필드'
          disabled
          width='400px'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold'>With Value</h3>
        <TextField
          variant='default'
          defaultValue='이미 입력된 텍스트가 있습니다.'
          width='400px'
        />
      </div>
    </div>
  ),
};
