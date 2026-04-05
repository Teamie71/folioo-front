import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  NoTemplateForm,
  InterpersonTemplateForm,
  ProblemSolveTemplateForm,
  LearningTemplateForm,
  ReferenceTemplateForm,
} from '@/features/log/components/CategoryTemplates';
import { templateFormStoryDecorator } from './templateFormStoryDecorator';

const meta = {
  title: 'Log/CategoryTemplates',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [templateFormStoryDecorator],
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoTemplate: Story = {
  render: () => {
    const [content, setContent] = useState('');
    return <NoTemplateForm content={content} setContent={setContent} />;
  },
};

export const Interperson: Story = {
  render: () => {
    const [data, setData] = useState({
      situation: '',
      response: '',
      result: '',
      lesson: '',
    });
    return <InterpersonTemplateForm data={data} setData={setData} />;
  },
};

export const ProblemSolve: Story = {
  render: () => {
    const [data, setData] = useState({
      problem: '',
      attempt: '',
      result: '',
      lesson: '',
    });
    return <ProblemSolveTemplateForm data={data} setData={setData} />;
  },
};

export const Learning: Story = {
  render: () => {
    const [data, setData] = useState({
      path: '',
      learned: '',
      plan: '',
    });
    return <LearningTemplateForm data={data} setData={setData} />;
  },
};

export const Reference: Story = {
  render: () => {
    const [data, setData] = useState({
      source: '',
      content: '',
      thought: '',
      plan: '',
    });
    return <ReferenceTemplateForm data={data} setData={setData} />;
  },
};
