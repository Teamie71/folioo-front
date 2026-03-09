'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useQueryClient } from '@tanstack/react-query';
import {
  setExperienceReturnPath,
  getExperienceReturnPath,
} from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ContributionBar } from '@/features/experience/components/ContributionBar';
// import { ExperienceExport } from '@/features/experience/portfolio/components/ExperienceExport';
import { OBTRedirectModal } from '@/components/OBT/OBTRedirectModal';
import { PortfolioDeleteBlockModal } from '@/features/experience/portfolio/components/PortfolioDeleteBlockModal';
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
import { ExportIcon } from '@/components/icons/ExportIcon';

export default function ExperienceSettingsPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const experienceId = id ? Number(id) : NaN;

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
  const [deleteBlockModalOpen, setDeleteBlockModalOpen] = useState(false);
  const [exportObtModalOpen, setExportObtModalOpen] = useState(false);
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

  const experience = experienceData?.result;
  const portfolioId =
    typeof experience?.portfolioId === 'number' &&
    Number.isFinite(experience.portfolioId)
      ? experience.portfolioId
      : 0;

  const isDone = !!portfolioId;
  useEffect(() => {
    if (!id || !Number.isFinite(experienceId)) return;
    if (experienceData === undefined) return;
    if (experience == null) {
      router.replace('/experience');
      return;
    }
    if (!isDone) {
      const returnPath = getExperienceReturnPath(id) ?? 'chat';
      router.replace(`/experience/settings/${id}/${returnPath}`);
    }
  }, [id, experienceId, experienceData, experience, isDone, router]);

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
        setDeleteBlockModalOpen(true);
      });
  };

  const handleContributionSave = (value: number) => {
    if (!portfolioId || !Number.isFinite(portfolioId)) return;
    updatePortfolio({
      portfolioId,
      data: { contributionRate: Math.min(100, Math.max(0, value)) },
    })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: getPortfolioControllerGetPortfolioQueryKey(portfolioId),
        });
        queryClient.invalidateQueries({
          queryKey: getExperienceControllerGetExperienceQueryKey(experienceId),
        });
      })
      .catch(() => {
        // TODO: 토스트 등 에러 피드백
      });
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
              {/* OBT 기간: 내보내기 클릭 시 준비 중 모달 */}
              <button
                type='button'
                onClick={() => setExportObtModalOpen(true)}
                className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent'
                aria-label='내보내기'
              >
                <ExportIcon />
                <span className='text-[1rem] text-[#1A1A1A]'>내보내기</span>
              </button>
              {/* 추후 내보내기 복구 시 사용
              <ExperienceExport
                contentRef={exportContentRef}
                title={displayTitle}
                className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent'
              />
              */}

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
                <div className='prose prose-sm w-full max-w-none rounded-[1rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] leading-[160%] text-[#1A1A1A]'>
                  <ReactMarkdown>{detailInfo || '내용'}</ReactMarkdown>
                </div>
              </div>

              {/* 담당업무 */}
              <div className='flex flex-col gap-[1rem]'>
                <span className='text-[1.125rem] font-bold'>담당업무</span>
                <div className='prose prose-sm w-full max-w-none rounded-[1rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] leading-[160%] text-[#1A1A1A]'>
                  <ReactMarkdown>{roleContent || '내용'}</ReactMarkdown>
                </div>
              </div>

              {/* 문제해결 */}
              <div className='flex flex-col gap-[1rem]'>
                <span className='text-[1.125rem] font-bold'>문제해결</span>
                <div className='prose prose-sm w-full max-w-none rounded-[1rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] leading-[160%] text-[#1A1A1A]'>
                  <ReactMarkdown>{problemContent || '내용'}</ReactMarkdown>
                </div>
              </div>

              {/* 배운 점 */}
              <div className='flex flex-col gap-[1rem]'>
                <span className='text-[1.125rem] font-bold'>배운 점</span>
                <div className='prose prose-sm w-full max-w-none rounded-[1rem] border border-[#74777D] px-[1.5rem] py-[1.25rem] text-[1rem] leading-[160%] text-[#1A1A1A]'>
                  <ReactMarkdown>{learnContent || '내용'}</ReactMarkdown>
                </div>
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

      <PortfolioDeleteBlockModal
        open={deleteBlockModalOpen}
        onOpenChange={setDeleteBlockModalOpen}
      />

      <OBTRedirectModal
        open={exportObtModalOpen}
        onOpenChange={setExportObtModalOpen}
      />
    </>
  );
}
