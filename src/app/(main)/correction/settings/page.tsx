'use client';

import { useRouter } from 'next/navigation';

export default function CorrectionSettingsPage() {
  const router = useRouter();

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
                <button className='h-[29px] w-[77px] rounded-[0.25rem] border border-[#5060C5] bg-[#5060C5] text-[0.875rem] font-medium text-[#FFFFFF]'>
                  텍스트
                </button>
                <button className='h-[29px] w-[77px] rounded-[0.25rem] bg-[#E9EAEC] text-[0.875rem] font-medium text-[#74777D]'>
                  이미지
                </button>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-[0.75rem]'>
            <textarea
              className='min-h-[23.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-[#74777D]'
              placeholder='채용공고의 JD를 복사 후 붙여넣기 해주세요.'
            />
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
