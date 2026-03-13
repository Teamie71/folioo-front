import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToggleLarge } from '@/components/ToggleLarge';
import { ToggleOnOff } from '@/components/ToggleOnOff';
import { ToggleSmall } from '@/components/ToggleSmall';
import { useState } from 'react';

const meta = {
  title: 'Components/Toggles/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Toggles Overview

토글 컴포넌트들의 전체 컬렉션입니다.
다양한 크기와 용도의 토글들을 한눈에 확인할 수 있습니다.

## 컴포넌트

### ToggleLarge
- 큰 크기의 토글 컴포넌트
- 2개 이상의 옵션 선택
- 넓은 영역에 적합

### ToggleSmall
- 작은 크기의 토글 컴포넌트
- 2개 이상의 옵션 선택
- 좁은 영역에 적합

### ToggleOnOff
- On/Off 스위치 토글
- Boolean 상태 관리
- 설정 화면에 적합
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllToggles: Story = {
  render: () => {
    const [largeValue, setLargeValue] = useState('option1');
    const [smallValue, setSmallValue] = useState('tab1');
    const [onOffChecked, setOnOffChecked] = useState(false);

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Toggles Collection
          </h1>

          {/* ToggleLarge */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>ToggleLarge</h2>
              <p className='text-sm text-gray-600'>
                큰 크기의 토글 컴포넌트 - 2개 이상의 옵션 선택
              </p>
            </div>
            <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  2 Options
                </h3>
                <ToggleLarge
                  className='w-[435px]'
                  options={[
                    { label: '옵션 1', value: 'option1' },
                    { label: '옵션 2', value: 'option2' },
                  ]}
                  value={largeValue}
                  onChange={setLargeValue}
                />
                <p className='mt-2 text-sm text-gray-600'>
                  선택된 값: {largeValue}
                </p>
              </div>
            </div>
          </section>

          {/* ToggleSmall */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>ToggleSmall</h2>
              <p className='text-sm text-gray-600'>
                작은 크기의 토글 컴포넌트 - 2개 이상의 옵션 선택
              </p>
            </div>
            <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  2 Options
                </h3>
                <ToggleSmall
                  className='w-[154px]'
                  options={[
                    { label: '옵션 1', value: 'option1' },
                    { label: '옵션 2', value: 'option2' },
                  ]}
                  value={largeValue}
                  onChange={setLargeValue}
                />
                <p className='mt-2 text-sm text-gray-600'>
                  선택된 값: {largeValue}
                </p>
              </div>
            </div>
          </section>

          {/* ToggleOnOff */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>ToggleOnOff</h2>
              <p className='text-sm text-gray-600'>
                On/Off 스위치 토글 - Boolean 상태 관리
              </p>
            </div>
            <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  Interactive
                </h3>
                <ToggleOnOff
                  checked={onOffChecked}
                  onCheckedChange={setOnOffChecked}
                />
                <p className='mt-2 text-sm text-gray-600'>
                  상태: {onOffChecked ? 'On' : 'Off'}
                </p>
              </div>

              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  All States
                </h3>
                <div className='flex items-center gap-8'>
                  <div className='flex items-center gap-3'>
                    <ToggleOnOff checked={false} />
                    <span className='text-sm text-gray-600'>Off</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <ToggleOnOff checked={true} />
                    <span className='text-sm text-gray-600'>On</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
};

export const SizeComparison: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    const [value2, setValue2] = useState('tab1');

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Toggle Size Comparison
          </h1>

          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-blue-50 p-4'>
              <h2 className='text-2xl font-bold text-blue-900'>
                Multi-Option Toggles
              </h2>
              <p className='text-sm text-blue-700'>
                크기별 비교 - 같은 옵션으로 다른 크기
              </p>
            </div>

            <div className='space-y-8 rounded-lg bg-white p-6 shadow'>
              <div>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Large Size
                  </h3>
                  <span className='text-sm text-gray-500'>
                    Width: ~436px, Height: 40px
                  </span>
                </div>
                <ToggleLarge
                  className='w-[435px]'
                  options={[
                    { label: '옵션 1', value: 'option1' },
                    { label: '옵션 2', value: 'option2' },
                  ]}
                  value={value}
                  onChange={setValue}
                />
              </div>

              <div className='border-t pt-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Small Size
                  </h3>
                  <span className='text-sm text-gray-500'>
                    Width: ~154px, Height: 29px
                  </span>
                </div>
                <ToggleSmall
                  className='w-[154px]'
                  options={[
                    { label: '옵션 1', value: 'option1' },
                    { label: '옵션 2', value: 'option2' },
                  ]}
                  value={value}
                  onChange={setValue}
                />
              </div>
            </div>
          </section>

          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-purple-50 p-4'>
              <h2 className='text-2xl font-bold text-purple-900'>
                On/Off Toggle
              </h2>
              <p className='text-sm text-purple-700'>
                스위치 형태의 토글 - 별도 크기
              </p>
            </div>

            <div className='rounded-lg bg-white p-6 shadow'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  ToggleOnOff
                </h3>
                <span className='text-sm text-gray-500'>
                  Width: 54px, Height: 28px
                </span>
              </div>
              <div className='flex items-center gap-8'>
                <div className='flex items-center gap-3'>
                  <ToggleOnOff checked={false} />
                  <span className='text-sm text-gray-600'>Off State</span>
                </div>
                <div className='flex items-center gap-3'>
                  <ToggleOnOff checked={true} />
                  <span className='text-sm text-gray-600'>On State</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
};

export const InteractiveShowcase: Story = {
  render: () => {
    const [category, setCategory] = useState('all');
    const [filterSize, setFilterSize] = useState('large');
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Interactive Toggle Showcase
          </h1>

          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-green-50 p-4'>
              <h2 className='text-2xl font-bold text-green-900'>
                실제 사용 예시
              </h2>
              <p className='text-sm text-green-700'>
                다양한 시나리오에서의 토글 활용
              </p>
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* 카테고리 필터 */}
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 text-lg font-semibold text-gray-800'>
                  카테고리 필터 (Large)
                </h3>
                <ToggleLarge
                  className='w-[435px]'
                  options={[
                    { label: '전체', value: 'all' },
                    { label: '진행중', value: 'active' },
                  ]}
                  value={category}
                  onChange={setCategory}
                />
                <p className='mt-4 text-sm text-gray-600'>
                  현재 필터: {category === 'all' ? '전체' : '진행중'}
                </p>
              </div>

              {/* 뷰 필터 */}
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 text-lg font-semibold text-gray-800'>
                  뷰 필터 (Small)
                </h3>
                <ToggleSmall
                  className='w-[154px]'
                  options={[
                    { label: '큰 화면', value: 'large' },
                    { label: '작은 화면', value: 'small' },
                  ]}
                  value={filterSize}
                  onChange={setFilterSize}
                />
                <p className='mt-4 text-sm text-gray-600'>
                  현재 뷰: {filterSize === 'large' ? '큰 화면' : '작은 화면'}
                </p>
              </div>

              {/* 설정 토글들 */}
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 text-lg font-semibold text-gray-800'>
                  알림 설정 (On/Off)
                </h3>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-700'>알림 받기</span>
                  <ToggleOnOff
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <p className='mt-4 text-sm text-gray-600'>
                  알림: {notifications ? '켜짐' : '꺼짐'}
                </p>
              </div>

              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 text-lg font-semibold text-gray-800'>
                  다크 모드 (On/Off)
                </h3>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-700'>다크 모드</span>
                  <ToggleOnOff
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <p className='mt-4 text-sm text-gray-600'>
                  테마: {darkMode ? '다크' : '라이트'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
};
