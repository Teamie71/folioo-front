import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CommonButton } from '@/components/CommonButton';
import { BackButton } from '@/components/BackButton';
import { DeleteButton } from '@/components/DeleteButton';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { DropdownButton } from '@/components/DropdownButton';
import { FeedbackFloatingButton } from '@/components/FeedbackFloatingButton';
import { ModalFunctionButton } from '@/components/ModalFunctionButton';
import { ProfileButton } from '@/components/ProfileButton';
import { ProfileEditButton } from '@/components/ProfileEditButton';
import { SearchButton } from '@/components/SearchButton';
import { SingleButtonGroup } from '@/components/SingleButtonGroup';

const meta = {
  title: 'Components/Buttons/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Buttons Overview

버튼 컴포넌트들의 전체 컬렉션입니다.
다양한 용도와 스타일의 버튼들을 한눈에 확인할 수 있습니다.

## 카테고리

### 기본 버튼
- **CommonButton**: 가장 기본적인 버튼 컴포넌트로 다양한 variant 지원
- **BackButton**: 뒤로가기 버튼
- **SearchButton**: 검색 버튼

### 기능 버튼
- **DeleteButton**: 삭제 버튼
- **DeleteModalButton**: 모달을 여는 삭제 버튼
- **ModalFunctionButton**: 모달 내부 기능 버튼
- **SingleButtonGroup**: 단일 버튼 그룹

### 프로필 관련
- **ProfileButton**: 프로필 버튼
- **ProfileEditButton**: 프로필 편집 버튼

### 드롭다운 & 플로팅
- **DropdownButton**: 드롭다운 버튼
- **FeedbackFloatingButton**: 피드백 플로팅 버튼
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllButtons: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Buttons Collection
        </h1>

        {/* CommonButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>CommonButton</h2>
            <p className='text-sm text-gray-600'>
              다양한 variant를 지원하는 기본 버튼
            </p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <CommonButton variantType='Primary' px='2.25rem' py='0.75rem'>
              Primary
            </CommonButton>
            <CommonButton variantType='Execute' px='2.25rem' py='0.75rem'>
              Execute
            </CommonButton>
            <CommonButton variantType='Cancel' px='2.25rem' py='0.75rem'>
              Cancel
            </CommonButton>
            <CommonButton variantType='Outline' px='2.25rem' py='0.5rem'>
              Outline
            </CommonButton>
            <CommonButton variantType='StartChat'>StartChat</CommonButton>
            <CommonButton variantType='Gradient' px='2.25rem' py='0.75rem'>
              Gradient →
            </CommonButton>
            <CommonButton
              variantType='Primary'
              px='2.25rem'
              py='0.75rem'
              disabled
            >
              Disabled
            </CommonButton>
          </div>
        </section>

        {/* BackButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>BackButton</h2>
            <p className='text-sm text-gray-600'>뒤로가기 버튼</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <BackButton />
          </div>
        </section>

        {/* SearchButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>SearchButton</h2>
            <p className='text-sm text-gray-600'>검색 버튼</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <SearchButton onClick={() => alert('검색!')} />
          </div>
        </section>

        {/* DeleteButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>DeleteButton</h2>
            <p className='text-sm text-gray-600'>삭제 버튼</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <DeleteButton onClick={() => alert('삭제!')} />
          </div>
        </section>

        {/* DeleteModalButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              DeleteModalButton
            </h2>
            <p className='text-sm text-gray-600'>모달을 여는 삭제 버튼</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <DeleteModalButton
              onDelete={() => {
                alert('삭제됨!');
              }}
              title='항목'
            />
          </div>
        </section>

        {/* DropdownButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>DropdownButton</h2>
            <p className='text-sm text-gray-600'>드롭다운 버튼</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <DropdownButton
              items={[
                { id: '1', label: '옵션 1' },
                { id: '2', label: '옵션 2' },
              ]}
            />
          </div>
        </section>

        {/* ModalFunctionButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              ModalFunctionButton
            </h2>
            <p className='text-sm text-gray-600'>모달 내부 기능 버튼</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <ModalFunctionButton
              onEdit={() => alert('수정!')}
              onDelete={() => alert('삭제!')}
            />
          </div>
        </section>

        {/* ProfileButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>ProfileButton</h2>
            <p className='text-sm text-gray-600'>프로필 버튼</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <ProfileButton onClick={() => alert('프로필 클릭!')} />
          </div>
        </section>

        {/* ProfileEditButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              ProfileEditButton
            </h2>
            <p className='text-sm text-gray-600'>프로필 편집 버튼</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <ProfileEditButton
              value='사용자 이름'
              onSave={(newValue) => alert(`저장: ${newValue}`)}
            />
          </div>
        </section>

        {/* SingleButtonGroup */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              SingleButtonGroup
            </h2>
            <p className='text-sm text-gray-600'>단일 버튼 그룹</p>
          </div>
          <div className='flex flex-wrap gap-4 rounded-lg bg-white p-6 shadow'>
            <SingleButtonGroup
              options={[{ label: '옵션 1' }, { label: '옵션 2' }]}
              onValueChange={(value) => alert(`선택: ${value}`)}
            />
          </div>
        </section>

        {/* FeedbackFloatingButton */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              FeedbackFloatingButton
            </h2>
            <p className='text-sm text-gray-600'>
              피드백 플로팅 버튼 (화면 우측 하단 고정)
            </p>
          </div>
          <div className='relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow'>
            <p className='text-sm text-gray-600'>
              우측 하단에 고정되는 플로팅 버튼입니다.
            </p>
            <FeedbackFloatingButton />
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
          Buttons by Category
        </h1>

        {/* 기본 버튼 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-blue-50 p-4'>
            <h2 className='text-2xl font-bold text-blue-900'>기본 버튼</h2>
            <p className='text-sm text-blue-700'>
              일반적인 용도로 사용되는 버튼들
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>CommonButton</h3>
              <div className='flex flex-col gap-2'>
                <CommonButton variantType='Primary' px='2rem' py='0.5rem'>
                  Primary
                </CommonButton>
                <CommonButton variantType='Execute' px='2rem' py='0.5rem'>
                  Execute
                </CommonButton>
              </div>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>BackButton</h3>
              <BackButton />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>SearchButton</h3>
              <SearchButton onClick={() => {}} />
            </div>
          </div>
        </section>

        {/* 기능 버튼 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-red-50 p-4'>
            <h2 className='text-2xl font-bold text-red-900'>기능 버튼</h2>
            <p className='text-sm text-red-700'>특정 기능을 수행하는 버튼들</p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>DeleteButton</h3>
              <DeleteButton onClick={() => {}} />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                DeleteModalButton
              </h3>
              <DeleteModalButton onDelete={() => {}} title='항목' />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                ModalFunctionButton
              </h3>
              <ModalFunctionButton onEdit={() => {}} onDelete={() => {}} />
            </div>
          </div>
        </section>

        {/* 프로필 관련 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-purple-50 p-4'>
            <h2 className='text-2xl font-bold text-purple-900'>프로필 관련</h2>
            <p className='text-sm text-purple-700'>프로필과 관련된 버튼들</p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                ProfileButton
              </h3>
              <ProfileButton onClick={() => {}} />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                ProfileEditButton
              </h3>
              <ProfileEditButton value='이름' onSave={() => {}} />
            </div>
          </div>
        </section>

        {/* 드롭다운 & 플로팅 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-green-50 p-4'>
            <h2 className='text-2xl font-bold text-green-900'>
              드롭다운 & 플로팅
            </h2>
            <p className='text-sm text-green-700'>특수한 형태의 버튼들</p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                DropdownButton
              </h3>
              <DropdownButton
                items={[
                  { id: '1', label: '옵션 1' },
                  { id: '2', label: '옵션 2' },
                ]}
              />
            </div>
            <div className='relative h-48 overflow-hidden rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                FeedbackFloatingButton
              </h3>
              <FeedbackFloatingButton />
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};
