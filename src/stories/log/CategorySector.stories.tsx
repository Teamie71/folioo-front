import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InsightTemplateSelector } from '@/features/log/components/CategorySector';
import { templateFormStoryDecorator } from './templateFormStoryDecorator';

const meta = {
  title: 'Log/CategorySector',
  component: InsightTemplateSelector,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [templateFormStoryDecorator],
  tags: ['autodocs'],
} satisfies Meta<typeof InsightTemplateSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCategoryChange: () => {},
  },
  render: (args) => <InsightTemplateSelector {...args} />,
};
