'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { setExperienceReturnPath } from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ContributionBar } from '@/features/experience/components/ContributionBar';
import { ExperienceExport } from '@/features/experience/portfolio/components/ExperienceExport';
import SpanArea from '@/components/SpanArea';
import Link from 'next/link';
import { FeedbackFloatingButton } from '@/components/FeedbackFloatingButton';
import { ExperienceIconWhite } from '@/components/icons/ExperienceIconWhite';
import { CorrectionIconWhite } from '@/components/icons/CorrectionIconWhite';

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
  const [detailInfo, setDetailInfo] = useState('내용');
  const [roleContent, setRoleContent] = useState('내용');
  const [problemContent, setProblemContent] = useState('내용');
  const [learnContent, setLearnContent] = useState('내용');
  const exportContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExperienceTitle(storeTitle);
  }, [id, storeTitle]);

  useEffect(() => {
    if (id) setExperienceReturnPath(id, 'portfolio');
  }, [id]);

  const handleDelete = () => {
    removeExperience(id);
    router.push('/experience');
  };

  return (
    <>
      <div className='mx-auto w-[66rem] min-w-[66rem] pt-[4rem]'>
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
              <ExperienceExport
                contentRef={exportContentRef}
                title={experienceTitle}
                className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent'
              />

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

        {/* 생성 내용 - 상세정보~배운 점 (내보내기 대상) */}
        <div
          ref={exportContentRef}
          className='flex flex-col gap-[3.75rem] pt-[3.75rem] pb-[3.75rem]'
        >
          {/* 상세정보 */}
          <div className='flex flex-col gap-[1rem]'>
            <span className='text-[1.125rem] font-bold'>상세정보</span>
            <SpanArea>{detailInfo}</SpanArea>
          </div>

          {/* 담당업무 */}
          <div className='flex flex-col gap-[1rem]'>
            <span className='text-[1.125rem] font-bold'>담당업무</span>
            <SpanArea>{roleContent}</SpanArea>
          </div>

          {/* 문제해결 */}
          <div className='flex flex-col gap-[1rem]'>
            <span className='text-[1.125rem] font-bold'>문제해결</span>
            <SpanArea>{problemContent}</SpanArea>
          </div>

          {/* 배운 점 */}
          <div className='flex flex-col gap-[1rem]'>
            <span className='text-[1.125rem] font-bold'>배운 점</span>
            <SpanArea>{learnContent}</SpanArea>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className='flex items-center justify-end gap-[2.75rem] pb-[6.625rem]'>
          {/* 새로운 경험 정리 시작하기 */}
          <Link href='/experience/settings/'>
            <button className='flex cursor-pointer items-center gap-[0.75rem] rounded-[6.25rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'>
              <ExperienceIconWhite />
              <span className='text-[1rem] font-bold text-[#ffffff]'>
                새로운 경험 정리 시작하기
              </span>
            </button>
          </Link>

          {/* 포트폴리오 첨삭 받기 */}
          <Link href={`/correction/${id}`}>
            <button className='flex cursor-pointer items-center gap-[0.75rem] rounded-[6.25rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'>
              <CorrectionIconWhite />
              <span className='text-[1rem] font-bold text-[#ffffff]'>
                포트폴리오 첨삭 받기
              </span>
            </button>
          </Link>
        </div>
      </div>

      <FeedbackFloatingButton />
    </>
  );
}
