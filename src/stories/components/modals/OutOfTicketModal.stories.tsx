import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OutOfTicketModal } from '@/components/OutOfTicketModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/OutOfTicketModal',
  component: OutOfTicketModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OutOfTicketModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 경험 정리 이용권 부족
export const ExperienceTicket: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    ticketTypes: ['experience'],
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-orange-500 px-4 py-2 text-white'
        >
          경험 정리 이용권 부족 모달
        </button>
        <OutOfTicketModal
          open={open}
          onOpenChange={setOpen}
          ticketTypes={['experience']}
          onPurchase={(type) => alert(`${type} 구매!`)}
        />
      </div>
    );
  },
};

// 포트폴리오 첨삭 이용권 부족
export const CorrectionTicket: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    ticketTypes: ['correction'],
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-purple-500 px-4 py-2 text-white'
        >
          첨삭 이용권 부족 모달
        </button>
        <OutOfTicketModal
          open={open}
          onOpenChange={setOpen}
          ticketTypes={['correction']}
          onPurchase={(type) => alert(`${type} 구매!`)}
        />
      </div>
    );
  },
};

// 두 가지 모두
export const BothTickets: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    ticketTypes: ['experience', 'correction'],
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-red-500 px-4 py-2 text-white'
        >
          이용권 부족 모달 (둘 다)
        </button>
        <OutOfTicketModal
          open={open}
          onOpenChange={setOpen}
          ticketTypes={['experience', 'correction']}
          onPurchase={(type) => alert(`${type} 구매!`)}
        />
      </div>
    );
  },
};
