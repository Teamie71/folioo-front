import type { ComponentProps, ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MobileLogCard } from '@/features/log/components/mobile/MobileLogCard';

const MOBILE_PREVIEW_MAX_WIDTH_PX = 343;

const pretendardWoff2 = new URL(
  '../../../app/fonts/PretendardVariable.woff2',
  import.meta.url,
).href;

type MobileLogCardStoryArgs = Omit<
  ComponentProps<typeof MobileLogCard>,
  'category'
> & {
  logCategory: ComponentProps<typeof MobileLogCard>['category'];
};

const CATEGORY_OPTIONS: ComponentProps<typeof MobileLogCard>['category'][] = [
  '대인관계',
  '문제해결',
  '학습',
  '레퍼런스',
  '기타',
];

function MobileLogCardStoryView(args: MobileLogCardStoryArgs) {
  const { logCategory, ...rest } = args;
  return <MobileLogCard {...rest} category={logCategory} />;
}

const STORY_ONLY_FONT_CSS = `
@font-face {
  font-family: 'Pretendard Variable';
  font-style: normal;
  font-weight: 45 920;
  font-display: swap;
  src: url('${pretendardWoff2}') format('woff2');
}
.sb-mlc-preview {
  --font-pretendard: 'Pretendard Variable', 'Pretendard', sans-serif;
}
`;

function mobileLogCardDecorator(Story: ComponentType) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STORY_ONLY_FONT_CSS }} />
      <div
        className='sb-mlc-preview mx-auto w-full bg-[#f6f8fa] p-4 font-sans antialiased'
        style={{ maxWidth: MOBILE_PREVIEW_MAX_WIDTH_PX }}
      >
        <Story />
      </div>
    </>
  );
}

const meta = {
  title: 'Log/Mobile/MobileLogCard',
  component: MobileLogCardStoryView,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [mobileLogCardDecorator],
  tags: ['autodocs'],
  argTypes: {
    date: { control: false },
    logCategory: {
      name: '카테고리',
      control: { type: 'select' },
      options: CATEGORY_OPTIONS,
    },
  },
} satisfies Meta<typeof MobileLogCardStoryView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '조용히 진행한 하루',
    date: '2026-04-03',
    content:
      '오늘은 작은 불편을 하나씩 정리하면서 전체 흐름을 개선해봤다.\n생각보다 효과가 컸다.',
    activityName: '활동 A',
    logCategory: '레퍼런스',
  },
};
