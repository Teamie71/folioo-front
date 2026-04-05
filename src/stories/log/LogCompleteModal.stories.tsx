import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogCompleteModal } from '@/features/log/components/LogCompleteModal';

const meta = {
  title: 'Log/LogCompleteModal',
  component: LogCompleteModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LogCompleteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='rounded bg-[#5060C5] px-4 py-2 text-white'
        >
          완료 모달 열기
        </button>
        <LogCompleteModal open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};
