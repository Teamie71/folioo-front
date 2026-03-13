import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PortfolioCard } from '@/components/PortfolioCard';

const meta = {
  title: 'Components/Cards/PortfolioCard',
  component: PortfolioCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PortfolioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 카드
export const Default: Story = {
  args: {
    title: '프로젝트 제목',
    tag: '대외활동',
    date: '2024.01.15',
  },
};

// 선택된 카드
export const Selected: Story = {
  args: {
    title: '선택된 프로젝트',
    tag: '인턴',
    date: '2024.02.20',
    selected: true,
  },
};

// 클릭 가능한 카드
export const Clickable: Story = {
  args: {
    title: '클릭 가능한 프로젝트',
    tag: '동아리',
    date: '2024.03.10',
    onClick: () => alert('카드 클릭!'),
  },
};

// 모든 상태 한눈에 보기
export const AllStates: Story = {
  args: {
    title: 'AI 챗봇 개발 프로젝트',
    tag: '대외활동',
    date: '2024.01.15',
  },
  render: () => (
    <div className='flex flex-col gap-4 p-8'>
      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>기본 카드</h3>
        <PortfolioCard
          title='AI 챗봇 개발 프로젝트'
          tag='대외활동'
          date='2024.01.15'
        />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>선택된 카드</h3>
        <PortfolioCard
          title='스타트업 인턴십'
          tag='인턴'
          date='2024.02.20'
          selected
        />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>클릭 가능한 카드</h3>
        <PortfolioCard
          title='개발 동아리 활동'
          tag='동아리'
          date='2024.03.10'
          onClick={() => alert('카드 클릭!')}
        />
      </div>
    </div>
  ),
};
