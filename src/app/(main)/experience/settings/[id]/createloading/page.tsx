'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { setExperienceReturnPath } from '@/features/experience/utils/experienceReturnPath';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { InlineEdit } from '@/components/InlineEdit';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useExperienceControllerGetExperience } from '@/api/endpoints/experience/experience';
import { ExperienceStateResDTOStatus } from '@/api/models';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CommonButton } from '@/components/CommonButton';
import Link from 'next/link';

export default function ExperienceSettingsChatLoadingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const experienceId = Number(id);
  const portfolioIdParam = searchParams.get('portfolioId');
  const portfolioId = portfolioIdParam ? Number(portfolioIdParam) : null;
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

  const { data: experienceData } = useExperienceControllerGetExperience(
    experienceId,
    {
      query: {
        enabled: !!id && !Number.isNaN(experienceId),
        refetchInterval: 3000,
        refetchIntervalInBackground: true,
      },
    },
  );

  const status = experienceData?.result?.status;
  const isDone =
    status != null &&
    String(status).toUpperCase() === ExperienceStateResDTOStatus.DONE;

  useEffect(() => {
    if (isDone && id) {
      const q =
        portfolioId != null && !Number.isNaN(portfolioId)
          ? `?portfolioId=${portfolioId}`
          : '';
      router.replace(`/experience/settings/${id}/portfolio${q}`);
    }
  }, [isDone, id, portfolioId, router]);

  useEffect(() => {
    setExperienceTitle(storeTitle);
  }, [id, storeTitle]);

  useEffect(() => {
    if (id) setExperienceReturnPath(id, 'createloading');
  }, [id]);

  const handleDelete = () => {
    removeExperience(id);
    router.push('/experience');
  };

  return (
    <div className='flex h-screen flex-col overflow-hidden'>
      <div className='mx-auto flex min-h-0 w-[66rem] min-w-[66rem] flex-1 flex-col gap-[1.5rem] overflow-hidden px-[1rem] pt-[2.5rem]'>
        {/* 헤더 */}
        <div className='flex w-full shrink-0 items-center justify-between'>
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

          <span className='text-center text-[1.125rem] leading-[130%] font-bold'>
            AI 컨설턴트가 텍스트형 포트폴리오를 생성 중이에요.
            <br />
            페이지를 떠나도 작업은 계속돼요.
          </span>

          <Link href='/experience'>
            <CommonButton variantType='Outline' px='2.25rem' py='0.5rem'>
              나가기
            </CommonButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
