import type { ComponentProps, ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MobileLogDetailView } from '@/features/log/components/mobile/MobileLogDetailView';

const CATEGORY_OPTIONS: ComponentProps<typeof MobileLogDetailView>['category'][] = [
  '대인관계',
  '문제해결',
  '학습',
  '레퍼런스',
  '기타',
];

type MobileLogDetailViewStoryArgs = Omit<
  ComponentProps<typeof MobileLogDetailView>,
  'category'
> & {
  logCategory: ComponentProps<typeof MobileLogDetailView>['category'];
};

function MobileLogDetailViewStoryView(args: MobileLogDetailViewStoryArgs) {
  const { logCategory, ...rest } = args;
  return <MobileLogDetailView {...rest} category={logCategory} />;
}

const MOBILE_LOG_DETAIL_STORY_CSS = `
.sb-mldv-host {
  position: relative;
  width: 100%;
  max-width: 430px;
  margin-left: auto;
  margin-right: auto;
  min-height: min(100vh, 900px);
  height: min(100vh, 900px);
  isolation: isolate;
}
.sb-mldv-host > div {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow-y: auto !important;
}
`;

function mobileLogDetailDecorator(Story: ComponentType) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOBILE_LOG_DETAIL_STORY_CSS }} />
      <div className='sb-mldv-host'>
        <Story />
      </div>
    </>
  );
}

const meta = {
  title: 'Log/Mobile/MobileLogDetailView',
  component: MobileLogDetailViewStoryView,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [mobileLogDetailDecorator],
  tags: ['autodocs'],
  argTypes: {
    date: { control: false },
    logCategory: {
      name: '카테고리',
      control: { type: 'select' },
      options: CATEGORY_OPTIONS,
    },
  },
} satisfies Meta<typeof MobileLogDetailViewStoryView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onDelete: () => {},
    onSave: async () => {},
    title: '모바일 상세',
    date: '2026-04-03',
    content: '본문입니다.',
    activityName: '활동 B',
    logCategory: '학습',
    otherLogTitles: ['중복제목'],
    isSaving: false,
    saveError: null,
  },
};
