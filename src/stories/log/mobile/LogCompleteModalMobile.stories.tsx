import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogCompleteModalMobile } from '@/features/log/components/mobile/LogCompleteModalMobile';

const meta = {
  title: 'Log/Mobile/LogCompleteModalMobile',
  component: LogCompleteModalMobile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LogCompleteModalMobile>;

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
          열기
        </button>
        <LogCompleteModalMobile open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};
