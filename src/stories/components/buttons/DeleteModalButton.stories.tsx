import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DeleteModalButton } from '@/components/DeleteModalButton';

const meta = {
  title: 'Components/Buttons/DeleteModalButton',
  component: DeleteModalButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeleteModalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 삭제 모달 버튼
export const Default: Story = {
  args: {
    title: '정말 삭제하시겠습니까?',
    onDelete: () => alert('삭제되었습니다!'),
  },
};

// 커스텀 타이틀
export const CustomTitle: Story = {
  args: {
    title: '이 항목을 영구적으로 삭제하시겠습니까?',
    onDelete: () => alert('삭제되었습니다!'),
  },
};
