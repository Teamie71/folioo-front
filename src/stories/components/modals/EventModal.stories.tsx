import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EventModal } from '@/components/EventModal';
import type { TicketGrantNoticeResDTO } from '@/api/models';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/EventModal',
  component: EventModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleNotice = {
  id: 1,
  ticketGrantId: 1,
  status: 'SHOWN' as const,
  title: '인사이트 로그 작성 챌린지',
  body: '경험 정리 1회권',
  ctaText: '경험 정리하기',
  ctaLink: '/experience/settings',
  payload: {
    displayReason: '인사이트 로그 작성 챌린지',
  },
  createdAt: new Date().toISOString(),
};

// 이벤트 모달
export const Default: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    notice: sampleNotice as unknown as TicketGrantNoticeResDTO,
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-yellow-500 px-4 py-2 text-white'
        >
          이벤트 보상 모달
        </button>
        <EventModal
          open={open}
          onOpenChange={setOpen}
          notice={sampleNotice as unknown as TicketGrantNoticeResDTO}
          onButtonClick={() => alert('경험 정리하기 클릭!')}
        />
      </div>
    );
  },
};
