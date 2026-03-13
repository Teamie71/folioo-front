import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PortfolioTypeCard } from '@/components/PortfolioTypeCard';
import { useState } from 'react';

const meta = {
  title: 'Components/Cards/PortfolioTypeCard',
  component: PortfolioTypeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PortfolioTypeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleIcon = () => (
  <svg width='80' height='80' viewBox='0 0 80 80' fill='none'>
    <path d='M40 10 L70 60 L10 60 Z' fill='currentColor' />
  </svg>
);

// 기본 카드
export const Default: Story = {
  args: {
    icon: <SampleIcon />,
    title: '텍스트형',
    description: '텍스트 기반 포트폴리오',
  },
};

// 선택된 카드
export const Selected: Story = {
  args: {
    icon: <SampleIcon />,
    title: '링크형',
    description: 'URL 기반 포트폴리오',
    selected: true,
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  args: {
    icon: <SampleIcon />,
    title: '텍스트형',
    description: '텍스트 기반',
  },
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div className='flex gap-4 p-8'>
        <PortfolioTypeCard
          icon={<SampleIcon />}
          title='텍스트형'
          description='텍스트 기반'
          selected={selected === 'text'}
          onClick={() => setSelected('text')}
        />
        <PortfolioTypeCard
          icon={<SampleIcon />}
          title='링크형'
          description='URL 기반'
          selected={selected === 'link'}
          onClick={() => setSelected('link')}
        />
        <PortfolioTypeCard
          icon={<SampleIcon />}
          title='파일형'
          description='파일 업로드'
          selected={selected === 'file'}
          onClick={() => setSelected('file')}
        />
      </div>
    );
  },
};
