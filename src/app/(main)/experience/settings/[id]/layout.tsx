'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useExperienceControllerGetExperiences } from '@/api/endpoints/experience/experience';

/* 타인의 경험 정리 URL로 직접 진입하는 것을 방지: 내 경험 목록에 해당 id가 없으면 /experience로 리다이렉트 */
export default function ExperienceSettingsIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const idParam = typeof params.id === 'string' ? params.id : '';
  const experienceId = idParam ? Number(idParam) : NaN;

  const { data, isLoading, isFetched } =
    useExperienceControllerGetExperiences();

  useEffect(() => {
    if (!isFetched || isLoading) return;

    const myIds = (data?.result ?? []).map((item) => item.id);
    const isInvalidId = !Number.isFinite(experienceId);
    const isNotMine = isInvalidId || !myIds.includes(experienceId);

    if (isNotMine) {
      router.replace('/experience');
    }
  }, [data?.result, experienceId, isFetched, isLoading, router]);

  const myIds = (data?.result ?? []).map((item) => item.id);
  const isInvalidId = !Number.isFinite(experienceId);
  const isAllowed =
    !isInvalidId && isFetched && !isLoading && myIds.includes(experienceId);

  if (!isFetched || isLoading) {
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
