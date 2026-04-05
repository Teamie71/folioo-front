import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogDeleteModal } from '@/features/log/components/LogDeleteModal';

const meta = {
  title: 'Log/LogDeleteModal',
  component: LogDeleteModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LogDeleteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    onConfirm: () => {},
    isDeleting: false,
    errorMessage: null,
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='rounded bg-red-500 px-4 py-2 text-white'
        >
          삭제 모달 열기
        </button>
        <LogDeleteModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => {
            alert('삭제 확인');
            setOpen(false);
          }}
          isDeleting={false}
          errorMessage={null}
        />
      </div>
    );
  },
};

export const ErrorState: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    onConfirm: () => {},
    isDeleting: false,
    errorMessage: '로그 삭제에 실패했습니다.',
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='rounded bg-red-500 px-4 py-2 text-white'
        >
          삭제 모달 열기 (에러)
        </button>
        <LogDeleteModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => {}}
          isDeleting={false}
          errorMessage='로그 삭제에 실패했습니다.'
        />
      </div>
    );
  },
};
