import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CreditExpireAlert } from '@/components/CreditExpireAlert';

const meta = {
  title: 'Components/Progress/CreditExpireAlert',
  component: CreditExpireAlert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreditExpireAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

// 이용권 만료 알림
export const Default: Story = {
  args: {
    message: '만료 예정 이용권이 있어요',
    expiringDays: 30,
  },
  render: (args) => (
    <div className='w-[600px] p-8'>
      <CreditExpireAlert {...args} />
      <p className='mt-4 text-sm text-gray-600'>
        ⚠️ 실제 데이터는 API에서 가져옵니다.
      </p>
    </div>
  ),
};
