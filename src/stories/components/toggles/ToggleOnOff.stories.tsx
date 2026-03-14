import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToggleOnOff } from '@/components/ToggleOnOff';
import { useState } from 'react';

const meta = {
  title: 'Components/Toggles/ToggleOnOff',
  component: ToggleOnOff,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleOnOff>;

export default meta;
type Story = StoryObj<typeof meta>;

// Off 상태
export const Off: Story = {
  args: {
    checked: false,
  },
};

// On 상태
export const On: Story = {
  args: {
    checked: true,
  },
};

// 인터랙티브
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className='p-8'>
        <ToggleOnOff checked={checked} onCheckedChange={setChecked} />
        <p className='mt-4 text-sm text-gray-600'>
          상태: {checked ? 'On' : 'Off'}
        </p>
      </div>
    );
  },
};

// 모든 상태
export const AllStates: Story = {
  render: () => (
    <div className='flex flex-col gap-6 p-8'>
      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>Off</h3>
        <ToggleOnOff checked={false} />
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-bold'>On</h3>
        <ToggleOnOff checked={true} />
      </div>
    </div>
  ),
};
