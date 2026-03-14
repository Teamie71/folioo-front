import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useState } from 'react';

const meta = {
  title: 'Components/Forms/MarkdownEditor',
  component: MarkdownEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MarkdownEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 마크다운 에디터
export const Default: Story = {
  args: {
    value: '',
    placeholder: '마크다운을 입력하세요...',
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className='w-[600px] p-8'>
        <MarkdownEditor
          value={value}
          onChange={setValue}
          placeholder='마크다운을 입력하세요...'
        />
        <div className='mt-4 rounded border p-4'>
          <h3 className='mb-2 text-sm font-bold'>마크다운 출력:</h3>
          <pre className='text-xs whitespace-pre-wrap text-gray-600'>
            {value || '(입력된 내용이 없습니다)'}
          </pre>
        </div>
      </div>
    );
  },
};

// 초기값 포함
export const WithInitialValue: Story = {
  args: {
    value: '# 제목\n\n본문 내용입니다.',
    placeholder: '마크다운을 입력하세요...',
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState(
      '# 제목\n\n본문 내용입니다.\n\n- 리스트 1\n- 리스트 2',
    );
    return (
      <div className='w-[600px] p-8'>
        <MarkdownEditor
          value={value}
          onChange={setValue}
          placeholder='마크다운을 입력하세요...'
        />
      </div>
    );
  },
};

// 커스텀 높이
export const CustomHeight: Story = {
  args: {
    value: '',
    placeholder: '높이가 큰 에디터...',
    minHeight: '400px',
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className='w-[600px] p-8'>
        <MarkdownEditor
          value={value}
          onChange={setValue}
          placeholder='높이가 큰 에디터...'
          minHeight='400px'
        />
      </div>
    );
  },
};
