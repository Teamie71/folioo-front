'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useExperienceControllerGetExperience,
  useExperienceControllerGetExperiences,
} from '@/api/endpoints/experience/experience';

/* 타인의 경험 정리 URL로 직접 진입하는 것을 방지. 목록에 없어도 GET /experiences/:id 성공 시 소유로 인정(방금 생성한 경험 포함). */
export default function ExperienceSettingsIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const idParam = typeof params.id === 'string' ? params.id : '';
  const experienceId = idParam ? Number(idParam) : NaN;

  const { data, isLoading: isListLoading, isFetched: isListFetched } =
    useExperienceControllerGetExperiences();

  const {
    data: singleData,
    isFetched: isSingleFetched,
    isLoading: isSingleLoading,
  } = useExperienceControllerGetExperience(experienceId, {
    query: { enabled: Number.isFinite(experienceId) },
  });

  const myIds = (data?.result ?? []).map((item) => item.id);
  const listIncludesId = myIds.includes(experienceId);
  const singleSucceeded = singleData?.result != null;

  useEffect(() => {
    if (!Number.isFinite(experienceId)) {
      router.replace('/experience');
      return;
    }
    if (!isListFetched || isListLoading) return;
    if (listIncludesId) return;
    if (!isSingleFetched || isSingleLoading) return;
    if (singleSucceeded) return;
    router.replace('/experience');
  }, [
    experienceId,
    isListFetched,
    isListLoading,
    listIncludesId,
    isSingleFetched,
    isSingleLoading,
    singleSucceeded,
    router,
  ]);

  const isInvalidId = !Number.isFinite(experienceId);
  const isAllowed =
    !isInvalidId &&
    (listIncludesId || singleSucceeded) &&
    (isListFetched && !isListLoading) &&
    (listIncludesId || (isSingleFetched && !isSingleLoading));

  const showSpinner =
    !isListFetched ||
    isListLoading ||
    (!listIncludesId && (!isSingleFetched || isSingleLoading));

  if (showSpinner) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='h-[2rem] w-[2rem] animate-spin rounded-full border-2 border-[#5060C5] border-t-transparent' />
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
