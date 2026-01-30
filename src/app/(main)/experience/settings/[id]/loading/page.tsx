'use client';

import { useParams, useRouter } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { useExperienceStore } from '@/store/useExperienceStore';

export default function ExperienceSettingsChatLoadingPage() {
  const params = useParams();
  const router = useRouter();
  const removeExperience = useExperienceStore(
    (state) => state.removeExperience,
  );
  const experienceCards = useExperienceStore((state) => state.experienceCards);

  const id = typeof params.id === 'string' ? params.id : '';
  const title =
    experienceCards.find((card) => card.id === id)?.title ?? '새로운 경험 정리';

  const handleDelete = () => {
    removeExperience(id);
    router.push('/experience');
  };

  return (
    <div className='flex h-screen flex-col overflow-hidden'>
      <div className='mx-auto flex min-h-0 w-[66rem] min-w-[66rem] flex-1 flex-col gap-[1.5rem] overflow-hidden px-[1rem] pt-[2.5rem]'>
        {/* 헤더 - chat 페이지와 동일, 제목은 수정 불가 */}
        <div className='flex w-full shrink-0 items-center justify-between'>
          <div className='flex items-center gap-[0.5rem]'>
            <BackButton href='/experience' />
            <span className='rounded-[0.375rem] border border-transparent py-[0.5rem] pr-0 pl-[0.75rem] text-[1.25rem] font-bold'>
              {title}
            </span>
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
      </div>
    </div>
  );
}
