'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CorrectionSettingsPage() {
  const router = useRouter();
  const [jdMode, setJdMode] = useState<'text' | 'image'>('text');

  const handleStartChat = () => {
    // TODO: 백엔드 연동 시 API 호출로 교체
    // const response = await fetch('/api/chat', { method: 'POST' });
    // const { id } = await response.json();
    const id = crypto.randomUUID();
    router.push(`/correction/settings/${id}/chat`);
  };

  return (
    <div className='mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]'>
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 헤더 */}
        <div className='flex items-center gap-[1.25rem]'>
          {/* TODO: 클릭 시 모달 */}
          <button className='cursor-pointer border-none bg-transparent'>
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
            <span className='text-[1.25rem] font-bold'>
              새로운 포트폴리오 첨삭
            </span>
            {/* TODO: 클릭 시 포트폴리오 첨삭 명 수정 */}
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
        <div className='flex flex-col gap-[0.75rem] pb-[72px]'>
          {/* TODO: 프로그레스 바 애니메이션 */}
          <div className='h-[0.25rem] w-full rounded-[1.5rem] bg-[#E9EAEC]' />

          <div className='grid grid-cols-4 items-center'>
            {/* 지원 정보 */}
            <div className='flex items-center gap-[0.5rem]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <circle cx='10' cy='10' r='10' fill='#5060C5' />
                <text
                  x='10'
                  y='14.5'
                  textAnchor='middle'
                  fontSize='14'
                  fontWeight='bold'
                  fill='white'
                  fontFamily='Arial, sans-serif'
                >
                  1
                </text>
              </svg>
              <span className='text-[1rem] font-bold text-[#5060C5]'>
                지원 정보
              </span>
            </div>

            {/* 포트폴리오 선택 */}
            <div className='flex items-center gap-[0.5rem]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <circle cx='10' cy='10' r='10' fill='#CDD0D5' />
                <text
                  x='10'
                  y='14.5'
                  textAnchor='middle'
                  fontSize='14'
                  fontWeight='bold'
                  fill='white'
                  fontFamily='Arial, sans-serif'
                >
                  2
                </text>
              </svg>
              <span className='font-regular text-[1rem] text-[#9EA4A9]'>
                포트폴리오 선택
              </span>
            </div>

            {/* 기업 분석 */}
            <div className='flex items-center gap-[0.5rem]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <circle cx='10' cy='10' r='10' fill='#CDD0D5' />
                <text
                  x='10'
                  y='14.5'
                  textAnchor='middle'
                  fontSize='14'
                  fontWeight='bold'
                  fill='white'
                  fontFamily='Arial, sans-serif'
                >
                  3
                </text>
              </svg>
              <span className='font-regular text-[1rem] text-[#9EA4A9]'>
                기업 분석
              </span>
            </div>

            {/* 첨삭 결과 */}
            <div className='flex items-center gap-[0.5rem]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <circle cx='10' cy='10' r='10' fill='#CDD0D5' />
                <text
                  x='10'
                  y='14.5'
                  textAnchor='middle'
                  fontSize='14'
                  fontWeight='bold'
                  fill='white'
                  fontFamily='Arial, sans-serif'
                >
                  4
                </text>
              </svg>
              <span className='font-regular text-[1rem] text-[#9EA4A9]'>
                첨삭 결과
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-[3.75rem]'>
        {/* 지원 기업명 및 지원 직무명 입력 */}
        <div className='grid grid-cols-2 gap-[1.5rem]'>
          {/* 지원 기업명 입력 */}
          <div className='flex flex-col gap-[1rem]'>
            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
              <span>지원 기업명</span>
              <span className='text-[#DC0000]'>*</span>
            </div>
            <input
              className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-[#74777D]'
              placeholder='기업명을 입력해주세요.'
            />
          </div>

          {/* 지원 직무명 입력 */}
          <div className='flex flex-col gap-[1rem]'>
            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
              <span>지원 직무명</span>
              <span className='text-[#DC0000]'>*</span>
            </div>
            <input
              className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-[#74777D]'
              placeholder='직무명을 입력해주세요.'
            />
          </div>
        </div>

        {/* Job Description */}
        <div className='flex flex-col gap-[1rem]'>
          <div>
            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
              <span>Job Description</span>
              <span className='text-[#DC0000]'>*</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-regular text-[0.875rem] text-[#74777D]'>
                JD는 채용공고에 명시된 직무 설명서로, 주로 담당할 업무,
                자격요건, 우대사항 등이 포함돼요.
              </span>
              <div className='flex items-center'>
                <button
                  onClick={() => setJdMode('text')}
                  className={`h-[29px] w-[77px] cursor-pointer rounded-[0.25rem] text-[0.875rem] font-medium ${
                    jdMode === 'text'
                      ? 'border-[#5060C5] bg-[#5060C5] text-[#FFFFFF]'
                      : 'border-[#CDD0D5] bg-[#E9EAEC] text-[#74777D]'
                  }`}
                >
                  텍스트
                </button>
                <button
                  onClick={() => setJdMode('image')}
                  className={`h-[29px] w-[77px] cursor-pointer rounded-[0.25rem] text-[0.875rem] font-medium ${
                    jdMode === 'image'
                      ? 'border-[#5060C5] bg-[#5060C5] text-[#FFFFFF]'
                      : 'border-[#CDD0D5] bg-[#E9EAEC] text-[#74777D]'
                  }`}
                >
                  이미지
                </button>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-[0.75rem]'>
            {jdMode === 'text' ? (
              <textarea
                className='min-h-[23.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-[#74777D]'
                placeholder='채용공고의 JD를 복사 후 붙여넣기 해주세요.'
              />
            ) : (
              <div className='relative rounded-[1.25rem] bg-[#F6F8FA] p-[1.75rem]'>
                <div className='grid h-full grid-cols-2 gap-[4rem]'>
                  {/* 왼쪽: 파일 업로드 */}
                  <div className='flex flex-col items-center justify-center gap-[1rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FFFFFF] p-[2.5rem]'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='60'
                      height='60'
                      viewBox='0 0 60 60'
                      fill='none'
                    >
                      <path
                        d='M45 42.5C48.3152 42.5 51.4946 41.183 53.8388 38.8388C56.183 36.4946 57.5 33.3152 57.5 30C57.5 26.6848 56.183 23.5053 53.8388 21.1611C51.4946 18.8169 48.3152 17.5 45 17.5C44.337 13.1902 41.989 9.32034 38.4727 6.74172C34.9564 4.16309 30.5598 3.08693 26.25 3.74997C21.9402 4.41301 18.0704 6.76094 15.4917 10.2772C12.9131 13.7936 11.837 18.1902 12.5 22.5C9.84784 22.5 7.3043 23.5535 5.42893 25.4289C3.55357 27.3043 2.5 29.8478 2.5 32.5C2.5 35.1521 3.55357 37.6957 5.42893 39.571C7.3043 41.4464 9.84784 42.5 12.5 42.5H15M22.5 35L30 27.5M30 27.5L37.5 35M30 27.5V57.5'
                        stroke='#9EA4A9'
                        strokeWidth='4'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <div>
                      <div className='flex flex-col items-center text-center'>
                        <span className='text-[0.875rem] text-[#1A1A1A]'>
                          클릭하여 JD 파일을 업로드 하세요.
                        </span>
                        <span className='text-[0.75rem] text-[#74777D]'>
                          (JPG, PNG 파일만 업로드 가능)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 이미지 업로드 */}
                  <div className='flex flex-col items-center justify-center gap-[1rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FFFFFF]'>
                    <svg
                      width='60'
                      height='60'
                      viewBox='0 0 60 60'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M3.21484 10.2338V7.5C3.21484 6.50544 3.60993 5.55161 4.31319 4.84835C5.01645 4.14509 5.97028 3.75 6.96484 3.75H14.4648V7.5H6.96484V52.5H21.9648V56.25H6.96484C5.97028 56.25 5.01645 55.8549 4.31319 55.1516C3.60993 54.4484 3.21484 53.4946 3.21484 52.5V10.2338ZM48.2148 18.75V7.5C48.2148 6.50544 47.8198 5.55161 47.1165 4.84835C46.4132 4.14509 45.4594 3.75 44.4648 3.75H36.9648V7.5H44.4648V18.75H48.2148ZM44.4648 22.5H51.9648V56.25H25.7148V22.5H44.4648ZM44.4648 18.75H25.7148C24.7203 18.75 23.7665 19.1451 23.0632 19.8484C22.3599 20.5516 21.9648 21.5054 21.9648 22.5V56.25C21.9648 57.2446 22.3599 58.1984 23.0632 58.9016C23.7665 59.6049 24.7203 60 25.7148 60H51.9648C52.9594 60 53.9132 59.6049 54.6165 58.9016C55.3198 58.1984 55.7148 57.2446 55.7148 56.25V22.5C55.7148 21.5054 55.3198 20.5516 54.6165 19.8484C53.9132 19.1451 52.9594 18.75 51.9648 18.75H44.4648Z'
                        fill='#9EA4A9'
                      />
                      <path
                        d='M29.4648 37.5H48.2148V33.75H29.4648V37.5ZM29.4648 30H48.2148V26.25H29.4648V30ZM29.4648 45H48.2148V41.25H29.4648V45ZM29.4648 52.5H48.2148V48.75H29.4648V52.5ZM36.9648 7.5V3.75C36.9648 2.75544 36.5698 1.80161 35.8665 1.09835C35.1632 0.395088 34.2094 0 33.2148 0L18.2148 0C17.2203 0 16.2665 0.395088 15.5632 1.09835C14.8599 1.80161 14.4648 2.75544 14.4648 3.75V7.5H18.2148V3.75H33.2148V7.5H36.9648ZM14.4648 11.25H36.9648V7.5H14.4648V11.25Z'
                        fill='#9EA4A9'
                      />
                    </svg>

                    <span className='text-center text-[0.875rem] text-[#1A1A1A]'>
                      클릭하여 복사한 JD 이미지를 업로드 하세요.
                    </span>
                  </div>
                </div>

                {/* 중앙 구분선 */}
                <div className='absolute top-0 left-1/2 flex h-full items-center'>
                  <div className='h-[78%] w-[1px] bg-[#9EA4A9]' />
                  <div className='absolute top-1/2 left-1/2 flex h-[2.75rem] w-[3.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[#F6F8FA] text-center text-[0.875rem] text-[#1A1A1A]'>
                    또는
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 첨삭 의뢰하기 버튼 */}
        <div className='flex justify-center pb-[7rem]'>
          <button
            onClick={handleStartChat}
            className='flex h-[48px] w-[207px] cursor-pointer items-center justify-center gap-[0.75rem] rounded-[3.75rem] border-none bg-[#5060C5]'
          >
            {/* TODO: 아이콘 추가 */}
            <div className='h-[1.5rem] w-[1.5rem] bg-[#FFFFFF]' />
            <span className='text-[1rem] font-bold text-[#FFFFFF]'>
              첨삭 의뢰하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
