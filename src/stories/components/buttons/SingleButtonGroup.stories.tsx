import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SingleButtonGroup } from '@/components/SingleButtonGroup';
import { useState } from 'react';

const meta = {
  title: 'Components/Buttons/SingleButtonGroup',
  component: SingleButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SingleButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 버튼 그룹
export const Default: Story = {
  args: {
    options: [{ label: '옵션 1' }, { label: '옵션 2' }, { label: '옵션 3' }],
    value: '옵션 1',
  },
  render: () => {
    const [value, setValue] = useState('옵션 1');
    return (
      <div className='p-8'>
        <SingleButtonGroup
          options={[
            { label: '옵션 1' },
            { label: '옵션 2' },
            { label: '옵션 3' },
          ]}
          value={value}
          onValueChange={setValue}
        />
        <p className='mt-4 text-sm text-gray-600'>선택: {value}</p>
      </div>
    );
  },
};

// 아이콘 포함
export const WithIcons: Story = {
  args: {
    options: [{ label: '텍스트' }],
    value: '텍스트',
  },
  render: () => {
    const [value, setValue] = useState('텍스트');
    return (
      <div className='p-8'>
        <SingleButtonGroup
          options={[
            {
              label: '텍스트',
              icon: (
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <rect width='20' height='20' rx='2' fill='currentColor' />
                </svg>
              ),
            },
            {
              label: '링크',
              icon: (
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <circle cx='10' cy='10' r='8' fill='currentColor' />
                </svg>
              ),
            },
          ]}
          value={value}
          onValueChange={setValue}
        />
        <p className='mt-4 text-sm text-gray-600'>선택: {value}</p>
      </div>
    );
  },
};
