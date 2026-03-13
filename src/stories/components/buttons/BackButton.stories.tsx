import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BackButton } from '@/components/BackButton';

const meta = {
  title: 'Components/Buttons/BackButton',
  component: BackButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BackButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 뒤로가기 버튼
export const Default: Story = {
  args: {},
};

// 클릭 이벤트 있는 버튼
export const WithClick: Story = {
  args: {
    onClick: () => alert('뒤로가기 클릭!'),
  },
};

// 특정 경로로 이동
export const WithHref: Story = {
  args: {
    href: '/',
  },
};
