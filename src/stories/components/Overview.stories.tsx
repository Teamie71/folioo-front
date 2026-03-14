import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CommonButton } from '@/components/CommonButton';
import { CommonModal } from '@/components/CommonModal';
import TextField from '@/components/TextField';
import { ToggleLarge } from '@/components/ToggleLarge';
import Navbar from '@/components/Navbar';
import { PortfolioCard } from '@/components/PortfolioCard';
import { StepProgressBar } from '@/components/StepProgressBar';
import { Dropdown } from '@/components/Dropdown';
import SpanArea from '@/components/SpanArea';
import { CommonErrorLayout } from '@/components/error/CommonErrorLayout';

/** tokens.json 기준: Gray2 #f6f8fa, White #ffffff, Gray3 #e9eaec, Gray9 #1a1a1a, Gray6 #74777d */
const t = {
  bg: '#f6f8fa',
  card: '#ffffff',
  border: '#e9eaec',
  title: '#1a1a1a',
  desc: '#74777d',
};

const meta = {
  title: 'Components/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Folioo Components Overview

카테고리별 UI 컴포넌트 목록입니다.
- Buttons, Modals, Forms, Toggles, Navigation, Cards, Progress, Dropdowns, Accordion/Forms(SpanArea), Error
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className='mb-6 rounded-lg border p-6'
      style={{ backgroundColor: t.card, borderColor: t.border }}
    >
      <h2 className='text-lg font-semibold' style={{ color: t.title }}>
        {title}
      </h2>
      <p className='mt-1 text-sm' style={{ color: t.desc }}>
        {description}
      </p>
      <div className='mt-4'>{children}</div>
    </section>
  );
}

export const AllCategories: Story = {
  render: () => (
    <div className='min-h-screen p-8' style={{ backgroundColor: t.bg }}>
      <div className='mx-auto max-w-3xl'>
        <h1 className='mb-2 text-2xl font-bold' style={{ color: t.title }}>
          Folioo Components
        </h1>
        <p className='mb-8 text-sm' style={{ color: t.desc }}>
          왼쪽 사이드바에서 카테고리별 Overview 또는 개별 컴포넌트를 선택하세요.
        </p>

        <Section
          title='Buttons'
          description='CommonButton, BackButton, SearchButton, DeleteButton 등'
        >
          <div className='flex flex-wrap gap-2'>
            <CommonButton variantType='Primary' px='1.5rem' py='0.5rem'>
              Primary
            </CommonButton>
            <CommonButton variantType='Outline' px='1.5rem' py='0.5rem'>
              Outline
            </CommonButton>
          </div>
        </Section>

        <Section
          title='Modals'
          description='CommonModal, LoginRequiredModal, PaymentModal 등'
        >
          <div
            className='rounded border border-dashed p-4 text-sm'
            style={{ borderColor: t.border, color: t.desc }}
          >
            모달 컴포넌트는 각 Modals 스토리에서 확인하세요.
          </div>
        </Section>

        <Section
          title='Forms'
          description='TextField, InputArea, InlineEdit, MarkdownEditor, SpanArea'
        >
          <TextField value='' onChange={() => {}} placeholder='텍스트 입력' />
        </Section>

        <Section
          title='Toggles'
          description='ToggleLarge, ToggleSmall, ToggleOnOff'
        >
          <ToggleLarge
            className='w-[435px]'
            options={[
              { value: 'option1', label: '옵션 1' },
              { value: 'option2', label: '옵션 2' },
            ]}
            value='option1'
            onChange={() => {}}
          />
        </Section>

        <Section
          title='Navigation'
          description='Navbar, Footer, NavbarHideWrapper'
        >
          <div
            className='rounded border p-3 text-sm'
            style={{ borderColor: t.border, color: t.desc }}
          >
            상단에 Navbar가 표시됩니다.
          </div>
        </Section>

        <Section title='Cards' description='PortfolioCard, PortfolioTypeCard'>
          <PortfolioCard title='카드 예시' tag='태그' date='2024.01.01' />
        </Section>

        <Section
          title='Progress'
          description='CorrectionProgressBar, StepProgressBar, CreditExpireAlert'
        >
          <StepProgressBar
            steps={['1단계', '2단계', '3단계']}
            currentStep={1}
          />
        </Section>

        <Section title='Dropdowns' description='Dropdown, ProfileDropdown'>
          <Dropdown
            items={[
              { id: '1', label: '옵션 1' },
              { id: '2', label: '옵션 2' },
            ]}
            placeholder='선택'
            onChange={() => {}}
          />
        </Section>

        <Section title='SpanArea' description='텍스트/콘텐츠 표시 영역 (Forms)'>
          <SpanArea width='400px'>SpanArea 예시</SpanArea>
        </Section>

        <Section title='Error' description='CommonErrorLayout'>
          <div
            className='rounded border p-3 text-sm'
            style={{ borderColor: t.border, color: t.desc }}
          >
            에러 레이아웃은 Error 카테고리에서 확인하세요.
          </div>
        </Section>
      </div>
    </div>
  ),
};

export const QuickStart: Story = {
  render: () => (
    <div className='min-h-screen p-8' style={{ backgroundColor: t.bg }}>
      <div className='mx-auto max-w-3xl'>
        <h1 className='mb-8 text-2xl font-bold' style={{ color: t.title }}>
          Quick Start
        </h1>

        <section
          className='mb-8 rounded-lg border p-6'
          style={{ backgroundColor: t.card, borderColor: t.border }}
        >
          <h2 className='mb-4 text-lg font-semibold' style={{ color: t.title }}>
            컴포넌트 사용
          </h2>
          <pre
            className='overflow-x-auto rounded border p-4 text-sm'
            style={{
              backgroundColor: t.bg,
              borderColor: t.border,
              color: t.title,
            }}
          >
            {`import { CommonButton } from '@/components/CommonButton';

<CommonButton variantType="Primary" px="2rem" py="0.75rem">
  클릭
</CommonButton>`}
          </pre>
        </section>

        <section
          className='rounded-lg border p-6'
          style={{ backgroundColor: t.card, borderColor: t.border }}
        >
          <h2 className='mb-4 text-lg font-semibold' style={{ color: t.title }}>
            참고
          </h2>
          <ul
            className='list-inside list-disc space-y-2 text-sm'
            style={{ color: t.desc }}
          >
            <li>각 컴포넌트의 Props는 Docs 탭에서 확인하세요.</li>
            <li>일관된 스타일을 위해 제공된 variant를 사용하세요.</li>
          </ul>
        </section>
      </div>
    </div>
  ),
};
