import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { MobileLogForm } from '@/features/log/components/mobile/MobileLogForm';

const W = 328;

const pretendardWoff2 = new URL(
  '../../../app/fonts/PretendardVariable.woff2',
  import.meta.url,
).href;

const VIEWPORTS = {
  figma360: {
    name: `${W} × 844`,
    styles: { width: `${W}px`, height: '844px' },
    type: 'mobile' as const,
  },
};

const STORY_CSS = `
@font-face {
  font-family: 'Pretendard Variable';
  font-style: normal;
  font-weight: 45 920;
  font-display: swap;
  src: url('${pretendardWoff2}') format('woff2');
}
.sb-mlf-shell {
  overflow-x: hidden;
}
.sb-mlf {
  --font-pretendard: 'Pretendard Variable', 'Pretendard', sans-serif;
  box-sizing: border-box;
  width: ${W}px;
  max-width: ${W}px;
  min-width: ${W}px;
  flex-shrink: 0;
}
.sb-mlf [role="group"] {
  flex-wrap: wrap !important;
  gap: 0.75rem !important;
}
.sb-mlf .md\\:flex-row {
  flex-direction: column !important;
  align-items: stretch !important;
}
.sb-mlf [class*="w-[51.25rem]"] {
  width: 100% !important;
  max-width: 100% !important;
}
.sb-mlf .hidden.md\\:block {
  display: none !important;
}
.sb-mlf .md\\:text-\\[1\\.125rem\\] {
  font-size: 1rem !important;
}
.sb-mlf .md\\:font-bold {
  font-weight: 400 !important;
}
.sb-mlf .md\\:gap-\\[1\\.25rem\\] {
  gap: 0.75rem !important;
}
.sb-mlf .md\\:gap-\\[1rem\\] {
  gap: 0.5rem !important;
}
.sb-mlf .md\\:flex-nowrap {
  flex-wrap: wrap !important;
}
`;

function storyDecorator(Story: ComponentType) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STORY_CSS }} />
      <div className='sb-mlf-shell flex min-h-[100dvh] w-full flex-col items-center bg-[#f6f8fa] py-6'>
        <div className='sb-mlf box-border overflow-x-hidden bg-white p-4 font-sans antialiased shadow-[0_0_0_1px_rgba(0,0,0,0.06)]'>
          <Story />
        </div>
      </div>
    </>
  );
}

const meta = {
  title: 'Log/Mobile/MobileLogForm',
  component: MobileLogForm,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'figma360',
      options: { ...VIEWPORTS, ...INITIAL_VIEWPORTS },
    },
  },
  globals: {
    viewport: { value: 'figma360', isRotated: false },
  },
  decorators: [storyDecorator],
  tags: ['autodocs'],
} satisfies Meta<typeof MobileLogForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onLogCreated: () => {} },
};
