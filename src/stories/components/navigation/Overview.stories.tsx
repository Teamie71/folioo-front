import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

const meta = {
  title: 'Components/Navigation/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Navigation Overview

네비게이션 컴포넌트들의 전체 컬렉션입니다.
애플리케이션의 주요 네비게이션 요소들을 한눈에 확인할 수 있습니다.

## 컴포넌트

### Navbar
- **설명**: 애플리케이션 상단에 고정되는 메인 네비게이션 바
- **기능**:
  - 메뉴 항목 표시 및 활성 메뉴 하이라이트
  - 로그인/로그아웃 상태에 따른 UI 변경
  - 프로필 드롭다운 메뉴
  - 이용권 구매 링크
- **높이**: 80px (고정)

### NavbarHideWrapper
- **설명**: 특정 경로에서 Navbar를 자동으로 숨기는 래퍼 컴포넌트
- **숨김 경로**:
  - /experience/settings
  - /experience/settings/[id]/chat
  - /experience/settings/[id]/createloading
- **동작**: Navbar 표시 시 pt-[80px] 패딩 자동 적용

### Footer
- **설명**: 애플리케이션 하단의 푸터
- **포함 내용**:
  - 서비스 링크 (인사이트 로그, 경험 정리, 포트폴리오 첨삭)
  - 고객센터 정보
  - 회사 정보 및 법적 고지
  - 소셜 미디어 링크
        `,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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

// 모든 네비게이션 컴포넌트를 한 페이지에 표시
export const AllNavigationComponents: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='pt-[80px]'>
        {/* Header */}
        <div className='bg-gradient-to-br from-blue-50 to-purple-50 p-8'>
          <div className='mx-auto max-w-7xl'>
            <h1 className='mb-4 text-4xl font-bold text-gray-900'>
              Navigation Components Collection
            </h1>
            <p className='text-lg text-gray-600'>
              애플리케이션의 모든 네비게이션 컴포넌트를 한눈에 확인하세요
            </p>
          </div>
        </div>

        {/* Navbar Section */}
        <section className='p-8'>
          <div className='mx-auto max-w-7xl'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>Navbar</h2>
              <p className='text-sm text-gray-600'>
                상단 고정 네비게이션 바 (현재 페이지 상단에 표시 중)
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>특징</h3>
              <ul className='list-inside list-disc space-y-2 text-gray-700'>
                <li>80px 고정 높이로 상단에 배치</li>
                <li>로그인 상태에 따라 UI 변경 (로그인 버튼 ↔ 프로필 버튼)</li>
                <li>현재 경로에 따른 메뉴 하이라이트 (파란색)</li>
                <li>
                  메뉴 항목: 인사이트 로그, 경험 정리, 포트폴리오 첨삭, 이용권
                  구매
                </li>
                <li>반응형 디자인 지원</li>
              </ul>
            </div>
          </div>
        </section>

        {/* NavbarHideWrapper Section */}
        <section className='bg-gray-100 p-8'>
          <div className='mx-auto max-w-7xl'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                NavbarHideWrapper
              </h2>
              <p className='text-sm text-gray-600'>
                특정 경로에서 Navbar를 숨기는 래퍼 컴포넌트
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-green-800'>
                  ✓ Navbar 표시 경로
                </h3>
                <ul className='space-y-2 text-sm text-gray-700'>
                  <li className='flex items-start'>
                    <span className='mr-2 text-green-600'>▪</span>
                    <span>/ (홈)</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 text-green-600'>▪</span>
                    <span>/log (인사이트 로그)</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 text-green-600'>▪</span>
                    <span>/experience (경험 정리)</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 text-green-600'>▪</span>
                    <span>/correction (포트폴리오 첨삭)</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 text-green-600'>▪</span>
                    <span>/topup (이용권 구매)</span>
                  </li>
                  <li className='mt-2 text-gray-500 italic'>
                    ... 그 외 대부분의 페이지
                  </li>
                </ul>
              </div>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-red-800'>
                  ✗ Navbar 숨김 경로
                </h3>
                <ul className='space-y-2 text-sm text-gray-700'>
                  <li className='flex items-start'>
                    <span className='mr-2 text-red-600'>▪</span>
                    <span>/experience/settings</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 text-red-600'>▪</span>
                    <span>/experience/settings/[id]/chat</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2 text-red-600'>▪</span>
                    <span>/experience/settings/[id]/createloading</span>
                  </li>
                </ul>
                <p className='mt-4 text-xs text-gray-500'>
                  이 경로들은 전체 화면 활용이 필요한 작업 페이지입니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className='p-8'>
          <div className='mx-auto max-w-7xl'>
            <div className='rounded-lg bg-white p-8 shadow'>
              <h2 className='mb-4 text-2xl font-bold text-gray-800'>
                페이지 콘텐츠 영역
              </h2>
              <p className='mb-6 text-gray-600'>
                Navbar 아래에는 pt-[80px] 패딩이 적용되어 콘텐츠가 Navbar에
                가려지지 않습니다.
              </p>
              <div className='h-64 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 p-6'>
                <p className='text-gray-700'>
                  이 영역은 실제 페이지 콘텐츠가 표시되는 곳입니다.
                </p>
                <p className='mt-2 text-gray-700'>
                  아래로 스크롤하면 Footer를 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer for scrolling */}
        <div className='h-96'></div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  ),
};

// 완전한 레이아웃 (로그인 상태)
export const CompleteLayoutLoggedIn: Story = {
  decorators: [
    (Story) => (
      <LoggedInDecorator>
        <Story />
      </LoggedInDecorator>
    ),
  ],
  render: () => (
    <div className='min-h-screen bg-white'>
      <Navbar />

      <div className='pt-[80px]'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-purple-600 to-blue-600 py-20 text-white'>
          <div className='mx-auto max-w-7xl px-8'>
            <h1 className='mb-4 text-5xl font-bold'>로그인 상태 레이아웃</h1>
            <p className='text-xl opacity-90'>
              Navbar + 콘텐츠 + Footer의 완전한 조합
            </p>
            <div className='mt-6 rounded-lg bg-white/10 p-4 backdrop-blur'>
              <p className='text-sm'>✓ 프로필 버튼이 표시됩니다</p>
              <p className='text-sm'>✓ 모든 기능에 접근할 수 있습니다</p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className='mx-auto max-w-7xl px-8 py-16'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='rounded-lg border border-gray-200 p-6'>
              <h3 className='mb-2 text-xl font-bold text-gray-800'>
                인사이트 로그
              </h3>
              <p className='text-gray-600'>
                경험을 기록하고 분석하여 인사이트를 얻으세요.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 p-6'>
              <h3 className='mb-2 text-xl font-bold text-gray-800'>
                경험 정리
              </h3>
              <p className='text-gray-600'>
                AI와 대화하며 경험을 구조화하세요.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 p-6'>
              <h3 className='mb-2 text-xl font-bold text-gray-800'>
                포트폴리오 첨삭
              </h3>
              <p className='text-gray-600'>
                전문가 수준의 포트폴리오를 작성하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Content for Scrolling */}
        <div className='bg-gray-50 py-16'>
          <div className='mx-auto max-w-7xl px-8'>
            <h2 className='mb-8 text-3xl font-bold text-gray-900'>
              네비게이션 동작 확인
            </h2>
            <div className='space-y-4'>
              <div className='rounded-lg bg-white p-6 shadow-sm'>
                <p className='text-gray-700'>
                  스크롤을 해도 Navbar는 상단에 고정되어 있습니다.
                </p>
              </div>
              <div className='rounded-lg bg-white p-6 shadow-sm'>
                <p className='text-gray-700'>
                  Footer는 페이지 하단에 위치하며 모든 정보를 포함합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  ),
};

// 완전한 레이아웃 (로그아웃 상태)
export const CompleteLayoutLoggedOut: Story = {
  render: () => (
    <div className='min-h-screen bg-white'>
      <Navbar />

      <div className='pt-[80px]'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-blue-600 to-cyan-600 py-20 text-white'>
          <div className='mx-auto max-w-7xl px-8'>
            <h1 className='mb-4 text-5xl font-bold'>로그아웃 상태 레이아웃</h1>
            <p className='text-xl opacity-90'>방문자가 보는 기본 레이아웃</p>
            <div className='mt-6 rounded-lg bg-white/10 p-4 backdrop-blur'>
              <p className='text-sm'>로그인 버튼이 표시됩니다</p>
              <p className='text-sm'>
                이용권 구매 링크를 통해 서비스를 시작할 수 있습니다
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className='mx-auto max-w-7xl px-8 py-16'>
          <h2 className='mb-8 text-3xl font-bold text-gray-900'>
            Folioo 서비스 소개
          </h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-8'>
              <h3 className='mb-4 text-2xl font-bold text-gray-800'>
                AI 기반 경험 정리
              </h3>
              <p className='text-gray-600'>
                인공지능과 대화하며 자신의 경험을 체계적으로 정리하고 분석할 수
                있습니다.
              </p>
            </div>
            <div className='rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-8'>
              <h3 className='mb-4 text-2xl font-bold text-gray-800'>
                전문가 수준의 포트폴리오
              </h3>
              <p className='text-gray-600'>
                정리된 경험을 바탕으로 전문적인 포트폴리오를 작성할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  ),
};

// 스크롤 동작 시연
export const ScrollBehavior: Story = {
  render: () => (
    <div>
      <Navbar />

      <div className='pt-[80px]'>
        {/* Section 1 */}
        <div className='flex h-screen items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500'>
          <div className='text-center text-white'>
            <h1 className='mb-4 text-6xl font-bold'>첫 번째 섹션</h1>
            <p className='text-2xl'>Navbar는 상단에 고정되어 있습니다</p>
            <p className='mt-4 text-xl opacity-80'>아래로 스크롤하세요 ↓</p>
          </div>
        </div>

        {/* Section 2 */}
        <div className='flex h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500'>
          <div className='text-center text-white'>
            <h1 className='mb-4 text-6xl font-bold'>두 번째 섹션</h1>
            <p className='text-2xl'>스크롤해도 Navbar는 항상 보입니다</p>
            <p className='mt-4 text-xl opacity-80'>계속 스크롤하세요 ↓</p>
          </div>
        </div>

        {/* Section 3 */}
        <div className='flex h-screen items-center justify-center bg-gradient-to-br from-green-500 to-teal-500'>
          <div className='text-center text-white'>
            <h1 className='mb-4 text-6xl font-bold'>세 번째 섹션</h1>
            <p className='text-2xl'>Fixed Position으로 고정된 Navbar</p>
            <p className='mt-4 text-xl opacity-80'>
              Footer를 보려면 더 스크롤 ↓
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className='flex h-screen items-center justify-center bg-gradient-to-br from-orange-500 to-red-500'>
          <div className='text-center text-white'>
            <h1 className='mb-4 text-6xl font-bold'>네 번째 섹션</h1>
            <p className='text-2xl'>Footer가 곧 나타납니다</p>
            <p className='mt-4 text-xl opacity-80'>마지막 스크롤 ↓</p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  ),
};

// 컴포넌트 개별 분리 표시
export const ComponentBreakdown: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Navigation Components Breakdown
        </h1>

        {/* Navbar */}
        <section className='mb-12'>
          <div className='mb-4 rounded-lg bg-blue-50 p-4'>
            <h2 className='text-2xl font-bold text-blue-900'>1. Navbar</h2>
            <p className='text-sm text-blue-700'>
              상단 고정 네비게이션 바 (높이: 80px)
            </p>
          </div>
          <div className='overflow-hidden rounded-lg shadow-lg'>
            <div className='relative'>
              <Navbar />
              <div className='pointer-events-none absolute inset-0 border-4 border-dashed border-blue-500'></div>
            </div>
          </div>
          <div className='mt-4 rounded-lg bg-white p-6 shadow'>
            <h3 className='mb-2 font-semibold text-gray-800'>주요 기능</h3>
            <ul className='list-inside list-disc space-y-1 text-sm text-gray-600'>
              <li>로그인/로그아웃 상태 관리</li>
              <li>현재 페이지 경로에 따른 메뉴 하이라이트</li>
              <li>프로필 드롭다운 (로그인 시)</li>
              <li>이용권 구매 링크</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <section className='mb-12'>
          <div className='mb-4 rounded-lg bg-green-50 p-4'>
            <h2 className='text-2xl font-bold text-green-900'>2. Footer</h2>
            <p className='text-sm text-green-700'>
              페이지 하단 푸터 - 서비스 정보 및 링크
            </p>
          </div>
          <div className='overflow-hidden rounded-lg shadow-lg'>
            <div className='relative'>
              <Footer />
              <div className='pointer-events-none absolute inset-0 border-4 border-dashed border-green-500'></div>
            </div>
          </div>
          <div className='mt-4 rounded-lg bg-white p-6 shadow'>
            <h3 className='mb-2 font-semibold text-gray-800'>포함 정보</h3>
            <ul className='list-inside list-disc space-y-1 text-sm text-gray-600'>
              <li>서비스 링크 (인사이트 로그, 경험 정리, 포트폴리오 첨삭)</li>
              <li>고객센터 정보</li>
              <li>회사 정보 (대표, 사업자등록번호, 주소 등)</li>
              <li>법적 고지 및 소셜 미디어 링크</li>
            </ul>
          </div>
        </section>

        {/* NavbarHideWrapper */}
        <section className='mb-12'>
          <div className='mb-4 rounded-lg bg-purple-50 p-4'>
            <h2 className='text-2xl font-bold text-purple-900'>
              3. NavbarHideWrapper
            </h2>
            <p className='text-sm text-purple-700'>
              경로에 따라 Navbar를 조건부로 렌더링하는 래퍼 컴포넌트
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow'>
            <h3 className='mb-4 font-semibold text-gray-800'>사용 방법</h3>
            <div className='rounded bg-gray-50 p-4 font-mono text-sm'>
              <p className='text-gray-700'>&lt;NavbarHideWrapper&gt;</p>
              <p className='ml-4 text-gray-700'>&lt;YourPageContent /&gt;</p>
              <p className='text-gray-700'>&lt;/NavbarHideWrapper&gt;</p>
            </div>
            <div className='mt-4'>
              <h4 className='mb-2 text-sm font-semibold text-gray-700'>
                동작 방식
              </h4>
              <ul className='list-inside list-disc space-y-1 text-sm text-gray-600'>
                <li>특정 경로에서는 Navbar를 숨기고 패딩을 제거합니다</li>
                <li>
                  일반 경로에서는 Navbar를 표시하고 pt-[80px] 패딩을 적용합니다
                </li>
                <li>전체 화면이 필요한 작업 페이지에서 유용합니다</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <div className='mb-4 rounded-lg bg-yellow-50 p-4'>
            <h2 className='text-2xl font-bold text-yellow-900'>
              레이아웃 조합 예시
            </h2>
            <p className='text-sm text-yellow-700'>
              다양한 페이지 타입에서의 네비게이션 컴포넌트 사용
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-2 font-semibold text-gray-800'>
                표준 페이지 레이아웃
              </h3>
              <div className='font-mono text-xs text-gray-600'>
                <p>Navbar (고정)</p>
                <p>+ pt-[80px]</p>
                <p>+ 페이지 콘텐츠</p>
                <p>+ Footer</p>
              </div>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-2 font-semibold text-gray-800'>
                전체 화면 페이지
              </h3>
              <div className='font-mono text-xs text-gray-600'>
                <p>Navbar 없음</p>
                <p>+ 패딩 없음</p>
                <p>+ 전체 화면 콘텐츠</p>
                <p>+ Footer (선택)</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};
