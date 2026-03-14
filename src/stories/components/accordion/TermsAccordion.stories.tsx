import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TermsAccordion } from '@/components/TermsAccordion';

const meta = {
  title: 'Components/Accordion/TermsAccordion',
  component: TermsAccordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TermsAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  {
    value: 'item1',
    title: '서비스 이용약관',
    content: (
      <div>
        <p>제1조 (목적)</p>
        <p>
          이 약관은 회사가 제공하는 서비스의 이용 조건 및 절차에 관한 사항을
          규정함을 목적으로 합니다.
        </p>
      </div>
    ),
  },
  {
    value: 'item2',
    title: '개인정보 처리방침',
    content: (
      <div>
        <p>개인정보 수집 및 이용 목적</p>
        <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
      </div>
    ),
  },
  {
    value: 'item3',
    title: '마케팅 정보 수신 동의',
    content: (
      <div>
        <p>마케팅 활용 동의</p>
        <p>서비스 이용 과정에서 귀하의 개인정보를 수집·이용할 수 있습니다.</p>
      </div>
    ),
  },
];

// 기본 아코디언
export const Default: Story = {
  args: {
    items: sampleItems,
  },
  render: (args) => (
    <div className='w-[600px] p-8'>
      <TermsAccordion {...args} />
    </div>
  ),
};

// 단일 항목
export const SingleItem: Story = {
  args: {
    items: [
      {
        value: 'single',
        title: '자주 묻는 질문',
        content: (
          <div>
            <p className='mb-2 font-bold'>Q. 서비스는 어떻게 이용하나요?</p>
            <p>A. 회원가입 후 바로 이용하실 수 있습니다.</p>
          </div>
        ),
      },
    ],
  },
  render: (args) => (
    <div className='w-[600px] p-8'>
      <TermsAccordion {...args} />
    </div>
  ),
};
