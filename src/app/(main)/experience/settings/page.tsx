'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonModal } from '@/components/Common-modal';
import { StepProgressBar } from '@/components/Step-progress-bar';
import { SingleButtonGroup } from '@/components/SingleButtonGroup';

export default function ExperienceSettingsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <button
            onClick={() => setIsModalOpen(true)}
            className='cursor-pointer border-none bg-transparent'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
            >
              <path
                d='M18 23L9 14L18 5.00001'
                stroke='black'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
          <div className='flex items-center gap-[0.75rem]'>
            <span className='text-[1.25rem] font-bold'>새로운 경험 정리</span>
            {/* TODO: 클릭 시 경험 명 수정 */}
            <button className='cursor-pointer border-none bg-transparent'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M18.9993 19.0001C19.2542 19.0003 19.4993 19.0979 19.6847 19.2729C19.87 19.4479 19.9815 19.687 19.9965 19.9415C20.0114 20.1959 19.9286 20.4464 19.765 20.6419C19.6015 20.8373 19.3694 20.963 19.1163 20.9931L18.9993 21.0001H11.9993C11.7444 20.9998 11.4993 20.9022 11.3139 20.7272C11.1286 20.5522 11.0171 20.3131 11.0021 20.0587C10.9872 19.8042 11.07 19.5537 11.2336 19.3582C11.3972 19.1628 11.6292 19.0372 11.8823 19.0071L11.9993 19.0001H18.9993ZM16.0953 4.36806C16.5533 3.91036 17.171 3.64819 17.8183 3.63674C18.4657 3.62529 19.0923 3.86545 19.5662 4.30667C20.04 4.74789 20.3242 5.35574 20.359 6.00229C20.3937 6.64883 20.1762 7.28363 19.7523 7.77306L19.6303 7.90306L8.73431 18.8001C8.63908 18.8954 8.53145 18.9775 8.41431 19.0441L8.29431 19.1041L4.49031 20.8341C3.68231 21.2011 2.85231 20.4171 3.12531 19.6091L3.16531 19.5091L4.89531 15.7041C4.95076 15.5817 5.0224 15.4673 5.10831 15.3641L5.19831 15.2641L16.0953 4.36806Z'
                  fill='#74777D'
                />
              </svg>
            </button>
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
              <span>희망직무</span>
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

        {/* 파일 업로더 */}
        <div className='flex flex-col gap-[1rem]'>
          <div>
            <div className='flex items-center gap-[1rem]'>
              <span className='text-[1.125rem] font-bold'>
                관련 파일 업로드
              </span>
              {/* TODO: 파일 사이즈 측정값 입력 */}
              <span className='text-[0.875rem] text-[#1A1A1A]'>
                0 / 10240KB
              </span>
            </div>
            <span className='text-[0.875rem] text-[#74777D]'>
              작업한 파일, 발표 대본, 프로젝트 결과물 등 참고할 자료를
              업로드해주세요.
            </span>
          </div>
          {/* TODO: 파일 업로드 기능 */}
          <button className='w-[21.125rem] cursor-pointer rounded-[1rem] border border-[#74777D] bg-[#ffffff] px-[1.5rem] py-[2.25rem]'>
            <div className='flex flex-col items-center gap-[0.875rem]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='60'
                height='60'
                viewBox='0 0 60 60'
                fill='none'
              >
                <path
                  d='M45 42.5C48.3152 42.5 51.4946 41.183 53.8388 38.8388C56.183 36.4946 57.5 33.3152 57.5 30C57.5 26.6848 56.183 23.5053 53.8388 21.1611C51.4946 18.8169 48.3152 17.5 45 17.5C44.337 13.1902 41.989 9.32034 38.4727 6.74172C34.9564 4.16309 30.5598 3.08693 26.25 3.74997C21.9402 4.41301 18.0704 6.76094 15.4917 10.2772C12.9131 13.7936 11.837 18.1902 12.5 22.5C9.84784 22.5 7.3043 23.5535 5.42893 25.4289C3.55357 27.3043 2.5 29.8478 2.5 32.5C2.5 35.1521 3.55357 37.6957 5.42893 39.571C7.3043 41.4464 9.84784 42.5 12.5 42.5H15M22.5 35L30 27.5M30 27.5L37.5 35M30 27.5V57.5'
                  stroke='#74777D'
                  strokeWidth='4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span className='font-[regular] text-[0.875rem] leading-[1.375rem] text-[#74777D]'>
                클릭하여 파일을 업로드하세요.
                <br />
                (10MB 이하의 PDF, PNG, JPG 파일만 업로드 가능)
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 시작하기 버튼 */}
      <button
        onClick={handleStartChat}
        className='fixed bottom-[7.5rem] left-1/2 mx-auto flex -translate-x-1/2 cursor-pointer gap-[0.75rem] rounded-[6.25rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'
      >
        {/* TODO: 아이콘 추가 */}
        <div className='h-[1.5rem] w-[1.5rem] bg-[#FFFFFF]' />
        <span className='text-[1rem] font-bold text-[#FFFFFF]'>
          AI와 대화 시작하기
        </span>
      </button>

      {/* 모달 */}
      <CommonModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title='이 경험 정리를 정말 그만두시겠습니까?'
        description='지금 돌아가면, 작성하신 내용이 저장되지 않아요.'
        secondaryBtnText='그만두기'
        primaryBtnVariant='outline'
        cancelBtnText='취소'
        onSecondaryClick={() => {
          router.back();
        }}
      />
    </div>
  );
}
