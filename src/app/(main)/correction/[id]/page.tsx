'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'information' | 'portfolio' | 'analysis' | 'result';
type Status = 'DRAFT' | 'ANALYZING' | 'DONE';
type PortfolioType = 'text' | 'pdf';

export default function CorrectionSettingsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('information');
  const [status, setStatus] = useState<Status>('DRAFT');
  const [jdMode, setJdMode] = useState<'text' | 'image'>('text');
  const [selectedPortfolioType, setSelectedPortfolioType] =
    useState<PortfolioType | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<'A' | 'B' | 'C'>(
    'A',
  );
  const [selectedTab, setSelectedTab] = useState<
    '상세정보' | '담당업무' | '문제해결' | '배운 점'
  >('상세정보');
  const [isUnclassifiedOpen, setIsUnclassifiedOpen] = useState(false);
  const [selectedUnclassifiedTab, setSelectedUnclassifiedTab] = useState<
    '상세정보' | '담당업무' | '문제해결' | '배운 점'
  >('상세정보');
  const [resultTab, setResultTab] = useState<'지원 정보' | '활동 A' | '활동 B'>(
    '지원 정보',
  );
  const [detailInfoButton, setDetailInfoButton] = useState<
    '축소 또는 제외' | '구체화하여 강조'
  >('축소 또는 제외');
  const [responsibilityButton, setResponsibilityButton] = useState<
    '축소 또는 제외' | '구체화하여 강조'
  >('축소 또는 제외');
  const [problemSolvingButton, setProblemSolvingButton] = useState<
    '축소 또는 제외' | '구체화하여 강조'
  >('축소 또는 제외');
  const [lessonsButton, setLessonsButton] = useState<
    '축소 또는 제외' | '구체화하여 강조'
  >('축소 또는 제외');

  const handleNextStep = () => {
    if (step === 'information') {
      setStep('portfolio');
    } else if (step === 'portfolio') {
      setStep('analysis');
    } else if (step === 'analysis') {
      // TODO: 백엔드 연동 시 API 호출
      setStatus('ANALYZING');
      // 분석 완료 후
      setTimeout(() => {
        setStatus('DONE');
        setStep('result');
      }, 2000);
    }
  };

  const handleStartNewExperience = () => {
    router.push('/experience');
  };

  const handlePortfolioSelect = (type: PortfolioType) => {
    setSelectedPortfolioType(type);
  };

  return (
    <div className='mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]'>
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 헤더 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-[1.25rem]'>
            {/* TODO: 클릭 시 모달 */}
            <button
              onClick={() => router.push('/correction')}
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
          {/* 삭제 버튼 */}
          <button
            onClick={() => {
              // TODO: 삭제 확인 모달 및 API 호출
              router.push('/correction');
            }}
            className='flex cursor-pointer items-center gap-[0.25rem] border-none bg-transparent text-[#1A1A1A]'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6.375 22C5.75625 22 5.22675 21.7826 4.7865 21.3478C4.34625 20.913 4.12575 20.3896 4.125 19.7778V5.89583C4.125 5.58517 3.87316 5.33333 3.5625 5.33333C3.25184 5.33333 3 5.08149 3 4.77083V4.11111C3 3.55883 3.44772 3.11111 4 3.11111H8.06944C8.37627 3.11111 8.625 2.86238 8.625 2.55556C8.625 2.24873 8.87373 2 9.18056 2H14.8194C15.1263 2 15.375 2.24873 15.375 2.55556C15.375 2.86238 15.6237 3.11111 15.9306 3.11111H20C20.5523 3.11111 21 3.55883 21 4.11111V4.77083C21 5.08149 20.7482 5.33333 20.4375 5.33333C20.1268 5.33333 19.875 5.58517 19.875 5.89583V19.7778C19.875 20.3889 19.6549 20.9122 19.2146 21.3478C18.7744 21.7833 18.2445 22.0007 17.625 22H6.375ZM17.625 6.33333C17.625 5.78105 17.1773 5.33333 16.625 5.33333H7.375C6.82272 5.33333 6.375 5.78105 6.375 6.33333V18.7778C6.375 19.3301 6.82272 19.7778 7.375 19.7778H16.625C17.1773 19.7778 17.625 19.3301 17.625 18.7778V6.33333ZM8.625 16.5556C8.625 17.1078 9.07272 17.5556 9.625 17.5556H9.875C10.4273 17.5556 10.875 17.1078 10.875 16.5556V8.55556C10.875 8.00327 10.4273 7.55556 9.875 7.55556H9.625C9.07272 7.55556 8.625 8.00327 8.625 8.55556V16.5556ZM13.125 16.5556C13.125 17.1078 13.5727 17.5556 14.125 17.5556H14.375C14.9273 17.5556 15.375 17.1078 15.375 16.5556V8.55556C15.375 8.00327 14.9273 7.55556 14.375 7.55556H14.125C13.5727 7.55556 13.125 8.00327 13.125 8.55556V16.5556Z'
                fill='#74777D'
              />
            </svg>
            <span className='text-[0.875rem] font-medium'>삭제</span>
          </button>
        </div>

        {/* 프로그레스 바 */}
        <div className='flex flex-col gap-[0.75rem] pb-[72px]'>
          {/* TODO: 프로그레스 바 애니메이션 */}
          <div className='relative h-[0.25rem] w-full overflow-hidden rounded-[1.25rem] bg-[#E9EAEC]'>
            <div
              className='h-full rounded-[1.25rem] transition-all duration-300'
              style={{
                width:
                  step === 'result'
                    ? '0%'
                    : step === 'information'
                      ? '25%'
                      : step === 'portfolio'
                        ? '50%'
                        : step === 'analysis'
                          ? '75%'
                          : '100%',
                background: 'linear-gradient(to bottom, #93B3F4, #5060C5)',
              }}
            />
          </div>

          {step !== 'result' && (
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
                  <circle
                    cx='10'
                    cy='10'
                    r='10'
                    fill={
                      step === 'information' ||
                      step === 'portfolio' ||
                      step === 'analysis'
                        ? '#5060C5'
                        : '#CDD0D5'
                    }
                  />
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
                <span
                  className={`text-[1rem] ${
                    step === 'information' ||
                    step === 'portfolio' ||
                    step === 'analysis'
                      ? 'font-bold text-[#5060C5]'
                      : 'font-regular text-[#9EA4A9]'
                  }`}
                >
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
                  <circle
                    cx='10'
                    cy='10'
                    r='10'
                    fill={
                      step === 'portfolio' || step === 'analysis'
                        ? '#5060C5'
                        : '#CDD0D5'
                    }
                  />
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
                <span
                  className={`text-[1rem] ${
                    step === 'portfolio' || step === 'analysis'
                      ? 'font-bold text-[#5060C5]'
                      : 'font-regular text-[#9EA4A9]'
                  }`}
                >
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
                  <circle
                    cx='10'
                    cy='10'
                    r='10'
                    fill={step === 'analysis' ? '#5060C5' : '#CDD0D5'}
                  />
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
                <span
                  className={`text-[1rem] ${
                    step === 'analysis'
                      ? 'font-bold text-[#5060C5]'
                      : 'font-regular text-[#9EA4A9]'
                  }`}
                >
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
          )}
        </div>
      </div>

      <div className='flex flex-col gap-[3.75rem]'>
        {status === 'ANALYZING' ? (
          <div className='flex items-center justify-center py-[10rem]'>
            <span className='text-[1.25rem] font-bold'>분석 중...</span>
          </div>
        ) : step === 'information' ? (
          <>
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
                  <div className='min-h-[23.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.625rem] py-[1.25rem] text-[#74777D]'>
                    채용공고의 JD를 복사 후 붙여넣기 해주세요. 
                  </div>
                ) : (
                  <div className='flex gap-[1.5rem]'>
                    {/* 왼쪽: 파일 업로드 옵션들 (회색 배경 섹션) */}
                    <div className='flex flex-1 flex-col gap-[1rem] rounded-[1.25rem] bg-[#F6F8FA] p-[1.75rem]'>
                      {/* 첫 번째: JD 파일 업로드 */}
                      <div className='flex items-center gap-[3.625rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FFFFFF] px-[4.75rem] py-[2.25rem] shadow-sm'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='40'
                          height='40'
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
                        <div className='flex flex-col'>
                          <span className='text-[0.875rem] text-[#1A1A1A]'>
                            클릭하여 JD 파일을 업로드 하세요.
                          </span>
                          <span className='text-[0.75rem] text-[#74777D]'>
                            (JPG, PNG 파일만 업로드 가능)
                          </span>
                        </div>
                      </div>

                      {/* 구분선 */}
                      <div className='relative flex w-full items-center px-[1rem] py-[0.5rem]'>
                        <div className='h-[1px] w-full bg-[#CDD0D5]' />
                        <div className='absolute left-1/2 flex h-[2.75rem] w-[3.75rem] -translate-x-1/2 items-center justify-center bg-[#F6F8FA] text-center text-[0.875rem] text-[#1A1A1A]'>
                          또는
                        </div>
                      </div>

                      {/* 두 번째: 복사한 JD 이미지 업로드 */}
                      <div className='flex items-center gap-[2rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FFFFFF] px-[4.75rem] py-[2.25rem] shadow-sm'>
                        <svg
                          width='40'
                          height='40'
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
                        <span className='text-[0.875rem] text-[#1A1A1A]'>
                          클릭하여 복사한 JD 이미지를 업로드 하세요.
                        </span>
                      </div>
                    </div>

                    {/* 오른쪽: 드롭존/미리보기 영역 (섹션 밖) */}
                    <div
                      className='flex flex-1 items-center justify-center rounded-[1rem] border-2 border-dashed bg-[#FDFDFD]'
                      style={{
                        borderColor: '#CDD0D5',
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* 첨삭 의뢰하기 버튼 */}
            <div className='flex justify-center pb-[7rem]'>
              <button
                onClick={handleNextStep}
                className='flex cursor-pointer items-center justify-center gap-[0.75rem] rounded-[3.75rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'
              >
                {/* TODO: 아이콘 추가 */}
                <div className='h-[1.5rem] w-[1.5rem] bg-[#FFFFFF]' />
                <span className='text-[1rem] font-bold text-[#FFFFFF]'>
                  첨삭 의뢰하기
                </span>
              </button>
            </div>
          </>
        ) : step === 'portfolio' ? (
          <>
            {/* 포트폴리오 종류 선택 */}
            <div className='flex flex-col gap-[1.25rem]'>
              <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                <span>포트폴리오 종류 선택</span>
                <span className='text-[#DC0000]'>*</span>
              </div>

              <div className='grid grid-cols-2 gap-[1.5rem]'>
                {/* 텍스트형 포트폴리오 */}
                <button
                  onClick={() => handlePortfolioSelect('text')}
                  className={`flex cursor-pointer flex-col items-center gap-[0.25rem] rounded-[1.25rem] border-2 p-[2.25rem] shadow-[0_0.25rem_0.5rem_0_#00000033] transition-all ${
                    selectedPortfolioType === 'text'
                      ? 'border-[#5060C5] bg-[#F6F5FF]'
                      : 'border-[#E9EAEC] bg-[#FFFFFF] hover:border-[#CDD0D5]'
                  }`}
                >
                  <div className='flex h-[80px] w-[80px] items-center justify-center'>
                    <svg
                      width='52'
                      height='52'
                      viewBox='0 0 52 52'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M45.5 14.625V45.5C45.5 47.2239 44.8152 48.8772 43.5962 50.0962C42.3772 51.3152 40.7239 52 39 52H32.5V48.75H39C39.862 48.75 40.6886 48.4076 41.2981 47.7981C41.9076 47.1886 42.25 46.362 42.25 45.5V14.625H35.75C34.4571 14.625 33.2171 14.1114 32.3029 13.1971C31.3886 12.2829 30.875 11.0429 30.875 9.75V3.25H13C12.138 3.25 11.3114 3.59241 10.7019 4.2019C10.0924 4.8114 9.75 5.63805 9.75 6.5V35.75H6.5V6.5C6.5 4.77609 7.18482 3.12279 8.40381 1.90381C9.62279 0.68482 11.2761 0 13 0L30.875 0L45.5 14.625ZM6.266 51.5093V40.664H9.958V38.5125H0V40.664H3.6855V51.5093H6.266ZM21.5053 38.5125H18.5998L15.925 43.1892H15.8112L13.1073 38.5125H10.0782L14.0693 44.9573L10.0393 51.5093H12.8407L15.613 46.9105H15.7268L18.4893 51.5093H21.437L17.3647 45.0353L21.5053 38.5125ZM27.7778 40.664V51.5093H25.1972V40.664H21.5117V38.5125H31.4697V40.664H27.7745H27.7778Z'
                        fill='#5060C5'
                      />
                    </svg>
                  </div>
                  <div className='flex flex-col items-center gap-[0.5rem] text-center'>
                    <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                      텍스트형 포트폴리오
                    </span>
                    <span className='pb-[0.5rem] text-[0.875rem] text-[#74777D]'>
                      경험 정리를 바탕으로 생성된 텍스트형 포트폴리오를
                      첨삭해요.
                    </span>
                  </div>
                </button>

                {/* PDF 포트폴리오 */}
                <button
                  onClick={() => handlePortfolioSelect('pdf')}
                  className={`flex cursor-pointer flex-col items-center gap-[0.25rem] rounded-[1.25rem] border-2 p-[2.25rem] shadow-[0_0.25rem_0.5rem_0_#00000033] transition-all ${
                    selectedPortfolioType === 'pdf'
                      ? 'border-[#5060C5] bg-[#F6F5FF]'
                      : 'border-[#E9EAEC] bg-[#FFFFFF] hover:border-[#CDD0D5]'
                  }`}
                >
                  <div className='flex h-[80px] w-[80px] items-center justify-center'>
                    <svg
                      width='52'
                      height='52'
                      viewBox='0 0 52 52'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M45.5 14.625V45.5C45.5 47.2239 44.8152 48.8772 43.5962 50.0962C42.3772 51.3152 40.7239 52 39 52H35.75V48.75H39C39.862 48.75 40.6886 48.4076 41.2981 47.7981C41.9076 47.1886 42.25 46.362 42.25 45.5V14.625H35.75C34.4571 14.625 33.2171 14.1114 32.3029 13.1971C31.3886 12.2829 30.875 11.0429 30.875 9.75V3.25H13C12.138 3.25 11.3114 3.59241 10.7019 4.2019C10.0924 4.8114 9.75 5.63805 9.75 6.5V35.75H6.5V6.5C6.5 4.77609 7.18482 3.12279 8.40381 1.90381C9.62279 0.68482 11.2761 0 13 0L30.875 0L45.5 14.625ZM5.2 38.5125H0V51.5093H2.57075V47.1478H5.1805C6.11217 47.1478 6.90517 46.9603 7.5595 46.5855C8.22033 46.2063 8.72192 45.6928 9.06425 45.045C9.42107 44.3673 9.60104 43.6105 9.5875 42.8447C9.5875 42.0322 9.41633 41.2988 9.074 40.6445C8.73105 39.9977 8.21296 39.4604 7.579 39.0942C6.929 38.7043 6.136 38.5103 5.2 38.5125ZM6.97125 42.8447C6.98229 43.2729 6.88739 43.6971 6.695 44.0798C6.52249 44.4132 6.25274 44.6863 5.9215 44.863C5.5429 45.0494 5.12461 45.1409 4.70275 45.1295H2.561V40.56H4.706C5.4145 40.56 5.96917 40.7561 6.37 41.1483C6.77083 41.5448 6.97125 42.1102 6.97125 42.8447ZM10.9265 38.5125V51.5093H15.6715C16.9758 51.5093 18.057 51.2525 18.915 50.739C19.7833 50.2195 20.4613 49.4344 20.8487 48.4998C21.2734 47.5247 21.4858 46.3504 21.4858 44.9767C21.4858 43.6117 21.2734 42.4472 20.8487 41.483C20.465 40.5596 19.7937 39.7845 18.9345 39.273C18.0765 38.766 16.9878 38.5125 15.6683 38.5125H10.9265ZM13.4972 40.6087H15.327C16.1308 40.6087 16.7906 40.7734 17.3062 41.1028C17.841 41.4554 18.2451 41.9737 18.4567 42.5783C18.7124 43.2326 18.8403 44.0483 18.8403 45.0255C18.8503 45.6737 18.776 46.3205 18.6193 46.9495C18.5071 47.4469 18.2899 47.9145 17.9823 48.321C17.6995 48.6855 17.3248 48.9681 16.8967 49.14C16.3951 49.3275 15.8624 49.418 15.327 49.4065H13.4972V40.6087ZM25.662 46.3385V51.5093H23.0945V38.5125H31.3755V40.6348H25.662V44.265H30.8815V46.3385H25.662Z'
                        fill='#5060C5'
                      />
                    </svg>
                  </div>
                  <div className='flex flex-col items-center gap-[0.5rem] text-center'>
                    <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                      PDF 포트폴리오
                    </span>
                    <span className='pb-[0.5rem] text-[0.875rem] text-[#74777D]'>
                      업로드한 PDF 포트폴리오의 텍스트를 첨삭해요.
                    </span>
                  </div>
                </button>
              </div>

              {/* 텍스트형 포트폴리오 선택 리스트 */}
              {selectedPortfolioType === 'text' && (
                <div className='mt-[4.75rem] flex flex-col'>
                  <div className='flex items-center text-[1.125rem] font-bold'>
                    <span>텍스트형 포트폴리오 선택</span>
                  </div>
                  <span className='pt-[0.25rem] pb-[1.25rem] text-[0.875rem] text-[#74777D]'>
                    경험 정리를 통해 생성한 포트폴리오 중, 첨삭을 진행할
                    포트폴리오를 클릭하여 선택해주세요.
                  </span>
                  <div className='grid grid-cols-2 gap-[1.5rem]'>
                    <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                      <div className='flex flex-col gap-[1.25rem]'>
                        <span className='text-[1.125rem]'>
                          데이터 통계 경진대회
                        </span>
                        <div className='flex items-end justify-between'>
                          <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                            데이터
                          </div>
                          <span className='text-[1rem] text-[#74777D]'>
                            2000-00-00
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                      <div className='flex flex-col gap-[1.25rem]'>
                        <span className='text-[1.125rem]'>
                          공공 디자인 공모전
                        </span>
                        <div className='flex items-end justify-between'>
                          <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                            디자인
                          </div>
                          <span className='text-[1rem] text-[#74777D]'>
                            2000-00-00
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                      <div className='flex flex-col gap-[1.25rem]'>
                        <span className='text-[1.125rem]'>
                          00기업 서포터즈 활동
                        </span>
                        <div className='flex items-end justify-between'>
                          <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                            미정
                          </div>
                          <span className='text-[1rem] text-[#74777D]'>
                            2000-00-00
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF 포트폴리오 업로드 섹션 */}
              {selectedPortfolioType === 'pdf' && (
                <div className='mt-[4.75rem] flex flex-col gap-[1.25rem]'>
                  <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                    <span>PDF 포트폴리오 업로드</span>
                    <span className='text-[#DC0000]'>*</span>
                  </div>
                  <div className='rounded-[1rem] border border-[#E9EAEC] bg-[#FDFDFD] p-[1rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                    <div className='grid grid-cols-2 gap-[4rem] pl-[2.75rem]'>
                      {/* 왼쪽: 설명 및 텍스트 추출 버튼 */}
                      <div className='flex flex-col justify-center gap-[1.5rem]'>
                        <div className='flex flex-col'>
                          <span className='text-[0.875rem] text-[#1A1A1A]'>
                            업로드하신 포트폴리오 파일의 텍스트를 추출하여
                            첨삭을 진행해요.
                          </span>
                          <span className='text-[0.875rem] text-[#1A1A1A]'>
                            최대 10MB의 파일, 최대 5개의 파일을 첨삭이 가능해요.
                          </span>
                        </div>
                        <button className='cursor-pointer self-start rounded-[3.75rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'>
                          <span className='text-[1rem] font-bold text-[#FFFFFF]'>
                            텍스트 추출하기
                          </span>
                        </button>
                      </div>

                      {/* 오른쪽: 파일 업로드 영역 */}
                      <div className='flex flex-col items-center justify-center gap-[0.75rem] rounded-[1rem] border border-[#CDD0D5] bg-[#FFFFFF] p-[3rem]'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='40'
                          height='40'
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
                        <span className='text-center text-[0.875rem] text-[#74777D]'>
                          클릭하여 파일을 업로드하세요.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF 포트폴리오 텍스트 정리 섹션 */}
              {selectedPortfolioType === 'pdf' && (
                <div className='mt-[3.75rem] flex flex-col'>
                  <div className='mb-[0.5rem] flex items-center text-[1.125rem] font-bold'>
                    <span>PDF 포트폴리오 텍스트 정리</span>
                  </div>
                  <div className='mb-[2.5rem] flex flex-col'>
                    <span className='text-[0.875rem] text-[#74777D]'>
                      업로드하신 파일을 AI가 구조화하여 정리했어요. 잘못된
                      부분이나 추가하실 부분이 있다면 수정해주세요.
                    </span>
                    <span className='text-[0.875rem] text-[#74777D]'>
                      삭제한 영역은 복원되지 않고, 자기소개 페이지는 첨삭되지
                      않아요.
                    </span>
                  </div>

                  {/* 활동 탭 */}
                  <div className='flex'>
                    <button
                      onClick={() => setSelectedActivity('A')}
                      className={`cursor-pointer border-none px-[2.5rem] py-[1rem] text-[1rem] font-medium transition-all ${
                        selectedActivity === 'A'
                          ? 'relative z-10 rounded-t-[1.25rem] bg-[#FFFFFF] text-[#5060C5] shadow-[0_0.25rem_0.5rem_0_#00000033]'
                          : 'rounded-t-[1.25rem] bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                    >
                      활동 A
                    </button>
                    <button
                      onClick={() => setSelectedActivity('B')}
                      className={`cursor-pointer border-none px-[2.5rem] py-[1rem] text-[1rem] font-medium transition-all ${
                        selectedActivity === 'B'
                          ? 'relative z-10 rounded-t-[1.25rem] bg-[#FFFFFF] text-[#5060C5] shadow-[0_0.25rem_0.5rem_0_#00000033]'
                          : 'rounded-t-[1.25rem] bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                    >
                      활동 B
                    </button>
                    <button
                      onClick={() => setSelectedActivity('C')}
                      className={`cursor-pointer border-none px-[2.5rem] py-[1rem] text-[1rem] font-medium transition-all ${
                        selectedActivity === 'C'
                          ? 'relative z-10 rounded-t-[1.25rem] bg-[#FFFFFF] text-[#5060C5] shadow-[0_0.25rem_0.5rem_0_#00000033]'
                          : 'rounded-t-[1.25rem] bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                    >
                      활동 C
                    </button>
                    <button className='cursor-pointer rounded-t-[1.25rem] border-none bg-[#F6F8FA] px-[3rem] py-[1rem] text-[0.875rem] font-medium text-[#9EA4A9] transition-all'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 16 16'
                        fill='#5060C5'
                      >
                        <path
                          d='M8 3.33333V12.6667M3.33333 8H12.6667'
                          stroke='#5060C5'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 사이드바 및 내용 영역 */}
                  <div className='relative z-20 flex min-h-[397px] rounded-tr-[1.25rem] rounded-br-[1.25rem] rounded-bl-[1.25rem] border border-[#E9EAEC] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                    {/* 사이드바 네비게이션 */}
                    <div className='flex flex-col'>
                      <button
                        onClick={() => setSelectedTab('상세정보')}
                        className={`cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] transition-all ${
                          selectedTab === '상세정보'
                            ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                            : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                        }`}
                      >
                        상세정보
                      </button>
                      <button
                        onClick={() => setSelectedTab('담당업무')}
                        className={`cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] font-medium transition-all ${
                          selectedTab === '담당업무'
                            ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                            : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                        }`}
                      >
                        담당업무
                      </button>
                      <button
                        onClick={() => setSelectedTab('문제해결')}
                        className={`cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] font-medium transition-all ${
                          selectedTab === '문제해결'
                            ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                            : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                        }`}
                      >
                        문제해결
                      </button>
                      <button
                        onClick={() => setSelectedTab('배운 점')}
                        className={`cursor-pointer border-b border-b-[#CDD0D5] px-[2rem] py-[0.75rem] text-center text-[1rem] font-medium transition-all ${
                          selectedTab === '배운 점'
                            ? 'bg-[#5060C5] font-bold text-[#FFFFFF]'
                            : 'bg-[#F6F8FA] font-medium text-[#9EA4A9]'
                        }`}
                      >
                        배운 점
                      </button>
                    </div>

                    {/* 구분선 */}
                    <div className='w-[1px] bg-[#CDD0D5]' />

                    {/* 내용 영역 */}
                    <div className='flex-1 rounded-tr-[1.25rem] rounded-br-[1.25rem] bg-[#FFFFFF] px-[2.25rem] py-[1.5rem]'>
                      <div className='flex flex-col gap-[0.5rem] text-[0.875rem] text-[#1A1A1A]'>
                        <span>
                          내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                          내용내용내용내용내용내용내용
                          내용내용내용내용내용내용내용
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 미분류 텍스트 섹션 */}
              {selectedPortfolioType === 'pdf' && (
                <div className='mt-[3.75rem] flex flex-col'>
                  <div className='mb-[0.5rem] flex items-center gap-[0.5rem] text-[1.125rem] font-bold'>
                    <button
                      onClick={() => setIsUnclassifiedOpen(!isUnclassifiedOpen)}
                      className='flex cursor-pointer items-center justify-center border-none bg-transparent transition-transform'
                      style={{
                        transform: isUnclassifiedOpen
                          ? 'scaleY(-1)'
                          : 'scaleY(1)',
                      }}
                    >
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M11.55 16.7845L4.18674 8.25729C4.09769 8.15442 4.037 8.02328 4.01234 7.88045C3.98768 7.73762 4.00016 7.58953 4.04821 7.45492C4.09625 7.32031 4.1777 7.20523 4.28225 7.12425C4.38679 7.04327 4.50973 7.00003 4.6355 7H19.3645C19.4903 7.00003 19.6132 7.04327 19.7178 7.12425C19.8223 7.20523 19.9037 7.32031 19.9518 7.45492C19.9998 7.58953 20.0123 7.73762 19.9877 7.88045C19.963 8.02328 19.9023 8.15442 19.8133 8.25729L12.4488 16.7845C12.3296 16.9225 12.1679 17 11.9994 17C11.8308 17 11.6692 16.9225 11.55 16.7845Z'
                          fill='black'
                        />
                      </svg>
                    </button>
                    <span>미분류 텍스트</span>
                  </div>

                  {isUnclassifiedOpen && (
                    <>
                      <div className='mb-[2rem] flex flex-col'>
                        <span className='text-[0.875rem] text-[#74777D]'>
                          항목에 딱 맞지 않지만, 놓치기 아쉬운 내용을 따로
                          모았어요. 필요한 내용은 화살표를 눌러 위의 텍스트
                          정리로 옮겨주세요.
                        </span>
                        <span className='text-[0.875rem] text-[#74777D]'>
                          이곳에 남은 텍스트는 저장되지 않고, 첨삭에 포함되지
                          않으니 꼼꼼히 확인해주세요.
                        </span>
                      </div>

                      {/* 라디오버튼 및 내용 영역 */}
                      <div className='relative z-20 flex min-h-[397px] flex-col rounded-[1.25rem] border border-[#E9EAEC] bg-[#FFFFFF] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                        {/* 활동 탭 */}
                        <div className='flex border-b border-b-[#CDD0D5]'>
                          <button
                            className={`cursor-pointer border-none px-[2.5rem] py-[1rem] text-[1rem] font-medium transition-all`}
                          >
                            활동 A로 이동
                          </button>
                        </div>

                        {/* 라디오버튼 및 내용 영역 */}
                        <div className='flex flex-1'>
                          {/* 라디오버튼 네비게이션 */}
                          <div className='flex flex-col border-r border-r-[#CDD0D5]'>
                            <label className='flex cursor-pointer items-center gap-[0.5rem] px-[1.5rem] pt-[1.5rem]'>
                              <input
                                type='radio'
                                name='unclassifiedTab'
                                checked={selectedUnclassifiedTab === '상세정보'}
                                onChange={() =>
                                  setSelectedUnclassifiedTab('상세정보')
                                }
                                className='h-[1rem] w-[1rem] cursor-pointer accent-[#5060C5]'
                              />
                              <span className='text-[1rem]'>상세정보</span>
                            </label>
                            <label className='flex cursor-pointer items-center gap-[0.5rem] px-[1.5rem] pt-[1.75rem]'>
                              <input
                                type='radio'
                                name='unclassifiedTab'
                                checked={selectedUnclassifiedTab === '담당업무'}
                                onChange={() =>
                                  setSelectedUnclassifiedTab('담당업무')
                                }
                                className='h-[1rem] w-[1rem] cursor-pointer accent-[#5060C5]'
                              />
                              <span className='text-[1rem]'>담당업무</span>
                            </label>
                            <label className='flex cursor-pointer items-center gap-[0.5rem] px-[1.5rem] pt-[1.75rem]'>
                              <input
                                type='radio'
                                name='unclassifiedTab'
                                checked={selectedUnclassifiedTab === '문제해결'}
                                onChange={() =>
                                  setSelectedUnclassifiedTab('문제해결')
                                }
                                className='h-[1rem] w-[1rem] cursor-pointer accent-[#5060C5]'
                              />
                              <span className='text-[1rem]'>문제해결</span>
                            </label>
                            <label className='flex cursor-pointer items-center gap-[0.5rem] px-[1.5rem] pt-[1.75rem]'>
                              <input
                                type='radio'
                                name='unclassifiedTab'
                                checked={selectedUnclassifiedTab === '배운 점'}
                                onChange={() =>
                                  setSelectedUnclassifiedTab('배운 점')
                                }
                                className='h-[1rem] w-[1rem] cursor-pointer accent-[#5060C5]'
                              />
                              <span className='text-[1rem]'>배운 점</span>
                            </label>
                          </div>

                          {/* 내용 영역 */}
                          <div className='flex-1 rounded-tr-[1.25rem] rounded-br-[1.25rem] bg-[#FFFFFF] px-[2.5rem] py-[1.5rem]'>
                            <div className='flex flex-col gap-[1rem] text-[1rem] text-[#1A1A1A]'>
                              <span>
                                →
                                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                내용내용내용내용내용내용내용
                                내용내용내용내용내용내용내용
                              </span>
                              <span>
                                →
                                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                              </span>
                              <span>
                                →
                                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 다음으로 버튼 */}
            <div className='flex justify-center pb-[7rem]'>
              <button
                onClick={handleNextStep}
                disabled={!selectedPortfolioType}
                className={`flex cursor-pointer items-center justify-center rounded-[3.75rem] border-none px-[2.25rem] py-[0.75rem] ${
                  selectedPortfolioType
                    ? 'bg-[#5060C5]'
                    : 'cursor-not-allowed bg-[#CDD0D5]'
                }`}
              >
                <span className='text-[1rem] font-bold text-[#FFFFFF]'>
                  다음으로
                </span>
              </button>
            </div>
          </>
        ) : step === 'analysis' ? (
          <>
            <div className='flex flex-col gap-[5rem]'>
              {/* 기업 분석 정보 섹션 */}
              <div className='flex flex-col gap-[0.375rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                  <span>기업 분석 정보</span>
                  <span className='text-[#DC0000]'>*</span>
                </div>
                <div className='flex flex-col'>
                  <div className='mb-[1rem] flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-[0.875rem] text-[#74777D]'>
                        지원 정보를 바탕으로 AI 컨설턴트가 기업 분석 정보를
                        생성했어요.
                      </span>
                      <span className='text-[0.875rem] text-[#74777D]'>
                        추가하고 싶은 내용이 있으시면, 수정 후 첨삭을
                        의뢰해주세요.
                      </span>
                    </div>
                    <button className='h-fit cursor-pointer rounded-[3.75rem] border border-[#5060C5] bg-[#F6F5FF] px-[2.25rem] py-[0.5rem] text-[1rem] font-bold whitespace-nowrap text-[#5060C5]'>
                      3크레딧으로 다시 생성
                    </button>
                  </div>
                  <textarea className='min-h-[17.125rem] rounded-[1.25rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-[#74777D]' />
                </div>
              </div>

              {/* 강조 포인트 섹션 */}
              <div className='flex flex-col gap-[0.375rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                  <span>강조 포인트</span>
                </div>
                <div className='flex flex-col'>
                  <span className='mb-[1rem] text-[0.875rem] text-[#74777D]'>
                    기업 분석 정보를 바탕으로, 이번 서류에서 강조하고 싶은
                    역량이나 기술 등이 있다면 작성해주세요.
                  </span>
                  <textarea className='min-h-[10.625rem] rounded-[1.25rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-[#74777D]' />
                </div>
              </div>
            </div>

            {/* 첨삭 의뢰하기 버튼 */}
            <div className='flex justify-center pt-[1.25rem] pb-[7rem]'>
              <button
                onClick={handleNextStep}
                className='flex cursor-pointer items-center justify-center rounded-[3.75rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'
              >
                <span className='text-[1rem] font-bold text-[#FFFFFF]'>
                  첨삭 의뢰하기
                </span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* status가 ANALYZING 상태일 때는 DRAFT, DONE이 아닌 값을 미리 체크 */}
            {status !== 'DRAFT' && status !== 'DONE' ? (
              <div className='flex items-center justify-center py-[10rem]'>
                <span className='text-[1.25rem] font-bold'>분석 중...</span>
              </div>
            ) : (
              <>
                <div className='flex flex-col'>
                  {/* 탭 */}
                  <div className='flex'>
                    <button
                      onClick={() => setResultTab('지원 정보')}
                      className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
                        resultTab === '지원 정보'
                          ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
                          : 'bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                      style={
                        resultTab === '지원 정보'
                          ? {
                              boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)',
                            }
                          : undefined
                      }
                    >
                      지원 정보
                    </button>
                    <button
                      onClick={() => setResultTab('활동 A')}
                      className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
                        resultTab === '활동 A'
                          ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
                          : 'bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                      style={
                        resultTab === '활동 A'
                          ? {
                              boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)',
                            }
                          : undefined
                      }
                    >
                      활동 A
                    </button>
                    <button
                      onClick={() => setResultTab('활동 B')}
                      className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
                        resultTab === '활동 B'
                          ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
                          : 'bg-[#F6F8FA] text-[#9EA4A9]'
                      }`}
                      style={
                        resultTab === '활동 B'
                          ? {
                              boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)',
                            }
                          : undefined
                      }
                    >
                      활동 B
                    </button>
                  </div>

                  {/* 내용 영역 */}
                  <div className='relative z-20 rounded-tr-[1.25rem] rounded-br-[1.25rem] rounded-bl-[1.25rem] border border-t-0 border-[#E9EAEC] bg-[#FFFFFF] px-[2.5rem] py-[3rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
                    {/* 지원 정보 탭 내용 */}
                    {resultTab === '지원 정보' && (
                      <div className='flex flex-col gap-[3.75rem]'>
                        {/* 지원 기업명 및 지원 직무명 */}
                        <div className='grid grid-cols-2 gap-[1.5rem]'>
                          <div className='flex flex-col gap-[1rem]'>
                            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                              <span>지원 기업명</span>
                            </div>
                            <div className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
                              삼성 SDI
                            </div>
                          </div>
                          <div className='flex flex-col gap-[1rem]'>
                            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                              <span>지원 직무명</span>
                            </div>
                            <div className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
                              품질관리
                            </div>
                          </div>
                        </div>

                        {/* Job Description */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                            <span>Job Description</span>
                          </div>
                          <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                          </div>
                        </div>

                        {/* 기업 분석 정보 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                            <span>기업 분석 정보</span>
                          </div>
                          <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                          </div>
                        </div>

                        {/* 강조 포인트 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                            <span>강조 포인트</span>
                          </div>
                          <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 활동 A, B 탭 내용 */}
                    {(resultTab === '활동 A' || resultTab === '활동 B') && (
                      <div className='flex flex-col gap-[3rem]'>
                        {/* 총평 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold'>총평</div>
                          <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                            일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십
                          </div>
                        </div>

                        {/* 상세정보 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold'>
                            상세정보
                          </div>
                          <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                            <div className='min-w-0 flex-1 overflow-auto'>
                              -내용내용내용내용내용내용내용내용내용내용내용내용
                              <span className='bg-[#FFF2F2]'>
                                내용내용내용내용내용내용내용내용내용내용내용내용내용
                              </span>
                              내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                            </div>
                            <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                            <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                              <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                                <button
                                  onClick={() =>
                                    setDetailInfoButton('축소 또는 제외')
                                  }
                                  className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    detailInfoButton === '축소 또는 제외'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  축소 또는 제외
                                </button>
                                <button
                                  onClick={() =>
                                    setDetailInfoButton('구체화하여 강조')
                                  }
                                  className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    detailInfoButton === '구체화하여 강조'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  구체화하여 강조
                                </button>
                              </div>
                              <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        {/* 담당업무 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold'>
                            담당업무
                          </div>
                          <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                            <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                              -
                              <span className='bg-[#F1FEF0]'>
                                내용내용내용내용내용내용내용내용내용내용내용내용
                              </span>
                              내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                            </div>
                            <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                            <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                              <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                                <button
                                  onClick={() =>
                                    setResponsibilityButton('축소 또는 제외')
                                  }
                                  className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    responsibilityButton === '축소 또는 제외'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  축소 또는 제외
                                </button>
                                <button
                                  onClick={() =>
                                    setResponsibilityButton('구체화하여 강조')
                                  }
                                  className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    responsibilityButton === '구체화하여 강조'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  구체화하여 강조
                                </button>
                              </div>
                              <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        {/* 문제 해결 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold'>
                            문제 해결
                          </div>
                          <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                            <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                              -내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                            </div>
                            <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                            <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                              <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                                <button
                                  onClick={() =>
                                    setProblemSolvingButton('축소 또는 제외')
                                  }
                                  className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    problemSolvingButton === '축소 또는 제외'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  축소 또는 제외
                                </button>
                                <button
                                  onClick={() =>
                                    setProblemSolvingButton('구체화하여 강조')
                                  }
                                  className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    problemSolvingButton === '구체화하여 강조'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  구체화하여 강조
                                </button>
                              </div>
                              <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>

                        {/* 배운 점 */}
                        <div className='flex flex-col gap-[1rem]'>
                          <div className='text-[1.125rem] font-bold'>
                            배운 점
                          </div>
                          <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                            <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                              -내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                            </div>
                            <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                            <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                              <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                                <button
                                  onClick={() =>
                                    setLessonsButton('축소 또는 제외')
                                  }
                                  className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    lessonsButton === '축소 또는 제외'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  축소 또는 제외
                                </button>
                                <button
                                  onClick={() =>
                                    setLessonsButton('구체화하여 강조')
                                  }
                                  className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                                    lessonsButton === '구체화하여 강조'
                                      ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                                      : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                                  }`}
                                >
                                  구체화하여 강조
                                </button>
                              </div>
                              <ol className='ml-[1.5rem] flex list-decimal flex-col gap-[0.5rem]'>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                                <li className='text-[1rem] text-[#1A1A1A]'>
                                  내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 새로운 경험 정리 시작하기 버튼 */}
                <div className='flex justify-center pt-[1.25rem] pb-[7rem]'>
                  <button
                    onClick={handleStartNewExperience}
                    className='flex cursor-pointer items-center justify-center gap-[0.75rem] rounded-[3.75rem] border-none bg-[#5060C5] px-[2rem] py-[0.625rem]'
                  >
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M15 0H1.66667C0.746192 0 0 0.746192 0 1.66667V3.33333C0 4.25381 0.746192 5 1.66667 5H15C15.9205 5 16.6667 4.25381 16.6667 3.33333V1.66667C16.6667 0.746192 15.9205 0 15 0Z'
                        fill='white'
                      />
                      <path
                        d='M18.332 6.66675H4.9987C4.07822 6.66675 3.33203 7.41294 3.33203 8.33341V10.0001C3.33203 10.9206 4.07822 11.6667 4.9987 11.6667H18.332C19.2525 11.6667 19.9987 10.9206 19.9987 10.0001V8.33341C19.9987 7.41294 19.2525 6.66675 18.332 6.66675Z'
                        fill='white'
                      />
                      <path
                        d='M15 13.3333H1.66667C0.746192 13.3333 0 14.0794 0 14.9999V16.6666C0 17.5871 0.746192 18.3333 1.66667 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6666V14.9999C16.6667 14.0794 15.9205 13.3333 15 13.3333Z'
                        fill='white'
                      />
                    </svg>
                    <span className='text-[1rem] font-bold text-[#FFFFFF]'>
                      새로운 경험 정리 시작하기
                    </span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
