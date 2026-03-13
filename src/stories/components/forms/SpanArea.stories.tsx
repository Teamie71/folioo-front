import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SpanArea from '@/components/SpanArea';

const meta = {
  title: 'Components/Forms/SpanArea',
  component: SpanArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SpanArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스팬 영역
export const Default: Story = {
  args: {
    children: '텍스트 내용',
    width: '400px',
  },
};

// 긴 텍스트
export const LongText: Story = {
  args: {
    children:
      '이것은 긴 텍스트 예시입니다. 여러 줄에 걸쳐서 표시될 수 있으며, 자동으로 줄바꿈됩니다.',
    width: '400px',
  },
};

// 커스텀 크기
export const CustomSize: Story = {
  args: {
    children: '커스텀 크기의 SpanArea',
    width: '500px',
    height: '100px',
  },
};

// 모든 변형
export const AllVariants: Story = {
  args: {
    children: '짧은 텍스트',
    width: '400px',
  },
  render: () => (
    <div className='flex flex-col gap-6 p-8'>
      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>기본</h3>
        <SpanArea width='400px'>짧은 텍스트</SpanArea>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>긴 텍스트</h3>
        <SpanArea width='400px'>
          이것은 긴 텍스트 예시입니다. 여러 줄에 걸쳐서 표시될 수 있으며,
          자동으로 줄바꿈되어 사용자에게 표시됩니다.
        </SpanArea>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>고정 높이</h3>
        <SpanArea width='400px' height='120px'>
          고정된 높이를 가진 SpanArea
        </SpanArea>
      </div>
    </div>
  ),
};
