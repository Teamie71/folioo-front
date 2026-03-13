import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DropdownButton } from '@/components/DropdownButton';
import { useState } from 'react';

const meta = {
  title: 'Components/Buttons/DropdownButton',
  component: DropdownButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleIcon = () => (
  <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
    <circle cx='10' cy='10' r='8' fill='currentColor' />
  </svg>
);

// 기본 드롭다운 버튼
export const Default: Story = {
  args: {
    items: [
      { id: '1', label: '옵션 1' },
      { id: '2', label: '옵션 2' },
      { id: '3', label: '옵션 3' },
    ],
  },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className='flex h-[300px] justify-end p-8'>
        <DropdownButton
          items={[
            { id: '1', label: '옵션 1' },
            { id: '2', label: '옵션 2' },
            { id: '3', label: '옵션 3' },
          ]}
          value={value}
          onChange={setValue}
        />
        <p className='ml-4 text-sm text-gray-600'>선택: {value || '없음'}</p>
      </div>
    );
  },
};

// 아이콘 포함
export const WithIcons: Story = {
  args: {
    items: [
      { id: '1', label: '텍스트형' },
      { id: '2', label: '링크형' },
      { id: '3', label: '파일형' },
    ],
  },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className='flex h-[300px] justify-end p-8'>
        <DropdownButton
          items={[
            { id: '1', label: '텍스트형', icon: <SampleIcon /> },
            { id: '2', label: '링크형', icon: <SampleIcon /> },
            { id: '3', label: '파일형', icon: <SampleIcon /> },
          ]}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// 삭제 가능한 항목
export const WithDelete: Story = {
  args: {
    items: [{ id: '1', label: '삭제 가능 1' }],
  },
  render: () => {
    const [value, setValue] = useState('');
    const [items, setItems] = useState([
      {
        id: '1',
        label: '삭제 가능 1',
        onDelete: (id: string) => {
          setItems((prev) => prev.filter((item) => item.id !== id));
          if (value === id) setValue('');
        },
      },
      {
        id: '2',
        label: '삭제 가능 2',
        onDelete: (id: string) => {
          setItems((prev) => prev.filter((item) => item.id !== id));
          if (value === id) setValue('');
        },
      },
    ]);

    return (
      <div className='flex h-[300px] justify-end p-8'>
        <DropdownButton items={items} value={value} onChange={setValue} />
      </div>
    );
  },
};
