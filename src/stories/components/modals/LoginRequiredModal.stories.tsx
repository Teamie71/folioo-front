import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/LoginRequiredModal',
  component: LoginRequiredModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginRequiredModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 로그인 필요 모달 (자동 닫기)
export const Default: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-blue-500 px-4 py-2 text-white'
        >
          로그인 필요 모달 열기
        </button>
        <LoginRequiredModal open={open} onOpenChange={setOpen} />
        <p className='mt-4 text-sm text-gray-600'>
          2초 후 자동으로 로그인 페이지로 이동합니다.
        </p>
      </div>
    );
  },
};
