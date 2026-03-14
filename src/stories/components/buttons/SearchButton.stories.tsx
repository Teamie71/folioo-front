import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchButton } from '@/components/SearchButton';

const meta = {
  title: 'Components/Buttons/SearchButton',
  component: SearchButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 검색 버튼
export const Default: Story = {
  args: {
    onClick: () => alert('검색!'),
  },
};
