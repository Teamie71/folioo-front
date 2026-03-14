import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Navigation/NavbarHideWrapper',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
NavbarHideWrapper는 특정 경로에서 Navbar를 자동으로 숨기는 래퍼 컴포넌트입니다.

**Navbar가 숨겨지는 경로:**
- \`/experience/settings\`
- \`/experience/settings/[id]/chat\`
- \`/experience/settings/[id]/createloading\`

**Navbar가 표시되는 경로:**
- 위 경로를 제외한 모든 경로

**동작 방식:**
- Navbar가 표시될 때: \`pt-[80px]\` 패딩이 적용되어 Navbar 아래에 컨텐츠가 위치
- Navbar가 숨겨질 때: 패딩 없이 화면 상단부터 컨텐츠 시작
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Navbar가 표시되는 일반 페이지 시뮬레이션
export const WithNavbar: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar 모킹 */}
      <div className='fixed top-0 right-0 left-0 z-50 flex h-[80px] items-center justify-between bg-white px-8 shadow'>
        <div className='text-xl font-bold text-[#5060C5]'>Folioo</div>
        <div className='text-sm text-gray-600'>Navbar 표시됨</div>
      </div>

      {/* pt-[80px] 패딩 적용 */}
      <div className='pt-[80px]'>
        <div className='p-8'>
          <div className='rounded-lg bg-white p-6 shadow'>
            <h2 className='mb-4 text-2xl font-bold'>기본 페이지</h2>
            <p className='text-gray-600'>
              Navbar가 표시되고 pt-[80px] 패딩이 적용되어 Navbar 아래에 컨텐츠가
              위치합니다.
            </p>
            <p className='mt-4 text-sm text-gray-500'>
              적용 경로: /, /portfolio, /correction 등 대부분의 페이지
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Navbar가 숨겨진 페이지 시뮬레이션
export const HiddenNavbar: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar 없음 */}

      {/* 패딩 없이 바로 시작 */}
      <div>
        <div className='p-8'>
          <div className='rounded-lg bg-white p-6 shadow'>
            <h2 className='mb-4 text-2xl font-bold'>Navbar 숨김 페이지</h2>
            <p className='text-gray-600'>
              Navbar가 숨겨지고 패딩 없이 화면 상단부터 컨텐츠가 시작됩니다.
            </p>
            <p className='mt-4 text-sm text-gray-500'>적용 경로:</p>
            <ul className='mt-2 list-inside list-disc text-sm text-gray-500'>
              <li>/experience/settings</li>
              <li>/experience/settings/[id]/chat</li>
              <li>/experience/settings/[id]/createloading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 비교 뷰
export const Comparison: Story = {
  render: () => (
    <div className='flex min-h-screen gap-4 bg-gray-100 p-4'>
      {/* Navbar 표시 */}
      <div className='flex-1 rounded-lg border-2 border-blue-500 bg-white'>
        <div className='bg-blue-50 p-4 text-center'>
          <h3 className='font-bold text-blue-700'>Navbar 표시</h3>
        </div>
        <div className='relative min-h-[400px]'>
          {/* 모킹된 Navbar */}
          <div className='absolute top-0 right-0 left-0 flex h-[80px] items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500'>
            <span className='font-bold text-white'>Navbar (80px)</span>
          </div>
          {/* pt-[80px] 적용된 컨텐츠 */}
          <div className='pt-[80px]'>
            <div className='p-4'>
              <div className='rounded border-2 border-dashed border-blue-300 bg-blue-50 p-4'>
                <p className='text-sm text-gray-700'>
                  pt-[80px] 패딩으로 Navbar 아래에 위치
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar 숨김 */}
      <div className='flex-1 rounded-lg border-2 border-red-500 bg-white'>
        <div className='bg-red-50 p-4 text-center'>
          <h3 className='font-bold text-red-700'>Navbar 숨김</h3>
        </div>
        <div className='relative min-h-[400px]'>
          {/* Navbar 없음 */}
          {/* 패딩 없이 바로 시작 */}
          <div>
            <div className='p-4'>
              <div className='rounded border-2 border-dashed border-red-300 bg-red-50 p-4'>
                <p className='text-sm text-gray-700'>패딩 없이 상단부터 시작</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 경험 설정 페이지 예시
export const ExperienceSettingsPage: Story = {
  render: () => (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50'>
      <div className='p-8'>
        <div className='mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg'>
          <h1 className='mb-4 text-3xl font-bold text-gray-900'>
            경험 설정 페이지
          </h1>
          <p className='mb-6 text-gray-600'>
            이 페이지에서는 Navbar가 숨겨져 더 넓은 작업 공간을 제공합니다.
          </p>
          <div className='space-y-4'>
            <div className='rounded-lg border border-gray-200 p-4'>
              <h3 className='font-semibold text-gray-800'>
                경로: /experience/settings
              </h3>
              <p className='mt-2 text-sm text-gray-600'>
                전체 화면을 활용하여 경험 정리 작업에 집중할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 채팅 페이지 예시
export const ChatPage: Story = {
  render: () => (
    <div className='flex min-h-screen flex-col bg-gray-100'>
      <div className='flex-1 p-4'>
        <div className='mx-auto max-w-3xl rounded-lg bg-white shadow'>
          <div className='border-b border-gray-200 p-4'>
            <h2 className='font-bold text-gray-900'>AI 채팅</h2>
            <p className='text-sm text-gray-500'>
              경로: /experience/settings/[id]/chat
            </p>
          </div>
          <div className='h-96 p-4'>
            <p className='text-sm text-gray-600'>
              채팅 인터페이스에서는 Navbar 없이 대화에 집중할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
