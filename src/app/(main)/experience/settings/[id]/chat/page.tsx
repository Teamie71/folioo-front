'use client';

import { useParams, useRouter } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';
import { DeleteModalButton } from '@/components/DeleteModalButton';
import { useExperienceStore } from '@/store/useExperienceStore';

export default function ExperienceSettingsChatPage() {
  const params = useParams();
  const router = useRouter();
  const removeExperience = useExperienceStore((state) => state.removeExperience);

  const id = typeof params.id === 'string' ? params.id : '';

  const handleDelete = () => {
    removeExperience(id);
    router.push('/experience');
  };

  return (
    <div className='mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]'>
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 헤더 */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-[1.25rem]'>
            <BackButton href='/experience' />
            <span className='text-[1.25rem] font-bold'>새로운 경험 정리</span>
          </div>

          <DeleteModalButton
            title='이 경험 정리를 정말 삭제하시겠습니까?'
            onDelete={handleDelete}
          />
        </div>

        {/* 프로그레스 바 */}
        <StepProgressBar
          steps={['설정', 'AI 대화', '포트폴리오']}
          currentStep={2}
        />

        {/* 채팅 영역
        TODO: 채팅 입력창, 채팅 메시지 영역 분리 + 채팅 메시지 영역 스크롤 기능 추가
        */}
        <div className='flex flex-col gap-[1.5rem]'>
          {/* 채팅 메시지 */}
          <div className='flex flex-col gap-[3.75rem]'>
            {/* AI */}
            <div className='flex gap-[1.5rem]'>
              <div className='h-[3rem] w-[3rem] bg-[#D9D9D9]' />
              <div className='font-regular rounded-tl-[0.25rem] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2.25rem] py-[1.75rem] text-[1rem] text-[#1A1A1A] shadow-[0px_4px_8px_0px_#00000033]'>
                내용
              </div>
            </div>

            {/* 사용자 */}
            <div className='font-regular rounded-tl-[2rem] rounded-tr-[0.25rem] rounded-br-[2rem] rounded-bl-[2rem] border border-none bg-[#F6F5FF] px-[2.25rem] py-[1.75rem] text-[1rem] text-[#1A1A1A] shadow-[0px_4px_8px_0px_#00000033]'>
              내용
            </div>
          </div>

          {/* 채팅 입력 창 */}
          <div className='fixed bottom-[4.5rem] left-1/2 flex w-[66rem] min-w-[66rem] -translate-x-1/2 items-center gap-[1.25rem]'>
            {/* 채팅 단계 아이콘 */}
            <div className='h-[2.5rem] w-[2.5rem] bg-[#D9D9D9]' />

            <div className='flex w-full items-center rounded-[2rem] bg-[#FDFDFD] px-[1.5rem] py-[1rem] shadow-[0px_1px_4px_0px_#0000001A] shadow-[inset_0px_2px_4px_0px_#00000040]'>
              {/* 입력 창 */}
              <input
                className='font-regular w-full border-none bg-transparent text-[1rem] outline-none'
                placeholder='답변을 입력하거나 @를 입력하여 인사이트 로그를 멘션하세요.'
              />
              {/* 전송 버튼 */}
              <button className='cursor-pointer border-none bg-transparent'>
                <div className='flex items-center justify-center'>
                  <svg
                    className='absolute'
                    xmlns='http://www.w3.org/2000/svg'
                    width='32'
                    height='32'
                    viewBox='0 0 32 32'
                    fill='none'
                  >
                    <circle cx='16' cy='16' r='16' fill='#5060C5' />
                  </svg>
                  <svg
                    className='absolute'
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M10 17.5L10 2.91663'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M15.8327 8.33333L9.99935 2.5L4.16602 8.33333'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
