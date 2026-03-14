import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ModalFunctionButton } from '@/components/ModalFunctionButton';

const meta = {
  title: 'Components/Buttons/ModalFunctionButton',
  component: ModalFunctionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ModalFunctionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 (수정만)
export const EditOnly: Story = {
  args: {
    onEdit: () => alert('수정 클릭!'),
  },
};

// 수정과 삭제
export const EditAndDelete: Story = {
  args: {
    onEdit: () => alert('수정 클릭!'),
    onDelete: () => alert('삭제 클릭!'),
  },
};

// 사용 예시
export const InContext: Story = {
  render: () => (
    <div className='p-8'>
      <div className='rounded-lg border border-gray-200 p-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-bold'>카드 제목</h3>
          <ModalFunctionButton
            onEdit={() => alert('수정!')}
            onDelete={() => alert('삭제!')}
          />
        </div>
        <p className='mt-2 text-gray-600'>카드 내용입니다.</p>
      </div>
    </div>
  ),
};
