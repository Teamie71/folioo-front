'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonModal } from '@/components/CommonModal';
import { StepProgressBar } from '@/components/StepProgressBar';
import { SingleButtonGroup } from '@/components/SingleButtonGroup';
import { BackButton } from '@/components/BackButton';

export default function ExperienceSettingsPage() {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isStartChatModalOpen, setIsStartChatModalOpen] = useState(false);

  const handleStartChat = () => {
    // TODO: 백엔드 연동 시 API 호출로 교체
    // const response = await fetch('/api/chat', { method: 'POST' });
    // const { id } = await response.json();
    const id = crypto.randomUUID();
    router.push(`/experience/settings/${id}/chat`);
  };

  return (
    <div className='mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]'>
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 헤더 */}
        <div className='flex items-center gap-[1.25rem]'>
          <BackButton onClick={() => setIsCancelModalOpen(true)} />
          <div className='flex items-center gap-[0.75rem]'>
            <span className='text-[1.25rem] font-bold'>새로운 경험 정리</span>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className='pb-[4.5rem]'>
          <StepProgressBar
            steps={['설정', 'AI 대화', '포트폴리오']}
            currentStep={1}
          />
        </div>
      </div>

      <div className='flex flex-col gap-[3.75rem]'>
        {/* 경험명 입력 */}
        <div className='flex flex-col gap-[1rem]'>
          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
            <span>경험명</span>
            <span className='text-[#DC0000]'>*</span>
          </div>
          <input
            className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-[#74777D]'
            placeholder='경험명을 입력해주세요.'
          />
        </div>

        {/* 희망 직무 선택 */}
        <div className='flex flex-col gap-[1rem]'>
          <div className='flex flex-col text-[1.125rem]'>
            <div className='flex items-center gap-[0.25rem] font-bold'>
              <span>희망 직무</span>
              <span className='text-[#DC0000]'>*</span>
            </div>
            <span className='font-regular text-[0.825rem] text-[#74777D]'>
              희망 직무에 맞추어 경험을 체계적으로 정리하세요.
            </span>
          </div>
          {/* 직무 목록 */}
          <SingleButtonGroup
            options={[
              { label: '미정' },
              { label: '기획' },
              { label: '광고/마케팅' },
              { label: '디자인' },
              { label: 'IT 개발' },
              { label: '영상/미디어' },
              { label: '데이터' },
            ]}
          />
        </div>
      </div>

      {/* 시작하기 버튼 */}
      <button
        onClick={() => setIsStartChatModalOpen(true)}
        className='fixed bottom-[7.5rem] left-1/2 mx-auto flex -translate-x-1/2 cursor-pointer gap-[0.75rem] rounded-[6.25rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'
      >
        {/* TODO: 아이콘 추가 */}
        <div className='h-[1.5rem] w-[1.5rem] bg-[#FFFFFF]' />
        <span className='text-[1rem] font-bold text-[#FFFFFF]'>
          AI와 대화 시작하기
        </span>
      </button>

      {/* 취소 모달 */}
      <CommonModal
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        title='이 경험 정리를 정말 그만두시겠습니까?'
        description='지금 돌아가면, 작성하신 내용이 저장되지 않아요.'
        secondaryBtnText='그만두기'
        primaryBtnVariant='outline'
        cancelBtnText='취소'
        onSecondaryClick={() => {
          router.back();
        }}
      />

      <CommonModal
        open={isStartChatModalOpen}
        onOpenChange={setIsStartChatModalOpen}
        title={
          <>
            30 크레딧을 사용하여
            <br />
            경험 정리를 진행하시겠습니까?
          </>
        }
        cancelBtnText='취소'
        primaryBtnText='진행'
        onPrimaryClick={handleStartChat}
      />
    </div>
  );
}
