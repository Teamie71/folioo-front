import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Dropdown } from '@/components/Dropdown';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { ProfileButton } from '@/components/ProfileButton';
import { useState, useRef } from 'react';

const meta = {
  title: 'Components/Dropdowns/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Dropdowns Overview

드롭다운 컴포넌트들의 전체 컬렉션입니다.
다양한 용도와 스타일의 드롭다운을 한눈에 확인할 수 있습니다.

## 카테고리

### 기본 드롭다운
- **Dropdown**: 선택 가능한 항목 목록을 표시하는 기본 드롭다운
  - 커스텀 항목 목록 지원
  - 삭제 기능 옵션 제공
  - Portal 기반 렌더링으로 overflow 문제 해결

### 프로필 관련
- **ProfileDropdown**: 프로필 메뉴 드롭다운
  - 프로필 보기, 로그아웃 기능
  - ProfileButton과 함께 사용
  - 위치 자동 계산 및 반응형 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllDropdowns: Story = {
  render: () => {
    const [dropdownValue, setDropdownValue] = useState('');
    const [dropdownItems, setDropdownItems] = useState([
      { id: '1', label: '옵션 1' },
      { id: '2', label: '옵션 2' },
      { id: '3', label: '옵션 3' },
      { id: '4', label: '옵션 4' },
    ]);

    const [deleteDropdownValue, setDeleteDropdownValue] = useState('');
    const [deleteDropdownItems, setDeleteDropdownItems] = useState([
      {
        id: '1',
        label: '삭제 가능 항목 1',
        onDelete: (id: string) => {
          setDeleteDropdownItems((prev) =>
            prev.filter((item) => item.id !== id),
          );
          if (deleteDropdownValue === id) setDeleteDropdownValue('');
        },
      },
      {
        id: '2',
        label: '삭제 가능 항목 2',
        onDelete: (id: string) => {
          setDeleteDropdownItems((prev) =>
            prev.filter((item) => item.id !== id),
          );
          if (deleteDropdownValue === id) setDeleteDropdownValue('');
        },
      },
      {
        id: '3',
        label: '삭제 가능 항목 3',
        onDelete: (id: string) => {
          setDeleteDropdownItems((prev) =>
            prev.filter((item) => item.id !== id),
          );
          if (deleteDropdownValue === id) setDeleteDropdownValue('');
        },
      },
    ]);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileButtonRef = useRef<HTMLButtonElement>(null);

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Dropdowns Collection
          </h1>

          {/* Dropdown - 기본 */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                Dropdown - 기본
              </h2>
              <p className='text-sm text-gray-600'>
                선택 가능한 항목 목록을 표시하는 기본 드롭다운
              </p>
            </div>
            <div className='flex flex-col gap-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  기본 드롭다운
                </h3>
                <Dropdown
                  items={dropdownItems}
                  value={dropdownValue}
                  onChange={setDropdownValue}
                  placeholder='옵션을 선택하세요'
                />
                <p className='mt-2 text-sm text-gray-600'>
                  선택된 값: {dropdownValue || '없음'}
                </p>
              </div>
            </div>
          </section>

          {/* Dropdown - 삭제 기능 */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                Dropdown - 삭제 기능
              </h2>
              <p className='text-sm text-gray-600'>
                항목에 마우스를 올리면 삭제 버튼이 표시됩니다
              </p>
            </div>
            <div className='flex flex-col gap-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  삭제 가능한 항목
                </h3>
                <Dropdown
                  items={deleteDropdownItems}
                  value={deleteDropdownValue}
                  onChange={setDeleteDropdownValue}
                  placeholder='항목을 선택하거나 삭제하세요'
                />
                <p className='mt-2 text-sm text-gray-600'>
                  선택된 값: {deleteDropdownValue || '없음'} | 남은 항목:{' '}
                  {deleteDropdownItems.length}개
                </p>
              </div>
            </div>
          </section>

          {/* Dropdown - 다양한 크기 */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                Dropdown - 다양한 크기
              </h2>
              <p className='text-sm text-gray-600'>
                커스텀 className으로 크기 조절 가능
              </p>
            </div>
            <div className='flex flex-col gap-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  Small (width: 20rem)
                </h3>
                <Dropdown
                  items={dropdownItems}
                  placeholder='Small dropdown'
                  className='w-[20rem]'
                  inputClassName='w-[20rem]'
                  menuClassName='w-[20rem]'
                />
              </div>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  Default (width: 28.5rem)
                </h3>
                <Dropdown items={dropdownItems} placeholder='Default size' />
              </div>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  Large (width: 35rem)
                </h3>
                <Dropdown
                  items={dropdownItems}
                  placeholder='Large dropdown'
                  className='w-[35rem]'
                  inputClassName='w-[35rem]'
                  menuClassName='w-[35rem]'
                />
              </div>
            </div>
          </section>

          {/* ProfileDropdown */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                ProfileDropdown
              </h2>
              <p className='text-sm text-gray-600'>
                프로필 버튼과 함께 사용되는 프로필 메뉴 드롭다운
              </p>
            </div>
            <div className='flex flex-col gap-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <h3 className='mb-3 text-sm font-semibold text-gray-700'>
                  프로필 메뉴 (버튼 클릭)
                </h3>
                <div className='flex h-[200px] items-start'>
                  <ProfileButton
                    ref={profileButtonRef}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    isOpen={isProfileOpen}
                  />
                  <ProfileDropdown
                    open={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    triggerRef={profileButtonRef}
                    onProfileClick={() => {
                      alert('프로필 페이지로 이동');
                      setIsProfileOpen(false);
                    }}
                    onLogoutClick={() => {
                      alert('로그아웃');
                      setIsProfileOpen(false);
                    }}
                  />
                </div>
                <p className='mt-2 text-sm text-gray-600'>
                  프로필 버튼을 클릭하여 메뉴를 열 수 있습니다
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
};

export const ByCategory: Story = {
  render: () => {
    const [basicValue, setBasicValue] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLButtonElement>(null);

    const basicItems = [
      { id: '1', label: '첫 번째 옵션' },
      { id: '2', label: '두 번째 옵션' },
      { id: '3', label: '세 번째 옵션' },
    ];

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Dropdowns by Category
          </h1>

          {/* 기본 드롭다운 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-blue-50 p-4'>
              <h2 className='text-2xl font-bold text-blue-900'>
                기본 드롭다운
              </h2>
              <p className='text-sm text-blue-700'>
                일반적인 선택 목록을 표시하는 드롭다운
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>Dropdown</h3>
                <p className='mb-4 text-sm text-gray-600'>
                  선택 가능한 항목 목록을 표시하며, Portal 기반으로 렌더링되어
                  overflow 문제가 없습니다.
                </p>
                <Dropdown
                  items={basicItems}
                  value={basicValue}
                  onChange={setBasicValue}
                  placeholder='옵션을 선택하세요'
                />
                <div className='mt-4 rounded-md bg-gray-50 p-3'>
                  <p className='text-sm text-gray-600'>
                    <strong>선택된 값:</strong> {basicValue || '없음'}
                  </p>
                  <p className='mt-1 text-xs text-gray-500'>
                    • 항목 hover 시 하이라이트 효과
                  </p>
                  <p className='text-xs text-gray-500'>
                    • 외부 클릭 시 자동 닫힘
                  </p>
                  <p className='text-xs text-gray-500'>• 스크롤 시 자동 닫힘</p>
                </div>
              </div>
            </div>
          </section>

          {/* 프로필 관련 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-purple-50 p-4'>
              <h2 className='text-2xl font-bold text-purple-900'>
                프로필 관련
              </h2>
              <p className='text-sm text-purple-700'>
                사용자 프로필과 관련된 드롭다운
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  ProfileDropdown
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  ProfileButton과 함께 사용되는 프로필 메뉴 드롭다운입니다.
                  프로필 보기와 로그아웃 기능을 제공합니다.
                </p>
                <div className='flex h-[180px] items-start'>
                  <ProfileButton
                    ref={profileRef}
                    onClick={() => setProfileOpen(!profileOpen)}
                    isOpen={profileOpen}
                  />
                  <ProfileDropdown
                    open={profileOpen}
                    onClose={() => setProfileOpen(false)}
                    triggerRef={profileRef}
                    onProfileClick={() => {
                      alert('프로필 페이지로 이동합니다');
                      setProfileOpen(false);
                    }}
                    onLogoutClick={() => {
                      alert('로그아웃됩니다');
                      setProfileOpen(false);
                    }}
                  />
                </div>
                <div className='mt-4 rounded-md bg-gray-50 p-3'>
                  <p className='text-xs text-gray-500'>
                    • ProfileButton의 ref를 triggerRef로 전달
                  </p>
                  <p className='text-xs text-gray-500'>
                    • 버튼 위치에 따라 자동으로 위치 계산
                  </p>
                  <p className='text-xs text-gray-500'>
                    • 항목 hover 시 색상 및 폰트 변경
                  </p>
                  <p className='text-xs text-gray-500'>
                    • 외부 클릭 시 자동 닫힘
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 사용 예시 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-green-50 p-4'>
              <h2 className='text-2xl font-bold text-green-900'>사용 예시</h2>
              <p className='text-sm text-green-700'>
                실제 애플리케이션에서의 사용 시나리오
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-3 font-semibold text-gray-800'>
                  폼 선택 필드
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  사용자가 여러 옵션 중 하나를 선택해야 하는 경우
                </p>
                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-gray-700'>
                      카테고리
                    </label>
                    <Dropdown
                      items={[
                        { id: 'dev', label: '개발' },
                        { id: 'design', label: '디자인' },
                        { id: 'marketing', label: '마케팅' },
                      ]}
                      placeholder='카테고리를 선택하세요'
                    />
                  </div>
                </div>
              </div>

              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-3 font-semibold text-gray-800'>
                  사용자 메뉴
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  헤더의 프로필 영역에서 사용
                </p>
                <div className='flex h-[120px] justify-end'>
                  <div className='text-sm text-gray-600'>
                    오른쪽 상단에 위치한 MY 버튼과 함께 사용됩니다.
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

export const Interactions: Story = {
  render: () => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [cascadeItems2, setCascadeItems2] = useState<
      { id: string; label: string }[]
    >([]);

    const categoryItems = [
      { id: 'fruits', label: '과일' },
      { id: 'vegetables', label: '채소' },
      { id: 'dairy', label: '유제품' },
    ];

    const handleCategory1Change = (value: string) => {
      setValue1(value);
      setValue2('');

      const itemsMap: Record<string, { id: string; label: string }[]> = {
        fruits: [
          { id: 'apple', label: '사과' },
          { id: 'banana', label: '바나나' },
          { id: 'orange', label: '오렌지' },
        ],
        vegetables: [
          { id: 'carrot', label: '당근' },
          { id: 'lettuce', label: '상추' },
          { id: 'tomato', label: '토마토' },
        ],
        dairy: [
          { id: 'milk', label: '우유' },
          { id: 'cheese', label: '치즈' },
          { id: 'yogurt', label: '요거트' },
        ],
      };

      setCascadeItems2(itemsMap[value] || []);
    };

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Dropdown Interactions
          </h1>

          {/* 연속 선택 (Cascading) */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                연속 선택 (Cascading Dropdowns)
              </h2>
              <p className='text-sm text-gray-600'>
                첫 번째 드롭다운의 선택에 따라 두 번째 드롭다운의 옵션이
                변경됩니다
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <div className='space-y-6'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    1단계: 카테고리 선택
                  </label>
                  <Dropdown
                    items={categoryItems}
                    value={value1}
                    onChange={handleCategory1Change}
                    placeholder='카테고리를 선택하세요'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    2단계: 세부 항목 선택
                  </label>
                  <Dropdown
                    items={cascadeItems2}
                    value={value2}
                    onChange={setValue2}
                    placeholder={
                      value1
                        ? '세부 항목을 선택하세요'
                        : '먼저 카테고리를 선택하세요'
                    }
                  />
                </div>
                <div className='rounded-md bg-gray-50 p-4'>
                  <p className='text-sm font-medium text-gray-700'>
                    선택 결과:
                  </p>
                  <p className='text-sm text-gray-600'>
                    카테고리: {value1 || '없음'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    세부 항목: {value2 || '없음'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
};
