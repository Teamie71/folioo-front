import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InlineEdit } from '@/components/InlineEdit';
import { useState } from 'react';

const meta = {
  title: 'Components/Forms/InlineEdit',
  component: InlineEdit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙티브 인라인 편집
export const Default: Story = {
  args: { title: '프로젝트 제목' },
  render: () => {
    const [title, setTitle] = useState('프로젝트 제목');
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className='w-[500px] p-8'>
        <InlineEdit
          title={title}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={(newTitle) => {
            setTitle(newTitle);
            setIsEditing(false);
          }}
        />
        <p className='mt-4 text-sm text-gray-600'>현재 제목: {title}</p>
      </div>
    );
  },
};

// 편집 불가능한 상태
export const NotEditable: Story = {
  args: { title: '편집할 수 없는 제목', editable: false },
  render: () => (
    <div className='p-8'>
      <InlineEdit title='편집할 수 없는 제목' editable={false} />
    </div>
  ),
};
