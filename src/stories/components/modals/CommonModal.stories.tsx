import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CommonModal } from '@/components/CommonModal';
import { useState } from 'react';

const meta = {
  title: 'Components/Modals/CommonModal',
  component: CommonModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommonModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 모달 (확인/취소)
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
          모달 열기
        </button>
        <CommonModal
          open={open}
          onOpenChange={setOpen}
          title='모달 제목'
          description='모달 설명 텍스트입니다.'
          primaryBtnText='확인'
          cancelBtnText='취소'
          onPrimaryClick={() => {
            alert('확인 클릭!');
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

// 삭제 확인 모달
export const DeleteConfirm: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-red-500 px-4 py-2 text-white'
        >
          삭제 모달 열기
        </button>
        <CommonModal
          open={open}
          onOpenChange={setOpen}
          title='정말 삭제하시겠습니까?'
          description='이 작업은 되돌릴 수 없습니다.'
          primaryBtnText='삭제'
          cancelBtnText='취소'
          primaryBtnVariant='destructive'
          onPrimaryClick={() => {
            alert('삭제됨!');
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

// 알림 모달 (버튼 없음, 자동 닫기)
export const AutoClose: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-green-500 px-4 py-2 text-white'
        >
          알림 모달 열기
        </button>
        <CommonModal
          open={open}
          onOpenChange={setOpen}
          title='저장되었습니다'
          description='2초 후 자동으로 닫힙니다.'
        />
      </div>
    );
  },
};

// 닫기 버튼만 있는 모달
export const CloseButtonOnly: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className='rounded bg-purple-500 px-4 py-2 text-white'
        >
          닫기 전용 모달
        </button>
        <CommonModal
          open={open}
          onOpenChange={setOpen}
          title='안내 메시지'
          description='X 버튼으로만 닫을 수 있습니다.'
          closeButtonOnly
        />
      </div>
    );
  },
};
