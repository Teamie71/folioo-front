import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogDetailModal } from '@/features/log/components/LogCardDetailModal';

const CATEGORY_OPTIONS: ComponentProps<typeof LogDetailModal>['category'][] = [
  '대인관계',
  '문제해결',
  '학습',
  '레퍼런스',
  '기타',
];

type LogDetailModalStoryArgs = Omit<
  ComponentProps<typeof LogDetailModal>,
  'category'
> & {
  logCategory: ComponentProps<typeof LogDetailModal>['category'];
};

function LogDetailModalStoryView(args: LogDetailModalStoryArgs) {
  const { logCategory, ...rest } = args;
  return <LogDetailModal {...rest} category={logCategory} />;
}

const meta = {
  title: 'Log/LogCardDetailModal',
  component: LogDetailModalStoryView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    date: { control: false },
    logCategory: {
      name: '카테고리',
      control: { type: 'select' },
      options: CATEGORY_OPTIONS,
    },
  },
} satisfies Meta<typeof LogDetailModalStoryView>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleProps = {
  title: '오늘의 인사이트',
  date: '2026-04-03',
  content: '관찰한 문제를 작은 단위로 나누니 해결 속도가 빨라졌다.',
  activityName: '활동 A',
  logCategory: '문제해결',
  otherLogTitles: ['기존 제목 1', '기존 제목 2'],
};

export const Default: Story = {
  args: {
    ...sampleProps,
    isOpen: false,
    onClose: () => {},
    onSave: async () => {},
    onDelete: () => {},
    isSaving: false,
    saveError: null,
  },
  render: (args) => {
    const { logCategory, ...rest } = args;
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='rounded bg-[#5060C5] px-4 py-2 text-white'
        >
          열기
        </button>
        <LogDetailModal
          {...rest}
          category={logCategory}
          isOpen={open}
          onClose={() => setOpen(false)}
          onSave={async (data) => {
            alert(JSON.stringify(data));
          }}
          onDelete={() => alert('delete')}
        />
      </div>
    );
  },
};
