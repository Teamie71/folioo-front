'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  setExperienceReturnPath,
  setCreateloadingEntered,
} from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import {
  getExperienceControllerGetExperienceQueryKey,
  getExperienceControllerGetExperiencesQueryKey,
  useExperienceControllerDeleteExperience,
  useExperienceControllerGetExperience,
  useExperienceControllerUpdateExperience,
} from '@/api/endpoints/experience/experience';
import { useInterviewControllerGeneratePortfolio } from '@/api/endpoints/interview/interview';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CommonButton } from '@/components/CommonButton';
import Link from 'next/link';

const EXPERIENCE_STATUS_ON_CHAT = 'ON_CHAT';

export default function ExperienceSettingsChatLoadingPage() {
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
  const { mutateAsync: updateExperience } =
    useExperienceControllerUpdateExperience();
  const storeTitle = useExperienceStore(
    (state) =>
      state.experienceCards.find((c) => c.id === id)?.title ??
      '새로운 경험 정리',
  );

  const queryClient = useQueryClient();
  const { data: experienceData } = useExperienceControllerGetExperience(
    experienceId,
    {
      query: {
        enabled: Number.isFinite(experienceId),
        refetchInterval: 2000,
        refetchIntervalInBackground: true,
      },
    },
  );
  const experienceName = experienceData?.result?.name;
  const experience = experienceData?.result;
  const titleReady = experience != null;
  const displayTitle = titleReady
    ? (experienceName ?? storeTitle ?? '새로운 경험 정리')
    : '';

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { mutateAsync: generatePortfolio, isPending: isGeneratePending } =
    useInterviewControllerGeneratePortfolio();

  const isOnChatError =
    titleReady &&
    String(experience?.status ?? '').toUpperCase() ===
      EXPERIENCE_STATUS_ON_CHAT;

  const handleRetryGenerate = () => {
    if (!Number.isFinite(experienceId)) return;
    generatePortfolio({ experienceId })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: getExperienceControllerGetExperienceQueryKey(experienceId),
        });
      })
      .catch(() => {});
  };

  /* done 상태가 되면 portfolio 페이지로 리다이렉트 */
  useEffect(() => {
    if (!id || !experience) return;
    if (String(experience.status ?? '').toUpperCase() !== 'DONE') return;
    router.replace(`/experience/settings/${id}/portfolio`);
  }, [id, experience, router]);

  useEffect(() => {
    if (titleReady) document.title = `${displayTitle} - Folioo`;
  }, [titleReady, displayTitle]);

  useEffect(() => {
    if (!id) return;
    setExperienceReturnPath(id, 'createloading');
    setCreateloadingEntered(id);
  }, [id]);

  const { mutateAsync: deleteExperience } =
    useExperienceControllerDeleteExperience();

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

  return (
    <div className='flex h-screen flex-col overflow-hidden'>
      <div className='mx-auto flex min-h-0 w-[66rem] min-w-[66rem] flex-1 flex-col gap-[1.5rem] overflow-hidden px-[1rem] pt-[2.5rem]'>
        {/* 헤더 */}
        <div className='flex w-full shrink-0 items-center justify-between'>
          <div className='flex items-center gap-[0.5rem]'>
            <BackButton href='/experience' />
            {titleReady && (
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
            )}
          </div>

          <DeleteModalButton
            title='이 경험 정리를 정말 삭제하시겠습니까?'
            onDelete={handleDelete}
          />
        </div>

        {/* 프로그레스 바 */}
        <div className='shrink-0'>
          <StepProgressBar
            steps={['설정', 'AI 대화', '포트폴리오']}
            currentStep={3}
          />
        </div>

        <div className='flex flex-col items-center gap-[2.75rem]'>
          {isOnChatError ? (
            <>
              <div className='mt-[8.75rem] flex flex-col items-center gap-[2.75rem]'>
                <span className='mt-4 text-center text-[1.125rem] leading-[130%] font-bold'>
                  앗, 텍스트형 포트폴리오 생성 중 오류가 발생했어요.
                  <br />
                  아래 버튼을 눌러 다시 시도해주세요.
                </span>
                <CommonButton
                  variantType='Outline'
                  px='2.25rem'
                  py='0.5rem'
                  style={{ width: '10rem', height: '2.5rem' }}
                  onClick={handleRetryGenerate}
                  disabled={isGeneratePending}
                >
                  {isGeneratePending ? '다시 시도하기' : '다시 시도하기'}
                </CommonButton>
              </div>
            </>
          ) : (
            <>
              {/* 로딩 스피너 */}
              <div className='mt-[8.75rem] flex items-center justify-center'>
                <motion.div
                  animate={{ rotate: 720 }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeOut',
                  }}
                >
                  <Image
                    src='/LoadingSpinnerIcon.svg'
                    alt='loading'
                    width={64}
                    height={64}
                  />
                </motion.div>
              </div>

              <span className='mt-4 text-center text-[1.125rem] leading-[130%] font-bold'>
                AI 컨설턴트가 텍스트형 포트폴리오를 생성 중이에요.
                <br />
                페이지를 떠나도 작업은 계속돼요.
              </span>

              <Link href='/experience'>
                <CommonButton variantType='Outline' px='2.25rem' py='0.5rem'>
                  나가기
                </CommonButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
