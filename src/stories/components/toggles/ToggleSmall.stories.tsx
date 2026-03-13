import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToggleSmall } from '@/components/ToggleSmall';
import { useState } from 'react';

const meta = {
  title: 'Components/Toggles/ToggleSmall',
  component: ToggleSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 토글
export const Default: Story = {
  args: {
    options: [
      { label: '옵션 1', value: 'option1' },
      { label: '옵션 2', value: 'option2' },
    ],
    value: 'option1',
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <div className='p-8'>
        <ToggleSmall
          options={[
            { label: '옵션 1', value: 'option1' },
            { label: '옵션 2', value: 'option2' },
          ]}
          value={value}
          onChange={setValue}
        />
        <p className='mt-4 text-sm text-gray-600'>선택: {value}</p>
      </div>
    );
  },
};

// 3개 옵션
export const ThreeOptions: Story = {
  args: {
    options: [
      { label: '탭 1', value: 'tab1' },
      { label: '탭 2', value: 'tab2' },
      { label: '탭 3', value: 'tab3' },
    ],
    value: 'tab1',
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState('tab1');
    return (
      <div className='p-8'>
        <ToggleSmall
          options={[
            { label: '탭 1', value: 'tab1' },
            { label: '탭 2', value: 'tab2' },
            { label: '탭 3', value: 'tab3' },
          ]}
          value={value}
          onChange={setValue}
        />
        <p className='mt-4 text-sm text-gray-600'>선택: {value}</p>
      </div>
    );
  },
};
