import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DeleteButton } from '@/components/DeleteButton';

const meta = {
  title: 'Components/Buttons/DeleteButton',
  component: DeleteButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeleteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 삭제 버튼
export const Default: Story = {
  args: {
    onClick: () => alert('삭제!'),
  },
};

// 커스텀 텍스트
export const CustomText: Story = {
  args: {
    text: '제거',
    onClick: () => alert('제거!'),
  },
};
