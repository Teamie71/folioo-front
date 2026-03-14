import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FeedbackFloatingButton } from '@/components/FeedbackFloatingButton';

const meta = {
  title: 'Components/Buttons/FeedbackFloatingButton',
  component: FeedbackFloatingButton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackFloatingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 피드백 플로팅 버튼
export const Default: Story = {
  render: () => (
    <div className='relative h-screen bg-gray-100'>
      <div className='p-8'>
        <h1 className='mb-4 text-2xl font-bold'>페이지 콘텐츠</h1>
        <p className='text-gray-700'>
          우측 하단에 플로팅 피드백 버튼이 표시됩니다.
        </p>
        <p className='mt-4 text-sm text-orange-600'>
          ⚠️ 버튼을 hover하면 "피드백 남기기" 텍스트가 나타납니다.
        </p>
      </div>
      <FeedbackFloatingButton />
    </div>
  ),
};

// 스크롤 컨텍스트
export const WithScrollContent: Story = {
  render: () => (
    <div className='relative bg-gray-50'>
      <div className='space-y-8 p-8'>
        <section className='flex h-screen items-center justify-center rounded-lg bg-white shadow'>
          <div className='text-center'>
            <h1 className='mb-4 text-4xl font-bold'>첫 번째 섹션</h1>
            <p className='text-gray-600'>아래로 스크롤하세요</p>
          </div>
        </section>

        <section className='flex h-screen items-center justify-center rounded-lg bg-white shadow'>
          <div className='text-center'>
            <h1 className='mb-4 text-4xl font-bold'>두 번째 섹션</h1>
            <p className='text-gray-600'>플로팅 버튼은 항상 보입니다</p>
          </div>
        </section>

        <section className='flex h-screen items-center justify-center rounded-lg bg-white shadow'>
          <div className='text-center'>
            <h1 className='mb-4 text-4xl font-bold'>세 번째 섹션</h1>
            <p className='text-gray-600'>우측 하단을 확인하세요</p>
          </div>
        </section>
      </div>
      <FeedbackFloatingButton />
    </div>
  ),
};
