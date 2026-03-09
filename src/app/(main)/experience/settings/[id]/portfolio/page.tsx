'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
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
import {
  getExperienceControllerGetExperienceQueryKey,
  getExperienceControllerGetExperiencesQueryKey,
  useExperienceControllerDeleteExperience,
  useExperienceControllerGetExperience,
  useExperienceControllerUpdateExperience,
} from '@/api/endpoints/experience/experience';
import {
  getPortfolioControllerGetPortfolioQueryKey,
  usePortfolioControllerGetPortfolio,
  usePortfolioControllerUpdatePortfolio,
} from '@/api/endpoints/portfolio/portfolio';
import { getHopeJobLabel } from '@/constants/hopeJob';

export default function ExperienceSettingsPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const experienceId = id ? Number(id) : NaN;
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
  const queryClient = useQueryClient();
  const { mutateAsync: updateExperience } =
    useExperienceControllerUpdateExperience();
  const storeTitle = useExperienceStore(
    (state) =>
      state.experienceCards.find((c) => c.id === id)?.title ??
      '새로운 경험 정리',
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [detailInfo, setDetailInfo] = useState('');
  const [roleContent, setRoleContent] = useState('');
  const [problemContent, setProblemContent] = useState('');
  const [learnContent, setLearnContent] = useState('');
  const [hopeJobTag, setHopeJobTag] = useState('IT 개발');
  const exportContentRef = useRef<HTMLDivElement>(null);

  const { data: experienceData } = useExperienceControllerGetExperience(
    experienceId,
    {
      query: {
        enabled: Number.isFinite(experienceId),
      },
    },
  );

  const { mutateAsync: updatePortfolio } =
    usePortfolioControllerUpdatePortfolio();
  const { mutateAsync: deleteExperience } =
    useExperienceControllerDeleteExperience();

  const { data: portfolioData, isLoading } = usePortfolioControllerGetPortfolio(
    portfolioId,
    {
      query: {
        enabled: !!portfolioId,
      },
    },
  );

  const portfolio = portfolioData?.result;
  const experienceName = experienceData?.result?.name;
  const displayTitle = experienceName ?? storeTitle ?? '새로운 경험 정리';

  useEffect(() => {
    if (!portfolio) return;
    setDetailInfo(portfolio.description ?? '');
    setRoleContent(portfolio.responsibilities ?? '');
    setProblemContent(portfolio.problemSolving ?? '');
    setLearnContent(portfolio.learnings ?? '');
    setHopeJobTag(getHopeJobLabel(portfolio.hopeJob));
  }, [portfolio]);

  useEffect(() => {
    if (experienceName != null && id) {
      updateExperienceTitle(id, experienceName);
    }
  }, [id, experienceName, updateExperienceTitle]);

  useEffect(() => {
    document.title = `${displayTitle} - Folioo`;
  }, [displayTitle]);

  useEffect(() => {
    if (id) setExperienceReturnPath(id, 'portfolio');
  }, [id]);

  const handleDelete = () => {
    if (!Number.isFinite(experienceId)) {
      removeExperience(id);
      router.push('/experience');
      return;
    }
    deleteExperience({ experienceId })
      .then(() => {
        removeExperience(id);
        return queryClient.refetchQueries({
          queryKey: getExperienceControllerGetExperiencesQueryKey(),
        });
      })
      .then(() => {
        router.push('/experience');
      })
      .catch(() => {
        alert('삭제에 실패했어요. 다시 시도해주세요.');
      });
  };

  const handleContributionSave = (value: number) => {
    if (!portfolioId || !Number.isFinite(portfolioId)) return;
    updatePortfolio({ portfolioId, data: { contributionRate: value } }).then(
      () => {
        queryClient.invalidateQueries({
          queryKey: getPortfolioControllerGetPortfolioQueryKey(portfolioId),
        });
      },
    );
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
                title={displayTitle}
                isEditing={isEditingTitle}
                onEdit={() => setIsEditingTitle(true)}
                onSave={(newTitle) => {
                  if (!Number.isFinite(experienceId)) {
                    updateExperienceTitle(id, newTitle);
                    setIsEditingTitle(false);
                    return;
                  }
                  updateExperience({
                    experienceId,
                    data: { name: newTitle },
                  })
                    .then(() => {
                      updateExperienceTitle(id, newTitle);
                      queryClient.invalidateQueries({
                        queryKey:
                          getExperienceControllerGetExperienceQueryKey(
                            experienceId,
                          ),
                      });
                      setIsEditingTitle(false);
                    })
                    .catch(() => {
                      setIsEditingTitle(false);
                    });
                }}
              />
            </div>

            <div className='flex items-center gap-[1.5rem]'>
              <ExperienceExport
                contentRef={exportContentRef}
                title={displayTitle}
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
            initialValue={
              portfolio?.contributionRate != null
                ? Math.min(100, Math.max(0, portfolio.contributionRate))
                : 0
            }
            duration={300}
            onSave={handleContributionSave}
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
