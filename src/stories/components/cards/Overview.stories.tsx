import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PortfolioCard } from '@/components/PortfolioCard';
import { PortfolioTypeCard } from '@/components/PortfolioTypeCard';

const meta = {
  title: 'Components/Cards/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Cards Overview

카드 컴포넌트들의 전체 컬렉션입니다.
다양한 용도와 스타일의 카드들을 한눈에 확인할 수 있습니다.

## 카테고리

### 포트폴리오 카드
- **PortfolioCard**: 포트폴리오 항목을 표시하는 카드 컴포넌트
  - 제목, 태그, 날짜 정보 표시
  - 선택 가능한 상태 지원
  - 링크 또는 클릭 핸들러 지원
  - 다양한 variant와 rounded 옵션

### 포트폴리오 타입 카드
- **PortfolioTypeCard**: 포트폴리오 유형 선택을 위한 카드
  - 아이콘, 제목, 설명 표시
  - 선택 가능한 상태 지원
  - 시각적 선택 피드백 제공
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample icons for PortfolioTypeCard
const TeamIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 40C48.2843 40 55 33.2843 55 25C55 16.7157 48.2843 10 40 10C31.7157 10 25 16.7157 25 25C25 33.2843 31.7157 40 40 40Z" fill="#74777D"/>
    <path d="M20 60C20 48.9543 28.9543 40 40 40C51.0457 40 60 48.9543 60 60V70H20V60Z" fill="#74777D"/>
  </svg>
);

const PersonalIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 35C46.6274 35 52 29.6274 52 23C52 16.3726 46.6274 11 40 11C33.3726 11 28 16.3726 28 23C28 29.6274 33.3726 35 40 35Z" fill="#74777D"/>
    <path d="M25 65C25 54.5066 33.5066 46 44 46C54.4934 46 63 54.5066 63 65V69H25V65Z" fill="#74777D"/>
  </svg>
);

const ProjectIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 15H35V35H15V15Z" fill="#74777D"/>
    <path d="M45 15H65V35H45V15Z" fill="#74777D"/>
    <path d="M15 45H35V65H15V45Z" fill="#74777D"/>
    <path d="M45 45H65V65H45V45Z" fill="#74777D"/>
  </svg>
);

export const AllCards: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Cards Collection
        </h1>

        {/* PortfolioCard */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>PortfolioCard</h2>
            <p className='text-sm text-gray-600'>
              포트폴리오 항목을 표시하는 카드 컴포넌트
            </p>
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-gray-700'>기본 상태</h3>
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioCard
                title='프로젝트 제목 1'
                tag='팀 프로젝트'
                date='2024.01.15'
              />
              <PortfolioCard
                title='개인 포트폴리오'
                tag='개인 프로젝트'
                date='2024.02.20'
              />
              <PortfolioCard
                title='디자인 프로젝트'
                tag='디자인'
                date='2024.03.10'
              />
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-gray-700'>선택된 상태</h3>
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioCard
                title='선택된 프로젝트'
                tag='팀 프로젝트'
                date='2024.01.15'
                selected={true}
              />
              <PortfolioCard
                title='일반 프로젝트'
                tag='개인 프로젝트'
                date='2024.02.20'
                selected={false}
              />
              <PortfolioCard
                title='또 다른 프로젝트'
                tag='개인 프로젝트'
                date='2024.03.05'
                selected={false}
              />
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-gray-700'>Variant 옵션</h3>
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow md:grid-cols-2'>
              <PortfolioCard
                title='Default Variant'
                tag='기본'
                date='2024.01.15'
                variant='default'
              />
              <PortfolioCard
                title='White Variant'
                tag='화이트'
                date='2024.02.20'
                variant='white'
              />
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-gray-700'>Rounded 옵션</h3>
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-3'>
              <PortfolioCard
                title='1rem Rounded'
                tag='작은 반경'
                date='2024.01.15'
                rounded='1rem'
              />
              <PortfolioCard
                title='1.25rem Rounded'
                tag='중간 반경'
                date='2024.02.20'
                rounded='1.25rem'
              />
              <PortfolioCard
                title='1.75rem Rounded'
                tag='큰 반경'
                date='2024.03.10'
                rounded='1.75rem'
              />
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-gray-700'>클릭 가능한 카드</h3>
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioCard
                title='클릭 이벤트'
                tag='onClick'
                date='2024.01.15'
                onClick={() => alert('카드 클릭됨!')}
              />
              <PortfolioCard
                title='링크 카드'
                tag='href'
                date='2024.02.20'
                href='/portfolio/123'
              />
              <PortfolioCard
                title='일반 카드'
                tag='정적'
                date='2024.03.10'
              />
            </div>
          </div>
        </section>

        {/* PortfolioTypeCard */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>PortfolioTypeCard</h2>
            <p className='text-sm text-gray-600'>
              포트폴리오 유형 선택을 위한 카드
            </p>
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-gray-700'>기본 상태</h3>
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioTypeCard
                icon={<TeamIcon />}
                title='팀 프로젝트'
                description='팀원들과 함께 진행한 프로젝트'
              />
              <PortfolioTypeCard
                icon={<PersonalIcon />}
                title='개인 프로젝트'
                description='개인적으로 진행한 프로젝트'
              />
              <PortfolioTypeCard
                icon={<ProjectIcon />}
                title='사이드 프로젝트'
                description='취미로 진행한 프로젝트'
              />
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-gray-700'>선택된 상태</h3>
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioTypeCard
                icon={<TeamIcon />}
                title='팀 프로젝트'
                description='팀원들과 함께 진행한 프로젝트'
                selected={true}
              />
              <PortfolioTypeCard
                icon={<PersonalIcon />}
                title='개인 프로젝트'
                description='개인적으로 진행한 프로젝트'
                selected={false}
              />
              <PortfolioTypeCard
                icon={<ProjectIcon />}
                title='사이드 프로젝트'
                description='취미로 진행한 프로젝트'
                selected={false}
              />
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='mb-3 text-lg font-semibold text-gray-700'>클릭 가능한 카드</h3>
            <div className='grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioTypeCard
                icon={<TeamIcon />}
                title='팀 프로젝트'
                description='클릭해서 선택하세요'
                onClick={() => alert('팀 프로젝트 선택됨!')}
              />
              <PortfolioTypeCard
                icon={<PersonalIcon />}
                title='개인 프로젝트'
                description='클릭해서 선택하세요'
                onClick={() => alert('개인 프로젝트 선택됨!')}
              />
              <PortfolioTypeCard
                icon={<ProjectIcon />}
                title='사이드 프로젝트'
                description='클릭해서 선택하세요'
                onClick={() => alert('사이드 프로젝트 선택됨!')}
              />
            </div>
          </div>
        </section>

        {/* Combined Layout */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>Combined Layout</h2>
            <p className='text-sm text-gray-600'>
              여러 카드를 함께 사용하는 레이아웃 예시
            </p>
          </div>

          <div className='rounded-lg bg-white p-6 shadow'>
            <h3 className='mb-4 text-lg font-semibold text-gray-700'>
              포트폴리오 타입 선택
            </h3>
            <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
              <PortfolioTypeCard
                icon={<TeamIcon />}
                title='팀 프로젝트'
                description='팀원들과 함께 진행한 프로젝트'
                selected={true}
              />
              <PortfolioTypeCard
                icon={<PersonalIcon />}
                title='개인 프로젝트'
                description='개인적으로 진행한 프로젝트'
              />
              <PortfolioTypeCard
                icon={<ProjectIcon />}
                title='사이드 프로젝트'
                description='취미로 진행한 프로젝트'
              />
            </div>

            <h3 className='mb-4 text-lg font-semibold text-gray-700'>
              포트폴리오 목록
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioCard
                title='팀 프로젝트 A'
                tag='팀 프로젝트'
                date='2024.01.15'
                selected={true}
              />
              <PortfolioCard
                title='팀 프로젝트 B'
                tag='팀 프로젝트'
                date='2024.02.20'
              />
              <PortfolioCard
                title='팀 프로젝트 C'
                tag='팀 프로젝트'
                date='2024.03.10'
              />
              <PortfolioCard
                title='팀 프로젝트 D'
                tag='팀 프로젝트'
                date='2024.03.25'
              />
              <PortfolioCard
                title='팀 프로젝트 E'
                tag='팀 프로젝트'
                date='2024.04.05'
              />
              <PortfolioCard
                title='팀 프로젝트 F'
                tag='팀 프로젝트'
                date='2024.04.20'
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};

export const ByCategory: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Cards by Category
        </h1>

        {/* 포트폴리오 카드 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-blue-50 p-4'>
            <h2 className='text-2xl font-bold text-blue-900'>포트폴리오 카드</h2>
            <p className='text-sm text-blue-700'>
              포트폴리오 항목을 표시하는 카드
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>기본 카드</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <PortfolioCard
                  title='웹 개발 프로젝트'
                  tag='팀 프로젝트'
                  date='2024.01.15'
                />
                <PortfolioCard
                  title='모바일 앱 개발'
                  tag='개인 프로젝트'
                  date='2024.02.20'
                />
                <PortfolioCard
                  title='UI/UX 디자인'
                  tag='디자인'
                  date='2024.03.10'
                />
              </div>
            </div>

            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>선택 가능한 카드</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <PortfolioCard
                  title='프로젝트 A'
                  tag='선택됨'
                  date='2024.01.15'
                  selected={true}
                  onClick={() => {}}
                />
                <PortfolioCard
                  title='프로젝트 B'
                  tag='미선택'
                  date='2024.02.20'
                  selected={false}
                  onClick={() => {}}
                />
                <PortfolioCard
                  title='프로젝트 C'
                  tag='미선택'
                  date='2024.03.10'
                  selected={false}
                  onClick={() => {}}
                />
              </div>
            </div>

            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>다양한 스타일</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <PortfolioCard
                  title='작은 모서리'
                  tag='1rem'
                  date='2024.01.15'
                  rounded='1rem'
                />
                <PortfolioCard
                  title='중간 모서리'
                  tag='1.25rem'
                  date='2024.02.20'
                  rounded='1.25rem'
                />
                <PortfolioCard
                  title='큰 모서리'
                  tag='1.75rem'
                  date='2024.03.10'
                  rounded='1.75rem'
                />
              </div>
            </div>
          </div>
        </section>

        {/* 포트폴리오 타입 카드 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-purple-50 p-4'>
            <h2 className='text-2xl font-bold text-purple-900'>
              포트폴리오 타입 카드
            </h2>
            <p className='text-sm text-purple-700'>
              포트폴리오 유형을 선택하는 카드
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>프로젝트 유형</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <PortfolioTypeCard
                  icon={<TeamIcon />}
                  title='팀 프로젝트'
                  description='팀원들과 함께 진행한 프로젝트'
                />
                <PortfolioTypeCard
                  icon={<PersonalIcon />}
                  title='개인 프로젝트'
                  description='개인적으로 진행한 프로젝트'
                />
                <PortfolioTypeCard
                  icon={<ProjectIcon />}
                  title='사이드 프로젝트'
                  description='취미로 진행한 프로젝트'
                />
              </div>
            </div>

            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>선택 상태</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <PortfolioTypeCard
                  icon={<TeamIcon />}
                  title='팀 프로젝트'
                  description='현재 선택됨'
                  selected={true}
                />
                <PortfolioTypeCard
                  icon={<PersonalIcon />}
                  title='개인 프로젝트'
                  description='선택 가능'
                  selected={false}
                />
                <PortfolioTypeCard
                  icon={<ProjectIcon />}
                  title='사이드 프로젝트'
                  description='선택 가능'
                  selected={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 실제 사용 예시 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-green-50 p-4'>
            <h2 className='text-2xl font-bold text-green-900'>실제 사용 예시</h2>
            <p className='text-sm text-green-700'>
              실제 화면에서 사용되는 레이아웃
            </p>
          </div>
          <div className='rounded-lg bg-white p-8 shadow'>
            <div className='mb-8'>
              <h3 className='mb-2 text-xl font-bold text-gray-800'>
                포트폴리오 생성
              </h3>
              <p className='mb-6 text-sm text-gray-600'>
                포트폴리오 유형을 선택해주세요
              </p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <PortfolioTypeCard
                  icon={<TeamIcon />}
                  title='팀 프로젝트'
                  description='팀원들과 함께 진행한 프로젝트'
                  selected={true}
                  onClick={() => {}}
                />
                <PortfolioTypeCard
                  icon={<PersonalIcon />}
                  title='개인 프로젝트'
                  description='개인적으로 진행한 프로젝트'
                  onClick={() => {}}
                />
                <PortfolioTypeCard
                  icon={<ProjectIcon />}
                  title='사이드 프로젝트'
                  description='취미로 진행한 프로젝트'
                  onClick={() => {}}
                />
              </div>
            </div>

            <div className='border-t border-gray-200 pt-8'>
              <h3 className='mb-2 text-xl font-bold text-gray-800'>
                내 포트폴리오
              </h3>
              <p className='mb-6 text-sm text-gray-600'>
                포트폴리오를 선택하여 편집하거나 삭제할 수 있습니다
              </p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <PortfolioCard
                  title='E-커머스 플랫폼 개발'
                  tag='팀 프로젝트'
                  date='2024.01.15'
                  onClick={() => {}}
                />
                <PortfolioCard
                  title='블로그 웹사이트'
                  tag='개인 프로젝트'
                  date='2024.02.20'
                  onClick={() => {}}
                />
                <PortfolioCard
                  title='날씨 앱 개발'
                  tag='사이드 프로젝트'
                  date='2024.03.10'
                  onClick={() => {}}
                />
                <PortfolioCard
                  title='포트폴리오 웹사이트'
                  tag='개인 프로젝트'
                  date='2024.03.25'
                  onClick={() => {}}
                />
                <PortfolioCard
                  title='채팅 애플리케이션'
                  tag='팀 프로젝트'
                  date='2024.04.05'
                  onClick={() => {}}
                />
                <PortfolioCard
                  title='관리자 대시보드'
                  tag='팀 프로젝트'
                  date='2024.04.20'
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Responsive Grid Layout
        </h1>

        {/* 반응형 포트폴리오 카드 그리드 */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              Portfolio Cards Grid
            </h2>
            <p className='text-sm text-gray-600'>
              반응형 그리드 레이아웃 (1열 → 2열 → 3열)
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioCard
                title='프로젝트 1'
                tag='웹 개발'
                date='2024.01.15'
              />
              <PortfolioCard
                title='프로젝트 2'
                tag='모바일 앱'
                date='2024.01.20'
              />
              <PortfolioCard
                title='프로젝트 3'
                tag='디자인'
                date='2024.01.25'
              />
              <PortfolioCard
                title='프로젝트 4'
                tag='백엔드'
                date='2024.02.01'
              />
              <PortfolioCard
                title='프로젝트 5'
                tag='프론트엔드'
                date='2024.02.10'
              />
              <PortfolioCard
                title='프로젝트 6'
                tag='풀스택'
                date='2024.02.15'
              />
              <PortfolioCard
                title='프로젝트 7'
                tag='데이터'
                date='2024.02.20'
              />
              <PortfolioCard
                title='프로젝트 8'
                tag='AI/ML'
                date='2024.02.25'
              />
              <PortfolioCard
                title='프로젝트 9'
                tag='DevOps'
                date='2024.03.01'
              />
            </div>
          </div>
        </section>

        {/* 반응형 타입 카드 그리드 */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              Type Cards Grid
            </h2>
            <p className='text-sm text-gray-600'>
              반응형 그리드 레이아웃 (1열 → 2열 → 3열)
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <PortfolioTypeCard
                icon={<TeamIcon />}
                title='팀 프로젝트'
                description='팀원들과 함께 진행한 프로젝트'
              />
              <PortfolioTypeCard
                icon={<PersonalIcon />}
                title='개인 프로젝트'
                description='개인적으로 진행한 프로젝트'
              />
              <PortfolioTypeCard
                icon={<ProjectIcon />}
                title='사이드 프로젝트'
                description='취미로 진행한 프로젝트'
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};
