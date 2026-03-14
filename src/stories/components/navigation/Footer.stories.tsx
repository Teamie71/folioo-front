import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Footer from '@/components/Footer';

const meta = {
  title: 'Components/Navigation/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 푸터
export const Default: Story = {};

// 페이지 컨텍스트
export const WithPageContent: Story = {
  render: () => (
    <div>
      <div className='min-h-screen bg-white p-8'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='mb-4 text-4xl font-bold'>페이지 콘텐츠</h1>
          <p className='text-gray-700'>
            아래로 스크롤하면 Footer를 확인할 수 있습니다.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  ),
};
