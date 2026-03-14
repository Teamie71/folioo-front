import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileEditButton } from '@/components/ProfileEditButton';
import { useState } from 'react';

const meta = {
  title: 'Components/Buttons/ProfileEditButton',
  component: ProfileEditButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileEditButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙티브 예시
export const Default: Story = {
  args: { value: '홍길동' },
  render: () => {
    const [name, setName] = useState('홍길동');
    return (
      <div className='w-[400px] p-8'>
        <ProfileEditButton value={name} onSave={setName} />
        <p className='mt-4 text-sm text-gray-600'>현재 이름: {name}</p>
      </div>
    );
  },
};

// 빈 값
export const Empty: Story = {
  args: { value: '' },
  render: () => {
    const [name, setName] = useState('');
    return (
      <div className='w-[400px] p-8'>
        <ProfileEditButton value={name} onSave={setName} />
        <p className='mt-4 text-sm text-gray-600'>
          현재 이름: {name || '없음'}
        </p>
      </div>
    );
  },
};
