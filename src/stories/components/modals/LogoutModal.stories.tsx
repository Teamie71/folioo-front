import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogoutModal } from '@/components/LogoutModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/LogoutModal',
  component: LogoutModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LogoutModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 로그아웃 모달
export const Default: Story = {
  args: { open: false, onOpenChange: () => {}, onConfirm: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-red-500 px-4 py-2 text-white'
        >
          로그아웃 모달 열기
        </button>
        <LogoutModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => {
            alert('로그아웃되었습니다!');
            setOpen(false);
          }}
        />
      </div>
    );
  },
};
