'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { InlineEdit } from '@/components/InlineEdit';
import InputArea from '@/components/InputArea';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import TextField from '@/components/TextField';

const meta = {
  title: 'Components/Forms/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Forms Overview

폼 컴포넌트들의 전체 컬렉션입니다.
다양한 입력 필드와 에디터 컴포넌트들을 한눈에 확인할 수 있습니다.

## 카테고리

### 텍스트 입력
- **InputArea**: 단일 라인 입력 필드로 다양한 variant 지원
- **TextField**: 자동 높이 조절 다중 라인 텍스트 입력 필드
- **InlineEdit**: 인라인 편집 가능한 텍스트 필드

### 에디터
- **MarkdownEditor**: 마크다운 기반 리치 텍스트 에디터
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllForms: Story = {
  render: () => {
    const [inputValue, setInputValue] = useState('');
    const [roundedInputValue, setRoundedInputValue] = useState('');
    const [textFieldValue, setTextFieldValue] = useState('');
    const [wideTextFieldValue, setWideTextFieldValue] = useState('');
    const [markdownValue, setMarkdownValue] = useState(
      '# Hello World\n\nThis is a **markdown** editor.',
    );
    const [inlineTitle, setInlineTitle] = useState('프로젝트 제목');
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Forms Collection
          </h1>

          {/* InputArea */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>InputArea</h2>
              <p className='text-sm text-gray-600'>
                단일 라인 입력 필드 (default & rounded variants)
              </p>
            </div>
            <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Default Variant
                </label>
                <InputArea
                  variant='default'
                  placeholder='텍스트를 입력하세요...'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Rounded Variant
                </label>
                <InputArea
                  variant='rounded'
                  placeholder='검색어를 입력하세요...'
                  value={roundedInputValue}
                  onChange={(e) => setRoundedInputValue(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  With Right Element
                </label>
                <InputArea
                  variant='default'
                  placeholder='비밀번호'
                  type='password'
                  rightElement={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      className='text-gray-400'
                    >
                      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                      <circle cx='12' cy='12' r='3' />
                    </svg>
                  }
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Custom Width (400px)
                </label>
                <InputArea
                  variant='default'
                  width={400}
                  placeholder='고정 너비 입력 필드'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Read Only
                </label>
                <InputArea
                  variant='default'
                  readOnly
                  value='읽기 전용 필드입니다'
                />
              </div>
            </div>
          </section>

          {/* TextField */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>TextField</h2>
              <p className='text-sm text-gray-600'>
                자동 높이 조절 다중 라인 텍스트 입력 (default & wide variants)
              </p>
            </div>
            <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Default Variant
                </label>
                <TextField
                  variant='default'
                  placeholder='여러 줄의 텍스트를 입력하세요...'
                  value={textFieldValue}
                  onChange={(e) => setTextFieldValue(e.target.value)}
                />
                <p className='mt-1 text-xs text-gray-500'>
                  자동으로 높이가 조절됩니다. 엔터를 눌러 새 줄을 추가해보세요.
                </p>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Wide Variant
                </label>
                <TextField
                  variant='wide'
                  placeholder='더 넓은 라인 높이를 가진 텍스트 필드...'
                  value={wideTextFieldValue}
                  onChange={(e) => setWideTextFieldValue(e.target.value)}
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Custom Height (200px min)
                </label>
                <TextField
                  variant='default'
                  height={200}
                  placeholder='최소 높이가 설정된 텍스트 필드'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Custom Width (500px)
                </label>
                <TextField
                  variant='default'
                  width={500}
                  placeholder='고정 너비 텍스트 필드'
                />
              </div>
            </div>
          </section>

          {/* InlineEdit */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>InlineEdit</h2>
              <p className='text-sm text-gray-600'>
                인라인 편집 가능한 텍스트 (호버 시 편집 아이콘 표시)
              </p>
            </div>
            <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Editable Title (클릭 또는 편집 아이콘 클릭)
                </label>
                <InlineEdit
                  title={inlineTitle}
                  isEditing={isEditing}
                  editable={true}
                  onEdit={() => setIsEditing(true)}
                  onSave={(newTitle) => {
                    setInlineTitle(newTitle);
                    setIsEditing(false);
                  }}
                />
                <p className='mt-2 text-xs text-gray-500'>
                  제목 위에 마우스를 올리면 편집 아이콘이 나타납니다. 클릭하여
                  편집하세요.
                </p>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Non-editable Title
                </label>
                <InlineEdit title='편집할 수 없는 제목' editable={false} />
                <p className='mt-2 text-xs text-gray-500'>
                  editable=false로 설정하면 편집 아이콘이 표시되지 않습니다.
                </p>
              </div>
            </div>
          </section>

          {/* MarkdownEditor */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                MarkdownEditor
              </h2>
              <p className='text-sm text-gray-600'>
                마크다운 기반 리치 텍스트 에디터 (헤딩, 리스트, 볼드 등 지원)
              </p>
            </div>
            <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Markdown Editor
                </label>
                <MarkdownEditor
                  value={markdownValue}
                  onChange={setMarkdownValue}
                  placeholder='마크다운 형식으로 작성하세요...'
                />
                <div className='mt-4 rounded-lg bg-gray-50 p-4'>
                  <h4 className='mb-2 text-sm font-semibold text-gray-700'>
                    지원하는 마크다운 문법:
                  </h4>
                  <ul className='space-y-1 text-xs text-gray-600'>
                    <li>• # 헤딩1, ## 헤딩2, ### 헤딩3</li>
                    <li>• **볼드**, *이탤릭*</li>
                    <li>• - 리스트 항목 (ul)</li>
                    <li>• 1. 리스트 항목 (ol)</li>
                    <li>• [링크](url)</li>
                    <li>• &gt; 인용구</li>
                    <li>• --- 구분선</li>
                  </ul>
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Custom Min Height (300px)
                </label>
                <MarkdownEditor
                  value='# 큰 에디터\n\n더 많은 공간이 있는 에디터입니다.'
                  onChange={() => {}}
                  minHeight='18.75rem'
                />
              </div>
            </div>
          </section>

          {/* 실제 사용 예시 */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                실제 사용 예시
              </h2>
              <p className='text-sm text-gray-600'>
                폼 컴포넌트들을 조합한 실제 사용 사례
              </p>
            </div>
            <div className='rounded-lg bg-white p-8 shadow'>
              <InlineEdit
                title='새 프로젝트 만들기'
                isEditing={false}
                editable={true}
                onEdit={() => {}}
                onSave={() => {}}
                className='mb-6'
              />

              <div className='space-y-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    프로젝트 URL
                  </label>
                  <InputArea
                    variant='rounded'
                    placeholder='project-name'
                    value=''
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    한 줄 설명
                  </label>
                  <TextField
                    variant='default'
                    placeholder='프로젝트에 대한 간단한 설명을 입력하세요'
                  />
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    상세 설명
                  </label>
                  <MarkdownEditor
                    value='## 프로젝트 소개\n\n여기에 상세한 내용을 작성하세요...'
                    onChange={() => {}}
                    placeholder='마크다운으로 상세 설명을 작성하세요'
                    minHeight='12rem'
                  />
                </div>
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
    const [inputDemo, setInputDemo] = useState('');
    const [textDemo, setTextDemo] = useState('');
    const [mdDemo, setMdDemo] = useState('# 제목\n\n내용을 입력하세요.');
    const [titleDemo, setTitleDemo] = useState('편집 가능한 제목');
    const [editing, setEditing] = useState(false);

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Forms by Category
          </h1>

          {/* 텍스트 입력 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-blue-50 p-4'>
              <h2 className='text-2xl font-bold text-blue-900'>텍스트 입력</h2>
              <p className='text-sm text-blue-700'>
                단순한 텍스트 입력을 위한 컴포넌트들
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>InputArea</h3>
                <div className='space-y-3'>
                  <InputArea
                    variant='default'
                    placeholder='Default variant'
                    value={inputDemo}
                    onChange={(e) => setInputDemo(e.target.value)}
                  />
                  <InputArea variant='rounded' placeholder='Rounded variant' />
                </div>
              </div>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>TextField</h3>
                <TextField
                  variant='default'
                  placeholder='다중 라인 텍스트 입력...'
                  value={textDemo}
                  onChange={(e) => setTextDemo(e.target.value)}
                />
              </div>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>InlineEdit</h3>
                <InlineEdit
                  title={titleDemo}
                  isEditing={editing}
                  editable={true}
                  onEdit={() => setEditing(true)}
                  onSave={(newTitle) => {
                    setTitleDemo(newTitle);
                    setEditing(false);
                  }}
                />
              </div>
            </div>
          </section>

          {/* 에디터 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-purple-50 p-4'>
              <h2 className='text-2xl font-bold text-purple-900'>에디터</h2>
              <p className='text-sm text-purple-700'>
                리치 텍스트 편집을 위한 컴포넌트
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                MarkdownEditor
              </h3>
              <MarkdownEditor
                value={mdDemo}
                onChange={setMdDemo}
                placeholder='마크다운을 입력하세요...'
              />
            </div>
          </section>

          {/* Variants 비교 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-green-50 p-4'>
              <h2 className='text-2xl font-bold text-green-900'>
                Variants 비교
              </h2>
              <p className='text-sm text-green-700'>
                각 컴포넌트의 variant 비교
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  InputArea Variants
                </h3>
                <div className='space-y-3'>
                  <div>
                    <p className='mb-1 text-xs text-gray-500'>default</p>
                    <InputArea variant='default' placeholder='Default style' />
                  </div>
                  <div>
                    <p className='mb-1 text-xs text-gray-500'>rounded</p>
                    <InputArea variant='rounded' placeholder='Rounded style' />
                  </div>
                </div>
              </div>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  TextField Variants
                </h3>
                <div className='space-y-3'>
                  <div>
                    <p className='mb-1 text-xs text-gray-500'>default</p>
                    <TextField
                      variant='default'
                      placeholder='Default line height'
                    />
                  </div>
                  <div>
                    <p className='mb-1 text-xs text-gray-500'>wide</p>
                    <TextField variant='wide' placeholder='Wide line height' />
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
