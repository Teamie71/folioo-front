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
import { ExperienceExportDropdown } from '@/features/experience/portfolio/components/ExperienceExportDropdown';
import { ExperienceExportPptxDropdown } from '@/features/experience/portfolio/components/ExperienceExportPptxDropdown';
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
import { PortfolioVisualizationSwitchToggle } from '@/features/experience/portfolio/components/PortfolioVisualizationSwitchToggle';
import VisualPortfolioContent from '@/features/experience/portfolio/visualization/VisualPortfolioContent';
import TextPortfolioCard from '@/features/experience/portfolio/text/TextPortfolioCard';
import { VisualizationCreateModal } from '@/features/experience/portfolio/visualization/VisualizationCreateModal';

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
  const [isVisualizationModalOpen, setVisualizationModalOpen] = useState(false);
  const [detailInfo, setDetailInfo] = useState('');
  const [roleContent, setRoleContent] = useState('');
  const [problemContent, setProblemContent] = useState('');
  const [learnContent, setLearnContent] = useState('');
  const [hopeJobTag, setHopeJobTag] = useState('IT 개발');
  const [viewMode, setViewMode] = useState('text');
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

  useEffect(() => {
    if (!id || !Number.isFinite(experienceId)) return;
    if (experienceData === undefined) return;
    if (!experience) {
      router.replace('/experience');
      return;
    }
    const status = String(experience.status ?? '').toUpperCase();
    if (status === 'DONE') return; // 이 페이지에 진입 허용
    if (status === 'ON_CHAT') {
      router.replace(`/experience/settings/${id}/chat`);
      return;
    }
    if (status === 'GENERATE' || status === 'GENERATE_FAILED') {
      router.replace(`/experience/settings/${id}/createloading`);
      return;
    }
    router.replace('/experience');
  }, [id, experienceId, experienceData, experience, router]);

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

  useEffect(() => {
    if (!deleteBlockModalOpen) return;
    const timer = setTimeout(() => {
      setDeleteBlockModalOpen(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [deleteBlockModalOpen]);

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
      <div className='mx-auto w-[87rem] min-w-[87rem] pt-[4rem]'>
        <div className='flex flex-col gap-[1.125rem]'>
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
              {viewMode === 'visual' ? (
                <ExperienceExportPptxDropdown
                  data={{
                    description: detailInfo,
                    responsibilities: roleContent,
                    problemSolving: problemContent,
                    learnings: learnContent,
                  }}
                  title={displayTitle}
                  className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent'
                />
              ) : (
                <ExperienceExportDropdown
                  data={{
                    description: detailInfo,
                    responsibilities: roleContent,
                    problemSolving: problemContent,
                    learnings: learnContent,
                  }}
                  title={displayTitle}
                  className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent'
                />
              )}

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

        {/* 텍스트 OR 시각화 전환 토글 */}
        <div className='flex py-[2.5rem]'>
          <PortfolioVisualizationSwitchToggle
            value={viewMode}
            onValueChange={(newMode) => {
              if (newMode === 'visual' && viewMode !== 'visual') {
                setExportObtModalOpen(false);
                setVisualizationModalOpen(true);
              } else {
                setViewMode(newMode);
              }
            }}
          />
        </div>

        {viewMode === 'text' ? (
          <TextPortfolioCard
            portfolio={portfolio}
            handleContributionSave={handleContributionSave}
            hopeJobTag={hopeJobTag}
            exportContentRef={exportContentRef}
            isLoading={isLoading}
            portfolioId={portfolioId}
            detailInfo={detailInfo}
            roleContent={roleContent}
            problemContent={problemContent}
            learnContent={learnContent}
          />
        ) : (
          <VisualPortfolioContent />
        )}

        {/* 버튼 영역 */}
        <div className='flex items-center justify-center gap-[2.75rem] pt-[5rem] pb-[6.25rem]'>
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

      <VisualizationCreateModal
        open={isVisualizationModalOpen}
        onOpenChange={setVisualizationModalOpen}
        onConfirm={() => setViewMode('visual')}
      />

      <OBTRedirectModal
        open={exportObtModalOpen}
        onOpenChange={setExportObtModalOpen}
      />
    </>
  );
}
