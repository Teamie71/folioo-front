'use client';

import { CommonButton } from '@/components/CommonButton';
import { ToggleLarge } from '@/components/ToggleLarge';
import { ExperienceIcon } from '@/components/icons/ExperienceIcon';
import type { Status } from '@/types/correction';

type ResultTab = '지원 정보' | '총평' | '활동 A' | '활동 B';
type ResultButtonValue = '축소 또는 제외' | '구체화하여 강조';

export interface CorrectionResultStepProps {
  status: Status;
  resultTab: ResultTab;
  onResultTabChange: (tab: ResultTab) => void;
  detailInfoButton: ResultButtonValue;
  setDetailInfoButton: (value: ResultButtonValue) => void;
  responsibilityButton: ResultButtonValue;
  setResponsibilityButton: (value: ResultButtonValue) => void;
  problemSolvingButton: ResultButtonValue;
  setProblemSolvingButton: (value: ResultButtonValue) => void;
  lessonsButton: ResultButtonValue;
  setLessonsButton: (value: ResultButtonValue) => void;
  onStartNewExperience: () => void;
}

export function CorrectionResultStep({
  status,
  resultTab,
  onResultTabChange,
  detailInfoButton,
  setDetailInfoButton,
  responsibilityButton,
  setResponsibilityButton,
  problemSolvingButton,
  setProblemSolvingButton,
  lessonsButton,
  setLessonsButton,
  onStartNewExperience,
}: CorrectionResultStepProps) {
  if (status !== 'DRAFT' && status !== 'DONE') {
    return (
      <div className='flex flex-col items-center justify-center gap-[2rem] py-[10rem]'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='56'
          height='60'
          viewBox='0 0 56 60'
          fill='none'
        >
          <path
            opacity='0.1'
            fillRule='evenodd'
            clipRule='evenodd'
            d='M28 8C22.6957 8 17.6086 10.1071 13.8579 13.8579C10.1071 17.6086 8 22.6957 8 28C8 33.3043 10.1071 38.3914 13.8579 42.1421C17.6086 45.8929 22.6957 48 28 48C33.3043 48 38.3914 45.8929 42.1421 42.1421C45.8929 38.3914 48 33.3043 48 28C48 22.6957 45.8929 17.6086 42.1421 13.8579C38.3914 10.1071 33.3043 8 28 8ZM0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z'
            fill='#74777D'
          />
          <g
            className='animate-spin'
            style={{ transformOrigin: '28px 28px' }}
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M28.0007 8.00003C22.8444 7.989 17.8852 9.9805 14.1687 13.5547C13.3987 14.2666 12.3801 14.6477 11.3319 14.6159C10.2838 14.5841 9.29007 14.142 8.56467 13.3848C7.83927 12.6276 7.44023 11.6158 7.45344 10.5673C7.46666 9.51879 7.89108 8.51738 8.63534 7.7787C13.8408 2.77773 20.7822 -0.0105164 28.0007 2.98087e-05C29.0615 2.98087e-05 30.079 0.421457 30.8291 1.1716C31.5792 1.92175 32.0007 2.93916 32.0007 4.00003C32.0007 5.0609 31.5792 6.07831 30.8291 6.82846C30.079 7.5786 29.0615 8.00003 28.0007 8.00003Z'
              fill='url(#paint0_linear_3242_3790_analysis)'
            />
          </g>
          <defs>
            <linearGradient
              id='paint0_linear_3242_3790_analysis'
              x1='19.7269'
              y1='0'
              x2='19.7269'
              y2='14.6177'
              gradientUnits='userSpaceOnUse'
            >
              <stop stopColor='#93B3F4' />
              <stop offset='1' stopColor='#5060C5' />
            </linearGradient>
          </defs>
        </svg>
        <div className='flex flex-col items-center gap-[0.5rem] text-center'>
          <span className='text-[1.25rem] font-bold leading-[1.3] text-[#1A1A1A]'>
            AI 컨설턴트가 포트폴리오 첨삭을 진행 중이에요.
          </span>
          <span className='text-[1rem] text-[#74777D]'>
            페이지를 떠나도 작업은 계속돼요.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col'>
        {/* 탭 */}
        <div className='flex'>
          <button
            onClick={() => onResultTabChange('지원 정보')}
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
            onClick={() => onResultTabChange('총평')}
            className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
              resultTab === '총평'
                ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
                : 'bg-[#F6F8FA] text-[#9EA4A9]'
            }`}
            style={
              resultTab === '총평'
                ? {
                    boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)',
                  }
                : undefined
            }
          >
            총평
          </button>
          <button
            onClick={() => onResultTabChange('활동 A')}
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
            onClick={() => onResultTabChange('활동 B')}
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
          {resultTab === '지원 정보' && (
            <div className='flex flex-col gap-[3.75rem]'>
              <div className='grid grid-cols-2 gap-[1.5rem]'>
                <div className='flex flex-col gap-[1rem]'>
                  <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                    <span>지원 기업명</span>
                  </div>
                  <div className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
                    삼성 SDI
                  </div>
                </div>
                <div className='flex flex-col gap-[1rem]'>
                  <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                    <span>지원 직무명</span>
                  </div>
                  <div className='rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
                    품질관리
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-[1rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                  <span>Job Description</span>
                </div>
                <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                  일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                </div>
              </div>

              <div className='flex flex-col gap-[1rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                  <span>기업 분석 정보</span>
                </div>
                <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                  일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                </div>
              </div>

              <div className='flex flex-col gap-[1rem]'>
                <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
                  <span>강조 포인트</span>
                </div>
                <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                  일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사
                </div>
              </div>
            </div>
          )}

          {resultTab === '총평' && (
            <div className='flex flex-col gap-[3rem]'>
              <div className='flex flex-col gap-[1rem]'>
                <div className='text-[1.125rem] font-bold leading-[1.3]'>총평</div>
                <div className='rounded-[1.25rem] border border-[#74777D] px-[1.5rem] py-[1.25rem]'>
                  일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십
                </div>
              </div>
            </div>
          )}

          {(resultTab === '활동 A' || resultTab === '활동 B') && (
            <div className='flex flex-col gap-[3rem]'>
              <div className='flex flex-col gap-[1rem]'>
                <div className='text-[1.125rem] font-bold leading-[1.3]'>
                  상세정보
                </div>
                <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                  <div className='min-w-0 flex-1 overflow-auto'>
                    -내용내용내용내용내용내용내용내용내용내용내용
                    <span className='bg-[#FFF2F2]'>
                      내용내용내용내용내용내용내용내용내용내용내용내용
                    </span>
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                  </div>
                  <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                  <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                    <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                      <button
                        onClick={() => setDetailInfoButton('축소 또는 제외')}
                        className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                          detailInfoButton === '축소 또는 제외'
                            ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                            : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                        }`}
                      >
                        축소 또는 제외
                      </button>
                      <button
                        onClick={() => setDetailInfoButton('구체화하여 강조')}
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

              <div className='flex flex-col gap-[1rem]'>
                <div className='text-[1.125rem] font-bold leading-[1.3]'>
                  담당업무
                </div>
                <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                  <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                    -
                    <span className='bg-[#F1FEF0]'>
                      내용내용내용내용내용내용내용내용내용내용내용내용
                    </span>
                    내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                  </div>
                  <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                  <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                    <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                      <button
                        onClick={() => setResponsibilityButton('축소 또는 제외')}
                        className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                          responsibilityButton === '축소 또는 제외'
                            ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                            : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                        }`}
                      >
                        축소 또는 제외
                      </button>
                      <button
                        onClick={() => setResponsibilityButton('구체화하여 강조')}
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

              <div className='flex flex-col gap-[1rem]'>
                <div className='text-[1.125rem] font-bold leading-[1.3]'>
                  문제 해결
                </div>
                <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                  <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                    -내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                  </div>
                  <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                  <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                    <ToggleLarge
                      options={[
                        { value: '축소 또는 제외', label: '축소 또는 제외' },
                        { value: '구체화하여 강조', label: '구체화하여 강조' },
                      ]}
                      value={problemSolvingButton}
                      onChange={(value) =>
                        setProblemSolvingButton(
                          value as ResultButtonValue,
                        )
                      }
                    />
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

              <div className='flex flex-col gap-[1rem]'>
                <div className='text-[1.125rem] font-bold leading-[1.3]'>
                  배운 점
                </div>
                <div className='flex gap-[1.5rem] rounded-[1.25rem] border border-[#74777D] px-[1.75rem] py-[2rem]'>
                  <div className='min-h-[8rem] min-w-0 flex-1 overflow-auto'>
                    -내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
                  </div>
                  <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
                  <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
                    <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
                      <button
                        onClick={() => setLessonsButton('축소 또는 제외')}
                        className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${
                          lessonsButton === '축소 또는 제외'
                            ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
                            : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]'
                        }`}
                      >
                        축소 또는 제외
                      </button>
                      <button
                        onClick={() => setLessonsButton('구체화하여 강조')}
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

      <div className='flex justify-center pt-[1.25rem] pb-[6.25rem]'>
        <CommonButton
          variantType='Primary'
          px='2.25rem'
          py='0.75rem'
          className='gap-[1.25rem] rounded-[3.75rem] [&_path]:fill-white [&_svg]:h-[1.25rem] [&_svg]:w-[1.25rem]'
          onClick={onStartNewExperience}
        >
          <ExperienceIcon />
          새로운 경험 정리 시작하기
        </CommonButton>
      </div>
    </>
  );
}
