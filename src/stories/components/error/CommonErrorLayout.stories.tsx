import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CommonErrorLayout } from '@/components/error/CommonErrorLayout';

const meta = {
  title: 'Components/Error/CommonErrorLayout',
  component: CommonErrorLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommonErrorLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 에러 페이지
export const Default: Story = {
  render: () => <CommonErrorLayout />,
};

// 모바일 뷰
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <CommonErrorLayout />,
};

// 태블릿 뷰
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <CommonErrorLayout />,
};

// 데스크톱 뷰
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  render: () => <CommonErrorLayout />,
};

// 다크 배경에서 보기
export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className='bg-gray-900'>
        <Story />
      </div>
    ),
  ],
  render: () => <CommonErrorLayout />,
};

// 인터랙션 가능 상태
export const Interactive: Story = {
  render: () => (
    <div>
      <CommonErrorLayout />
      <div className='fixed bottom-4 left-4 rounded bg-black/80 p-4 text-white'>
        <p className='text-sm'>
          💡 이메일 링크와 메인 페이지 버튼이 동작합니다.
        </p>
      </div>
    </div>
  ),
};
