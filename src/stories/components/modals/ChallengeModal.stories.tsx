import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChallengeModal } from '@/components/ChallengeModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/ChallengeModal',
  component: ChallengeModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChallengeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 3개 작성 (진행 중)
export const ThreeStamps: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-purple-500 px-4 py-2 text-white'
        >
          챌린지 모달 (3개)
        </button>
        <ChallengeModal
          open={open}
          onOpenChange={setOpen}
          currentCount={3}
          hasWrittenToday={false}
          onLogClick={() => alert('로그 작성하기 클릭!')}
        />
      </div>
    );
  },
};

// 오늘 작성 완료
export const TodayCompleted: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-blue-500 px-4 py-2 text-white'
        >
          오늘 작성 완료
        </button>
        <ChallengeModal
          open={open}
          onOpenChange={setOpen}
          currentCount={5}
          hasWrittenToday={true}
        />
      </div>
    );
  },
};

// 10개 완료 (보상 받기)
export const Completed: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-green-500 px-4 py-2 text-white'
        >
          챌린지 완료!
        </button>
        <ChallengeModal
          open={open}
          onOpenChange={setOpen}
          currentCount={10}
          hasWrittenToday={false}
        />
      </div>
    );
  },
};
