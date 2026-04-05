import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActivitySelect } from '@/features/log/components/ActivitySelect';

const meta = {
  title: 'Log/ActivitySelect',
  component: ActivitySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ActivitySelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className='w-[32rem]'>
        <ActivitySelect
          value={value}
          onChange={setValue}
          dropdownItems={[
            { id: '1', label: '활동 A' },
            { id: '2', label: '활동 B' },
            { id: '3', label: '디자인 리뷰' },
          ]}
        />
      </div>
    );
  },
};

export const WithErrorMessage: Story = {
  render: () => {
    const [value, setValue] = useState('활동 A');
    return (
      <div className='w-[32rem]'>
        <ActivitySelect
          value={value}
          onChange={setValue}
          dropdownItems={[
            { id: '1', label: '활동 A' },
            { id: '2', label: '활동 B' },
          ]}
          activityCountError='활동 분류는 최대 10개까지 등록할 수 있어요.'
        />
      </div>
    );
  },
};

