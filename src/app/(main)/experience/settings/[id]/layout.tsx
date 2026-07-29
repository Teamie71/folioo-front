'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();
  const idParam = typeof params.id === 'string' ? params.id : '';
  const experienceId = idParam ? Number(idParam) : NaN;

  const {
    data,
    isLoading: isListLoading,
    isFetched: isListFetched,
  } = useExperienceControllerGetExperiences();

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
  const status = singleData?.result?.status;
  const isDone = status != null && String(status).toUpperCase() === 'DONE';
  const isChatPath = pathname?.endsWith('/chat') ?? false;

  /* DONE인 경험의 chat URL 진입 시 portfolio로 리다이렉트 */
  useEffect(() => {
    if (!idParam || !isChatPath || !singleSucceeded || !isDone) return;
    router.replace(`/experience/settings/${idParam}/portfolio`);
  }, [idParam, isChatPath, singleSucceeded, isDone, router]);

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
    isListFetched &&
    !isListLoading &&
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

  /* DONE인 경험의 chat 진입 시 리다이렉트 중에는 chat 미노출 */
  if (isChatPath && isDone) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'></div>
    );
  }

  return <>{children}</>;
}
