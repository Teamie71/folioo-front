import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileModal } from '@/components/ProfileModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/ProfileModal',
  component: ProfileModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 프로필 모달
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
          프로필 모달 열기
        </button>
        <ProfileModal open={open} onOpenChange={setOpen} />
        <p className='mt-4 text-sm text-gray-600'>
          ⚠️ 실제 프로필 데이터는 API에서 가져옵니다.
        </p>
      </div>
    );
  },
};
