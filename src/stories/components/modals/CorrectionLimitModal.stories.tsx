import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CorrectionLimitModal } from '@/components/CorrectionLimitModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/CorrectionLimitModal',
  component: CorrectionLimitModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CorrectionLimitModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 첨삭 개수 제한 모달
export const Default: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-orange-500 px-4 py-2 text-white'
        >
          첨삭 제한 모달 열기
        </button>
        <CorrectionLimitModal open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};
