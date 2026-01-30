'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ContributionBar } from '@/features/experience/components/ContributionBar';
import SpanArea from '@/components/SpanArea';

export default function ExperienceSettingsPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const removeExperience = useExperienceStore(
    (state) => state.removeExperience,
  );
  const updateExperienceTitle = useExperienceStore(
    (state) => state.updateExperienceTitle,
  );
  const storeTitle = useExperienceStore(
    (state) =>
      state.experienceCards.find((c) => c.id === id)?.title ??
      '새로운 경험 정리',
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [experienceTitle, setExperienceTitle] = useState(storeTitle);

  useEffect(() => {
    setExperienceTitle(storeTitle);
  }, [id, storeTitle]);

  const handleDelete = () => {
    removeExperience(id);
    router.push('/experience');
  };

  return (
    <div className='mx-auto w-[66rem] min-w-[66rem]'>
      <div className='flex flex-col gap-[1.125rem] pb-[4.5rem]'>
        {/* 헤더 */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-[0.5rem]'>
            <BackButton href='/experience' />
            <InlineEdit
              title={experienceTitle}
              isEditing={isEditingTitle}
              onEdit={() => setIsEditingTitle(true)}
              onSave={(newTitle) => {
                setExperienceTitle(newTitle);
                updateExperienceTitle(id, newTitle);
                setIsEditingTitle(false);
              }}
            />
          </div>

          <div className='flex items-center gap-[1.5rem]'>
            {/* 내보내기 버튼 - 아직 클릭 동작 없음 */}
            <button
              type='button'
              className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent'
              aria-label='내보내기'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M8.71 7.71002L11 5.41002V15C11 15.2652 11.1054 15.5196 11.2929 15.7071C11.4804 15.8947 11.7348 16 12 16C12.2652 16 12.5196 15.8947 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15V5.41002L15.29 7.71002C15.383 7.80375 15.4936 7.87814 15.6154 7.92891C15.7373 7.97968 15.868 8.00582 16 8.00582C16.132 8.00582 16.2627 7.97968 16.3846 7.92891C16.5064 7.87814 16.617 7.80375 16.71 7.71002C16.8037 7.61706 16.8781 7.50645 16.9289 7.3846C16.9797 7.26274 17.0058 7.13203 17.0058 7.00002C17.0058 6.86801 16.9797 6.7373 16.9289 6.61544C16.8781 6.49358 16.8037 6.38298 16.71 6.29002L12.71 2.29002C12.6149 2.19898 12.5028 2.12761 12.38 2.08002C12.1365 1.98 11.8635 1.98 11.62 2.08002C11.4972 2.12761 11.3851 2.19898 11.29 2.29002L7.29 6.29002C7.19676 6.38326 7.1228 6.49395 7.07234 6.61577C7.02188 6.73759 6.99591 6.86816 6.99591 7.00002C6.99591 7.13188 7.02188 7.26245 7.07234 7.38427C7.1228 7.50609 7.19676 7.61678 7.29 7.71002C7.38324 7.80326 7.49393 7.87722 7.61575 7.92768C7.73757 7.97814 7.86814 8.00411 8 8.00411C8.13186 8.00411 8.26243 7.97814 8.38425 7.92768C8.50607 7.87722 8.61676 7.80326 8.71 7.71002ZM21 14C20.7348 14 20.4804 14.1054 20.2929 14.2929C20.1054 14.4804 20 14.7348 20 15V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8947 19.2652 20 19 20H5C4.73478 20 4.48043 19.8947 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V15C4 14.7348 3.89464 14.4804 3.70711 14.2929C3.51957 14.1054 3.26522 14 3 14C2.73478 14 2.48043 14.1054 2.29289 14.2929C2.10536 14.4804 2 14.7348 2 15V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7957 22 19V15C22 14.7348 21.8946 14.4804 21.7071 14.2929C21.5196 14.1054 21.2652 14 21 14Z'
                  fill='#74777D'
                />
              </svg>
              <span className='text-[1rem] text-[#1A1A1A]'>내보내기</span>
            </button>

            {/* 구분선 */}
            <div className='h-[2rem] w-[0.125rem] border-none bg-[#1A1A1A]' />

            <DeleteModalButton
              title='이 경험 정리를 정말 삭제하시겠습니까?'
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* 콘텐츠 구분선 */}
        <div className='rounded-[2rem] border border-[#9EA4A9]' />
      </div>

      {/* 기여도 & 태그 영역 */}
      <div className='flex items-center justify-between'>
        {/* 기여도 */}
        <ContributionBar duration={300} />

        {/* 직무 태그 */}
        <div className='rounded-[3.75rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[1.75rem] py-[0.25rem] text-[1rem] font-semibold text-[#5060C5]'>
          IT 개발
        </div>
      </div>

      {/* 생성 내용 */}
      <div className='flex flex-col gap-[3.75rem] pt-[3.75rem] pb-[3.75rem]'>
        {/* 상세정보 */}
        <div className='flex flex-col gap-[1rem]'>
          <span className='text-[1.125rem] font-bold'>상세정보</span>
          <SpanArea>
            내용
          </SpanArea>
        </div>

        {/* 담당업무 */}
        <div className='flex flex-col gap-[1rem]'>
          <span className='text-[1.125rem] font-bold'>담당업무</span>
          <SpanArea>
            내용
          </SpanArea>
        </div>

        {/* 문제해결 */}
        <div className='flex flex-col gap-[1rem]'>
          <span className='text-[1.125rem] font-bold'>문제해결</span>
          <SpanArea>
            내용
          </SpanArea>
        </div>

        {/* 배운 점 */}
        <div className='flex flex-col gap-[1rem]'>
          <span className='text-[1.125rem] font-bold'>배운 점</span>
          <SpanArea>
            내용
          </SpanArea>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className='flex items-center justify-end gap-[2.75rem] pb-[6.625rem]'>
        {/* 새로운 경험 정리 시작하기 */}
        <button className='flex cursor-pointer items-center gap-[0.75rem] rounded-[6.25rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 28 28'
            fill='none'
          >
            <path
              d='M21 0H2.33333C1.04467 0 0 1.04467 0 2.33333V4.66667C0 5.95533 1.04467 7 2.33333 7H21C22.2887 7 23.3333 5.95533 23.3333 4.66667V2.33333C23.3333 1.04467 22.2887 0 21 0Z'
              fill='white'
            />
            <path
              d='M25.666 9.33337H6.99935C5.71068 9.33337 4.66602 10.378 4.66602 11.6667V14C4.66602 15.2887 5.71068 16.3334 6.99935 16.3334H25.666C26.9547 16.3334 27.9993 15.2887 27.9993 14V11.6667C27.9993 10.378 26.9547 9.33337 25.666 9.33337Z'
              fill='white'
            />
            <path
              d='M21 18.6666H2.33333C1.04467 18.6666 0 19.7113 0 21V23.3333C0 24.622 1.04467 25.6666 2.33333 25.6666H21C22.2887 25.6666 23.3333 24.622 23.3333 23.3333V21C23.3333 19.7113 22.2887 18.6666 21 18.6666Z'
              fill='white'
            />
          </svg>
          <span className='text-[1rem] font-bold text-[#ffffff]'>
            새로운 경험 정리 시작하기
          </span>
        </button>

        {/* 포트폴리오 첨삭 받기 */}
        <button className='flex cursor-pointer items-center gap-[0.75rem] rounded-[6.25rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M4 21C3.45 21 2.97933 20.8043 2.588 20.413C2.19667 20.0217 2.00067 19.5507 2 19V5C2 4.45 2.196 3.97933 2.588 3.588C2.98 3.19667 3.45067 3.00067 4 3H20C20.55 3 21.021 3.196 21.413 3.588C21.805 3.98 22.0007 4.45067 22 5V19C22 19.55 21.8043 20.021 21.413 20.413C21.0217 20.805 20.5507 21.0007 20 21H4ZM9 17C9.28333 17 9.521 16.904 9.713 16.712C9.905 16.52 10.0007 16.2827 10 16C9.99933 15.7173 9.90333 15.48 9.712 15.288C9.52067 15.096 9.28333 15 9 15H6C5.71667 15 5.47933 15.096 5.288 15.288C5.09667 15.48 5.00067 15.7173 5 16C4.99933 16.2827 5.09533 16.5203 5.288 16.713C5.48067 16.9057 5.718 17.0013 6 17H9ZM14.55 12.175L13.825 11.45C13.625 11.25 13.3917 11.1543 13.125 11.163C12.8583 11.1717 12.625 11.2757 12.425 11.475C12.2417 11.675 12.1457 11.9083 12.137 12.175C12.1283 12.4417 12.2243 12.675 12.425 12.875L13.85 14.3C14.05 14.5 14.2833 14.6 14.55 14.6C14.8167 14.6 15.05 14.5 15.25 14.3L18.8 10.75C19 10.55 19.1 10.3167 19.1 10.05C19.1 9.78333 19 9.55 18.8 9.35C18.6 9.15 18.3627 9.05 18.088 9.05C17.8133 9.05 17.5757 9.15 17.375 9.35L14.55 12.175ZM9 13C9.28333 13 9.521 12.904 9.713 12.712C9.905 12.52 10.0007 12.2827 10 12C9.99933 11.7173 9.90333 11.48 9.712 11.288C9.52067 11.096 9.28333 11 9 11H6C5.71667 11 5.47933 11.096 5.288 11.288C5.09667 11.48 5.00067 11.7173 5 12C4.99933 12.2827 5.09533 12.5203 5.288 12.713C5.48067 12.9057 5.718 13.0013 6 13H9ZM9 9C9.28333 9 9.521 8.904 9.713 8.712C9.905 8.52 10.0007 8.28267 10 8C9.99933 7.71733 9.90333 7.48 9.712 7.288C9.52067 7.096 9.28333 7 9 7H6C5.71667 7 5.47933 7.096 5.288 7.288C5.09667 7.48 5.00067 7.71733 5 8C4.99933 8.28267 5.09533 8.52033 5.288 8.713C5.48067 8.90567 5.718 9.00133 6 9H9Z'
              fill='white'
            />
          </svg>
          <span className='text-[1rem] font-bold text-[#ffffff]'>
            포트폴리오 첨삭 받기
          </span>
        </button>
      </div>
    </div>
  );
}
