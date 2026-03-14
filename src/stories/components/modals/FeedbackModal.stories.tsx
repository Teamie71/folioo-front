import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/FeedbackModal',
  component: FeedbackModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 첫 피드백
export const FirstFeedback: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    isFirstFeedback: true,
    onFeedbackClick: () => {},
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-green-500 px-4 py-2 text-white'
        >
          첫 피드백 모달
        </button>
        <FeedbackModal
          open={open}
          onOpenChange={setOpen}
          isFirstFeedback={true}
          onFeedbackClick={() => alert('피드백 제출!')}
        />
      </div>
    );
  },
};

// 일반 피드백
export const RegularFeedback: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    isFirstFeedback: false,
    onFeedbackClick: () => {},
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-blue-500 px-4 py-2 text-white'
        >
          일반 피드백 모달
        </button>
        <FeedbackModal
          open={open}
          onOpenChange={setOpen}
          isFirstFeedback={false}
          onFeedbackClick={() => alert('피드백 제출!')}
        />
      </div>
    );
  },
};
