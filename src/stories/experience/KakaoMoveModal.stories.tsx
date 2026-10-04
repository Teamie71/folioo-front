import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { KakaoMoveModal } from '@/features/experience/list/components/KakaoMoveModal';

function ModalPreview({
  accountConnectionRequired = false,
}: {
  accountConnectionRequired?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type='button' onClick={() => setOpen(true)}>
        카카오톡 모달 열기
      </button>
      <KakaoMoveModal
        open={open}
        onOpenChange={setOpen}
        accountConnectionRequired={accountConnectionRequired}
      />
    </>
  );
}

const meta = {
  title: 'Experience/Agent/KakaoMoveModal',
  component: ModalPreview,
} satisfies Meta<typeof ModalPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const AccountConnectionRequired: Story = {
  args: { accountConnectionRequired: true },
};
