import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentType } from 'react';
import {
  LogContentToggle,
  type LogContentType,
} from '@/features/log/components/mobile/LogContentToggle';

function InteractiveLogContentToggle({
  valueFromArgs,
}: {
  valueFromArgs: LogContentType;
}) {
  const [value, setValue] = useState<LogContentType>(valueFromArgs);

  useEffect(() => {
    setValue(valueFromArgs);
  }, [valueFromArgs]);

  return <LogContentToggle value={value} onValueChange={setValue} />;
}

function mobileFrameDecorator(Story: ComponentType) {
  return (
    <div className='min-h-screen bg-[#f6f8fa] py-6'>
      <div className='mx-auto w-full max-w-[430px] bg-white shadow-[0_0_0_1px_#e9eaec]'>
        <Story />
      </div>
    </div>
  );
}

const meta = {
  title: 'Log/Mobile/LogContentToggle',
  component: LogContentToggle,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [mobileFrameDecorator],
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'inline-radio',
      options: ['create', 'list'],
    },
    onValueChange: { table: { disable: true } },
  },
} satisfies Meta<typeof LogContentToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateSelected: Story = {
  args: {
    value: 'create',
    onValueChange: () => {},
  },
  render: (args) => (
    <InteractiveLogContentToggle valueFromArgs={args.value} />
  ),
};

export const ListSelected: Story = {
  args: {
    value: 'list',
    onValueChange: () => {},
  },
  render: (args) => (
    <InteractiveLogContentToggle valueFromArgs={args.value} />
  ),
};
