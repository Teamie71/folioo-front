'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { setExperienceReturnPath } from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import { usePortfolioCreationStore } from '@/store/usePortfolioCreationStore';
import { ContributionBar } from '@/features/experience/components/ContributionBar';
import { ExperienceExport } from '@/features/experience/portfolio/components/ExperienceExport';
import SpanArea from '@/components/SpanArea';
import Link from 'next/link';
import { FeedbackFloatingButton } from '@/components/FeedbackFloatingButton';
import { ExperienceIconWhite } from '@/components/icons/ExperienceIconWhite';
import { CorrectionIconWhite } from '@/components/icons/CorrectionIconWhite';
import { usePortfolioControllerGetPortfolio } from '@/api/endpoints/portfolio/portfolio';
import { PortfolioDetailResDTOHopeJob } from '@/api/models';

const HOPE_JOB_LABEL: Record<string, string> = {
  [PortfolioDetailResDTOHopeJob.NONE]: '직무',
  [PortfolioDetailResDTOHopeJob.PLANNING]: '기획',
  [PortfolioDetailResDTOHopeJob.MARKETING]: '마케팅',
  [PortfolioDetailResDTOHopeJob.DESIGN]: '디자인',
  [PortfolioDetailResDTOHopeJob.DEV]: 'IT 개발',
  [PortfolioDetailResDTOHopeJob.MEDIA]: '미디어',
  [PortfolioDetailResDTOHopeJob.DATA]: '데이터',
};

export default function ExperienceSettingsPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const portfolioIdParam = searchParams.get('portfolioId');
  const getPortfolioIdFromStore = usePortfolioCreationStore(
    (s) => s.getPortfolioId,
  );
  const portfolioIdNum =
    (portfolioIdParam ? Number(portfolioIdParam) : NaN) ||
    getPortfolioIdFromStore(id);
  const portfolioId =
    portfolioIdNum && !Number.isNaN(portfolioIdNum) ? portfolioIdNum : 0;

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
  const [detailInfo, setDetailInfo] = useState('');
  const [roleContent, setRoleContent] = useState('');
  const [problemContent, setProblemContent] = useState('');
  const [learnContent, setLearnContent] = useState('');
  const [hopeJobTag, setHopeJobTag] = useState('IT 개발');
  const exportContentRef = useRef<HTMLDivElement>(null);

  const { data: portfolioData, isLoading } = usePortfolioControllerGetPortfolio(
    portfolioId,
    {
      query: {
        enabled: !!portfolioId,
      },
    },
  );

  const portfolio = portfolioData?.result;

  useEffect(() => {
    if (!portfolio) return;
    setDetailInfo(portfolio.description ?? '');
    setRoleContent(portfolio.responsibilities ?? '');
    setProblemContent(portfolio.problemSolving ?? '');
    setLearnContent(portfolio.learnings ?? '');
    setHopeJobTag(
      (portfolio.hopeJob && HOPE_JOB_LABEL[portfolio.hopeJob]) ?? 'IT 개발',
    );
  }, [portfolio]);

  useEffect(() => {
    setExperienceTitle(storeTitle);
  }, [id, storeTitle]);

  useEffect(() => {
    document.title = `${experienceTitle} - Folioo`;
  }, [experienceTitle]);

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
              <div className='h-[1.5rem] w-[0.125rem] border-none bg-[#9EA4A9]' />

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
          <ContributionBar
            duration={
              portfolio?.contributionRate != null
                ? Math.round((portfolio.contributionRate ?? 0) * 10)
                : 300
            }
          />

          {/* 직무 태그 */}
          <div className='rounded-[3.75rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[1.75rem] py-[0.25rem] text-[1rem] font-semibold text-[#5060C5]'>
            {hopeJobTag}
          </div>
        </div>

        {/* 생성 내용 - 상세정보~배운 점 (내보내기 대상) */}
        <div
          ref={exportContentRef}
          className='flex flex-col gap-[3.75rem] pt-[3.75rem] pb-[3.75rem]'
        >
          {isLoading && !portfolio ? (
            <p className='text-[1rem] text-[#74777D]'></p>
          ) : !portfolioId ? (
            <p className='text-[1rem] text-[#74777D]'></p>
          ) : (
            <>
              {/* 상세정보 */}
              <div className='flex flex-col gap-[1rem]'>
                <span className='text-[1.125rem] font-bold'>상세정보</span>
                <SpanArea>{detailInfo || '내용'}</SpanArea>
              </div>

              {/* 담당업무 */}
              <div className='flex flex-col gap-[1rem]'>
                <span className='text-[1.125rem] font-bold'>담당업무</span>
                <SpanArea>{roleContent || '내용'}</SpanArea>
              </div>

              {/* 문제해결 */}
              <div className='flex flex-col gap-[1rem]'>
                <span className='text-[1.125rem] font-bold'>문제해결</span>
                <SpanArea>{problemContent || '내용'}</SpanArea>
              </div>

              {/* 배운 점 */}
              <div className='flex flex-col gap-[1rem]'>
                <span className='text-[1.125rem] font-bold'>배운 점</span>
                <SpanArea>{learnContent || '내용'}</SpanArea>
              </div>
            </>
          )}
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
          <Link href='/correction/new'>
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
