import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogCard } from '@/features/log/components/LogCard';

type LogCardStoryArgs = Omit<ComponentProps<typeof LogCard>, 'category'> & {
  logCategory: ComponentProps<typeof LogCard>['category'];
};

const CATEGORY_OPTIONS: ComponentProps<typeof LogCard>['category'][] = [
  '대인관계',
  '문제해결',
  '학습',
  '레퍼런스',
  '기타',
];

function LogCardStoryView(args: LogCardStoryArgs) {
  const { logCategory, ...rest } = args;
  return <LogCard {...rest} category={logCategory} />;
}

const meta = {
  title: 'Log/LogCard',
  component: LogCardStoryView,
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
} satisfies Meta<typeof LogCardStoryView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '조용히 진행한 하루',
    date: '2026-04-03',
    content:
      '오늘은 작은 불편을 하나씩 정리하면서 전체 흐름을 개선해봤다.\n생각보다 효과가 컸다.',
    activityName: '활동 A',
    logCategory: '대인관계',
  },
};

export const LongContent: Story = {
  args: {
    title: '긴 내용 예시',
    date: '2026-04-03',
    content:
      '첫 줄입니다.\n둘째 줄입니다.\n셋째 줄입니다.\n넷째 줄은 카드에서 line-clamp로 잘리는지 확인합니다.',
    activityName: '활동 B',
    logCategory: '학습',
  },
};

export const UnclassifiedActivity: Story = {
  args: {
    title: '활동 태그 없음 예시',
    date: '2026-04-03',
    content: '활동명 미분류 케이스.',
    activityName: '미분류',
    logCategory: '기타',
  },
};
