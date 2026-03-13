import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Dropdown } from '@/components/Dropdown';
import { useState } from 'react';

const meta = {
  title: 'Components/Dropdowns/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  { id: '1', label: '옵션 1' },
  { id: '2', label: '옵션 2' },
  { id: '3', label: '옵션 3' },
];

// 기본 드롭다운
export const Default: Story = {
  args: { items: sampleItems, placeholder: '선택하세요' },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className='h-[400px] p-8'>
        <Dropdown
          items={sampleItems}
          value={value}
          onChange={setValue}
          placeholder='선택하세요'
        />
        <p className='mt-4 text-sm text-gray-600'>
          선택된 값: {value || '없음'}
        </p>
      </div>
    );
  },
};

// 삭제 가능한 항목
export const WithDelete: Story = {
  args: {
    items: [{ id: '1', label: '삭제 가능 항목 1' }],
  },
  render: () => {
    const [value, setValue] = useState('');
    const [items, setItems] = useState([
      {
        id: '1',
        label: '삭제 가능 항목 1',
        onDelete: (id: string) => {
          setItems((prev) => prev.filter((item) => item.id !== id));
          if (value === id) setValue('');
        },
      },
      {
        id: '2',
        label: '삭제 가능 항목 2',
        onDelete: (id: string) => {
          setItems((prev) => prev.filter((item) => item.id !== id));
          if (value === id) setValue('');
        },
      },
      {
        id: '3',
        label: '삭제 가능 항목 3',
        onDelete: (id: string) => {
          setItems((prev) => prev.filter((item) => item.id !== id));
          if (value === id) setValue('');
        },
      },
    ]);

    return (
      <div className='h-[400px] p-8'>
        <Dropdown
          items={items}
          value={value}
          onChange={setValue}
          placeholder='선택하세요 (hover시 삭제 가능)'
        />
        <p className='mt-4 text-sm text-gray-600'>
          선택된 값: {value || '없음'}
        </p>
      </div>
    );
  },
};
