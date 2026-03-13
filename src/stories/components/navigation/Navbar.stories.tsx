import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

const meta = {
  title: 'Components/Navigation/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 로그아웃 상태 - 홈 페이지
export const HomePage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>홈 페이지</h1>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xl font-bold'>현재 상태</h2>
            <ul className='list-inside list-disc space-y-2 text-gray-700'>
              <li>활성 메뉴: 없음 (홈)</li>
              <li>로그인 버튼 표시</li>
              <li>이용권 구매 링크 표시</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그아웃 상태 - 인사이트 로그 페이지
export const LogPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/log',
      },
    },
  },
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>인사이트 로그</h1>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xl font-bold'>현재 상태</h2>
            <ul className='list-inside list-disc space-y-2 text-gray-700'>
              <li>활성 메뉴: 인사이트 로그 (파란색 강조)</li>
              <li>로그인 불필요 페이지</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그아웃 상태 - 경험 정리 페이지
export const ExperiencePage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/experience',
      },
    },
  },
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>경험 정리</h1>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xl font-bold'>현재 상태</h2>
            <ul className='list-inside list-disc space-y-2 text-gray-700'>
              <li>활성 메뉴: 경험 정리 (파란색 강조)</li>
              <li>로그인 필요 페이지</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그아웃 상태 - 포트폴리오 첨삭 페이지
export const CorrectionPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/correction',
      },
    },
  },
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>포트폴리오 첨삭</h1>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xl font-bold'>현재 상태</h2>
            <ul className='list-inside list-disc space-y-2 text-gray-700'>
              <li>활성 메뉴: 포트폴리오 첨삭 (파란색 강조)</li>
              <li>로그인 필요 페이지</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그아웃 상태 - 이용권 구매 페이지
export const TopupPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/topup',
      },
    },
  },
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>이용권 구매</h1>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-xl font-bold'>현재 상태</h2>
            <ul className='list-inside list-disc space-y-2 text-gray-700'>
              <li>활성 메뉴: 이용권 구매 (파란색 강조)</li>
              <li>로그인 불필요 페이지</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그아웃 상태 - 스크롤 테스트
export const WithScroll: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  render: () => (
    <div>
      <Navbar />
      <div className='pt-[80px]'>
        <div className='flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50'>
          <div className='text-center'>
            <h1 className='mb-4 text-5xl font-bold'>첫 번째 섹션</h1>
            <p className='text-xl text-gray-600'>아래로 스크롤하세요 ↓</p>
          </div>
        </div>
        <div className='flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50'>
          <div className='text-center'>
            <h1 className='mb-4 text-5xl font-bold'>두 번째 섹션</h1>
            <p className='text-xl text-gray-600'>
              Navbar가 상단에 고정되어 있습니다
            </p>
          </div>
        </div>
        <div className='flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50'>
          <div className='text-center'>
            <h1 className='mb-4 text-5xl font-bold'>세 번째 섹션</h1>
            <p className='text-xl text-gray-600'>
              스크롤해도 Navbar는 항상 보입니다
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ============================================
// 로그인 상태 스토리
// ============================================

// 로그인 상태 초기화 컴포넌트
const LoggedInDecorator = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // 로그인 상태로 설정
    useAuthStore.getState().setAccessToken('mock-access-token');
    useAuthStore.getState().setSessionRestoreAttempted(true);

    // 클린업: 로그아웃 상태로 복원
    return () => {
      useAuthStore.getState().setAccessToken(null);
    };
  }, []);

  return <>{children}</>;
};

// 로그인 상태 - 홈 페이지
export const LoggedInHomePage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  decorators: [
    (Story) => (
      <LoggedInDecorator>
        <Story />
      </LoggedInDecorator>
    ),
  ],
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>홈 페이지 (로그인)</h1>
          <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
            <h2 className='mb-4 text-xl font-bold text-green-900'>
              ✓ 로그인 상태
            </h2>
            <ul className='list-inside list-disc space-y-2 text-green-800'>
              <li>프로필 버튼 표시</li>
              <li>이용권 구매 링크 표시</li>
              <li>로그인 버튼 미표시</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그인 상태 - 인사이트 로그 페이지
export const LoggedInLogPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/log',
      },
    },
  },
  decorators: [
    (Story) => (
      <LoggedInDecorator>
        <Story />
      </LoggedInDecorator>
    ),
  ],
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>인사이트 로그 (로그인)</h1>
          <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
            <h2 className='mb-4 text-xl font-bold text-green-900'>
              ✓ 로그인 상태
            </h2>
            <ul className='list-inside list-disc space-y-2 text-green-800'>
              <li>활성 메뉴: 인사이트 로그 (파란색 강조)</li>
              <li>프로필 버튼 표시</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그인 상태 - 경험 정리 페이지
export const LoggedInExperiencePage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/experience',
      },
    },
  },
  decorators: [
    (Story) => (
      <LoggedInDecorator>
        <Story />
      </LoggedInDecorator>
    ),
  ],
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>경험 정리 (로그인)</h1>
          <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
            <h2 className='mb-4 text-xl font-bold text-green-900'>
              ✓ 로그인 상태
            </h2>
            <ul className='list-inside list-disc space-y-2 text-green-800'>
              <li>활성 메뉴: 경험 정리 (파란색 강조)</li>
              <li>프로필 버튼 표시</li>
              <li>로그인 필요 페이지 접근 가능</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그인 상태 - 포트폴리오 첨삭 페이지
export const LoggedInCorrectionPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/correction',
      },
    },
  },
  decorators: [
    (Story) => (
      <LoggedInDecorator>
        <Story />
      </LoggedInDecorator>
    ),
  ],
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>포트폴리오 첨삭 (로그인)</h1>
          <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
            <h2 className='mb-4 text-xl font-bold text-green-900'>
              ✓ 로그인 상태
            </h2>
            <ul className='list-inside list-disc space-y-2 text-green-800'>
              <li>활성 메뉴: 포트폴리오 첨삭 (파란색 강조)</li>
              <li>프로필 버튼 표시</li>
              <li>로그인 필요 페이지 접근 가능</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// 로그인 상태 - 이용권 구매 페이지
export const LoggedInTopupPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/topup',
      },
    },
  },
  decorators: [
    (Story) => (
      <LoggedInDecorator>
        <Story />
      </LoggedInDecorator>
    ),
  ],
  render: () => (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-8 pt-[100px]'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <h1 className='text-4xl font-bold'>이용권 구매 (로그인)</h1>
          <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
            <h2 className='mb-4 text-xl font-bold text-green-900'>
              ✓ 로그인 상태
            </h2>
            <ul className='list-inside list-disc space-y-2 text-green-800'>
              <li>활성 메뉴: 이용권 구매 (파란색 강조)</li>
              <li>프로필 버튼 표시</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};
