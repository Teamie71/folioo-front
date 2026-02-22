'use client';

import { ToggleLarge } from '@/components/ToggleLarge';

export type ResultButtonValue = '축소 또는 제외' | '구체화하여 강조';

export interface CorrectionResultActivityDetailProps {
  detailInfoButton: ResultButtonValue;
  setDetailInfoButton: (value: ResultButtonValue) => void;
  responsibilityButton: ResultButtonValue;
  setResponsibilityButton: (value: ResultButtonValue) => void;
  problemSolvingButton: ResultButtonValue;
  setProblemSolvingButton: (value: ResultButtonValue) => void;
  lessonsButton: ResultButtonValue;
  setLessonsButton: (value: ResultButtonValue) => void;
}

const buttonClass = (selected: boolean) =>
  selected
    ? 'border border-[#CDD0D5] bg-[#FFFFFF] text-[#5060C5]'
    : 'border border-[#E9EAEC] bg-[#E9EAEC] text-[#74777D]';

export function CorrectionResultActivityDetail({
  detailInfoButton,
  setDetailInfoButton,
  responsibilityButton,
  setResponsibilityButton,
  problemSolvingButton,
  setProblemSolvingButton,
  lessonsButton,
  setLessonsButton,
}: CorrectionResultActivityDetailProps) {
  return (
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
                className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(detailInfoButton === '축소 또는 제외')}`}
              >
                축소 또는 제외
              </button>
              <button
                onClick={() => setDetailInfoButton('구체화하여 강조')}
                className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(detailInfoButton === '구체화하여 강조')}`}
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
              내용내용내용내용내용내용내용내용내용내용내용
            </span>
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
          </div>
          <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
          <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
            <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
              <button
                onClick={() => setResponsibilityButton('축소 또는 제외')}
                className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(responsibilityButton === '축소 또는 제외')}`}
              >
                축소 또는 제외
              </button>
              <button
                onClick={() => setResponsibilityButton('구체화하여 강조')}
                className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(responsibilityButton === '구체화하여 강조')}`}
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
            -내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
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
                setProblemSolvingButton(value as ResultButtonValue)
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
            -내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
          </div>
          <div className='w-[1px] flex-shrink-0 bg-[#9EA4A9]' />
          <div className='flex min-w-0 flex-1 flex-col gap-[2.5rem] overflow-auto'>
            <div className='flex gap-[0.25rem] rounded-[6.25rem] bg-[#E9EAEC] p-[0.25rem]'>
              <button
                onClick={() => setLessonsButton('축소 또는 제외')}
                className={`h-[40px] w-[211px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(lessonsButton === '축소 또는 제외')}`}
              >
                축소 또는 제외
              </button>
              <button
                onClick={() => setLessonsButton('구체화하여 강조')}
                className={`h-[40px] w-[212px] cursor-pointer rounded-[6.25rem] text-[1rem] font-medium whitespace-nowrap ${buttonClass(lessonsButton === '구체화하여 강조')}`}
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
  );
}
