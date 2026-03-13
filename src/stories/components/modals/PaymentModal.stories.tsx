import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PaymentModal } from '@/components/PaymentModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/PaymentModal',
  component: PaymentModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PaymentModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 결제 모달
export const Default: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    productName: '경험 정리 1회권',
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-green-500 px-4 py-2 text-white'
        >
          결제 모달 열기
        </button>
        <PaymentModal
          open={open}
          onOpenChange={setOpen}
          productName='경험 정리 1회권'
          onConfirm={() => alert('결제 완료!')}
        />
      </div>
    );
  },
};

// 다른 상품
export const CorrectionTicket: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    productName: '포트폴리오 첨삭 1회권',
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-blue-500 px-4 py-2 text-white'
        >
          첨삭 이용권 결제
        </button>
        <PaymentModal
          open={open}
          onOpenChange={setOpen}
          productName='포트폴리오 첨삭 1회권'
          onConfirm={() => alert('결제 완료!')}
        />
      </div>
    );
  },
};
