import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileButton } from '@/components/ProfileButton';
import { useState } from 'react';

const meta = {
  title: 'Components/Buttons/ProfileButton',
  component: ProfileButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 프로필 버튼
export const Default: Story = {
  args: { onClick: () => {}, isOpen: false },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className='p-8'>
        <ProfileButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <p className='mt-4 text-sm text-gray-600'>
          상태: {isOpen ? '열림' : '닫힘'}
        </p>
      </div>
    );
  },
};

// 열린 상태
export const Open: Story = {
  args: {
    isOpen: true,
    onClick: () => alert('클릭!'),
  },
};

// 닫힌 상태
export const Closed: Story = {
  args: {
    isOpen: false,
    onClick: () => alert('클릭!'),
  },
};
