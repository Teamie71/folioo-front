import { CommonButton } from '@/components/CommonButton';
import EtcIcon from '@/components/icons/EtcIcon';
import { InsightLogIcon } from '@/components/icons/InsightLogIcon';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import InputArea from '@/components/InputArea';
import { SingleButtonGroup } from '@/components/SingleButtonGroup';
import { Checkbox } from '@/components/ui/CheckBox';
import { ActivitySelect } from '@/features/log/components/ActivitySelect';
import { InsightTemplateSelector } from '@/features/log/components/CategorySector';

export default function LogPage() {
  return (
    <div className='flex flex-col gap-[4.5rem] pb-[4.5rem]'>
      {/* 인사이트 로그 헤더 */}
      <div className='mx-auto flex h-[15.625rem] w-full min-w-[66rem] flex-col justify-center bg-[#F6F5FF]'>
        <div className='mx-auto flex min-w-[66rem] flex-col items-start gap-[1rem]'>
          <div className='flex items-center gap-[1rem]'>
            <InsightLogIcon />
            <span className='text-[1.5rem] font-bold text-[#1A1A1A]'>
              인사이트 로그
            </span>
          </div>
          <span className='font-regular text-[1.125rem] leading-[150%] text-[#464B53]'>
            오늘 얻은 인사이트를 기록해보세요.
            <br />
            작은 인사이트가 모여 큰 성장이 됩니다.
          </span>
        </div>
      </div>

      {/* 새로운 로그 작성 영역 */}
      <div className='mx-auto flex w-[66rem] flex-col rounded-[1.25rem] bg-[#ffffff] p-[2rem] shadow-[0px_4px_8px_0px_#00000033]'>
        {/* 로그 작성 헤더 */}
        <div className='flex w-full items-center justify-between px-[0.5rem]'>
          <span className='text-[1.25rem] font-bold'>새로운 로그 작성</span>
          <CommonButton variantType='Primary' px='2.25rem' py='0.75rem'>
            로그 등록하기
          </CommonButton>
        </div>

        {/* 구분선 */}
        <div className='mt-[1.25rem] mb-[2.5rem] w-full border border-[#9EA4A9]' />

        {/* 로그 작성 내용 */}
        <div className='flex flex-col gap-[3.75rem] px-[1.5rem]'>
          {/* 제목, 활동명 */}
          <div className='grid grid-cols-2 justify-between gap-[1.5rem]'>
            <div className='flex flex-col gap-[0.5rem]'>
              <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                <span>제목</span>
                <span className='text-[#DC0000]'>*</span>
              </div>
              <InputArea placeholder='제목 입력' />
            </div>

            {/* 활동명 선택 */}
            <ActivitySelect />
          </div>

          {/* 카테고리 선택 */}
          <div className='flex flex-col gap-[0.625rem]'>
            <div className='flex flex-col gap-[0.75rem]'>
              <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                <span>카테고리</span>
                <span className='text-[#DC0000]'>*</span>
              </div>
            </div>

            <InsightTemplateSelector />
          </div>
        </div>
      </div>

      {/* 나의 로그 영역 */}
      <div className='mx-auto flex w-[66rem] flex-col gap-[2.75rem]'>
        {/* 검색, 선택 */}
        <div className='flex flex-col gap-[2.25rem]'>
          <span className='text-[1.25rem] font-bold'>나의 로그</span>
          <div className='flex items-center gap-[1.5rem]'>
            {/* 검색 */}
            <div className='relative flex items-center'>
              <input
                className='w-[32.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                placeholder='검색어를 입력하세요.'
              />
              <button className='absolute right-[1.25rem] cursor-pointer border-none bg-transparent'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M21.4073 19.7527L16.9969 15.3422C18.0588 13.9286 18.632 12.208 18.63 10.44C18.63 5.92406 14.9559 2.25 10.44 2.25C5.92406 2.25 2.25 5.92406 2.25 10.44C2.25 14.9559 5.92406 18.63 10.44 18.63C12.208 18.632 13.9286 18.0588 15.3422 16.9969L19.7527 21.4073C19.9759 21.6069 20.2671 21.7135 20.5664 21.7051C20.8658 21.6967 21.1506 21.574 21.3623 21.3623C21.574 21.1506 21.6967 20.8658 21.7051 20.5664C21.7135 20.2671 21.6069 19.9759 21.4073 19.7527ZM4.59 10.44C4.59 9.28298 4.9331 8.15194 5.5759 7.18992C6.21871 6.22789 7.13235 5.47808 8.2013 5.03531C9.27025 4.59253 10.4465 4.47668 11.5813 4.70241C12.7161 4.92813 13.7584 5.48529 14.5766 6.30343C15.3947 7.12156 15.9519 8.16393 16.1776 9.29872C16.4033 10.4335 16.2875 11.6098 15.8447 12.6787C15.4019 13.7476 14.6521 14.6613 13.6901 15.3041C12.7281 15.9469 11.597 16.29 10.44 16.29C8.88906 16.2881 7.40217 15.6712 6.30548 14.5745C5.2088 13.4778 4.59186 11.9909 4.59 10.44Z'
                    fill='black'
                  />
                </svg>
              </button>
            </div>

            {/* 카테고리 선택 */}
            <div className='relative flex items-center'>
              <input
                className='w-[15.375rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                placeholder='카테고리 선택'
              />
              <button className='absolute right-[1.25rem] cursor-pointer border-none bg-transparent'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M6 9L12 15L18 9'
                    stroke='black'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>

            {/* 활동 분류 선택 */}
            <div className='relative flex items-center'>
              <input
                className='w-[15.375rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                placeholder='활동 분류 선택'
              />
              <button className='absolute right-[1.25rem] cursor-pointer border-none bg-transparent'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M6 9L12 15L18 9'
                    stroke='black'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 카드 */}
        <div className='grid grid-cols-2 gap-[1.5rem]'>
          <div className='flex flex-col gap-[1.5rem] rounded-[1.25rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.5rem] shadow-[0px_4px_8px_0px_#00000033]'>
            {/* 제목, 날짜 */}
            <div className='flex items-center justify-between'>
              <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제목
              </span>
              <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
            </div>

            {/* 내용 + 태그 */}
            <div className='flex flex-col gap-[1.25rem]'>
              {/* 내용 */}
              <div className='line-height-[150%] text-[1rem] text-[#1A1A1A]'>
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
              </div>

              {/* 태그 */}
              <div className='flex items-center gap-[0.5rem]'>
                <div className='rounded-[3.75rem] border border-[#CDD0D5] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                  활동 A
                </div>

                <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                  >
                    <path
                      d='M5.34375 9C6.74172 9 7.875 7.86672 7.875 6.46875C7.875 5.07078 6.74172 3.9375 5.34375 3.9375C3.94578 3.9375 2.8125 5.07078 2.8125 6.46875C2.8125 7.86672 3.94578 9 5.34375 9Z'
                      fill='#464B53'
                    />
                    <path
                      d='M8.22656 10.4062C7.23656 9.90352 6.14391 9.70312 5.34375 9.70312C3.77648 9.70312 0.5625 10.6643 0.5625 12.5859V14.0625H5.83594V13.4975C5.83594 12.8296 6.11719 12.1598 6.60938 11.6016C7.00207 11.1558 7.55191 10.742 8.22656 10.4062Z'
                      fill='#464B53'
                    />
                    <path
                      d='M11.9531 10.125C10.1225 10.125 6.46875 11.2556 6.46875 13.5V15.1875H17.4375V13.5C17.4375 11.2556 13.7837 10.125 11.9531 10.125Z'
                      fill='#464B53'
                    />
                    <path
                      d='M11.9531 9C13.6618 9 15.0469 7.61488 15.0469 5.90625C15.0469 4.19762 13.6618 2.8125 11.9531 2.8125C10.2445 2.8125 8.85938 4.19762 8.85938 5.90625C8.85938 7.61488 10.2445 9 11.9531 9Z'
                      fill='#464B53'
                    />
                  </svg>
                  <span>대인관계</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-[1.5rem] rounded-[1.25rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.5rem] shadow-[0px_4px_8px_0px_#00000033]'>
            {/* 제목, 날짜 */}
            <div className='flex items-center justify-between'>
              <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제목
              </span>
              <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
            </div>

            {/* 내용 + 태그 */}
            <div className='flex flex-col gap-[1.25rem]'>
              {/* 내용 */}
              <div className='line-height-[150%] text-[1rem] text-[#1A1A1A]'>
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
              </div>

              {/* 태그 */}
              <div className='flex items-center gap-[0.5rem]'>
                <div className='rounded-[3.75rem] border border-[#CDD0D5] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                  활동 A
                </div>

                <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                  >
                    <path
                      d='M5.34375 9C6.74172 9 7.875 7.86672 7.875 6.46875C7.875 5.07078 6.74172 3.9375 5.34375 3.9375C3.94578 3.9375 2.8125 5.07078 2.8125 6.46875C2.8125 7.86672 3.94578 9 5.34375 9Z'
                      fill='#464B53'
                    />
                    <path
                      d='M8.22656 10.4062C7.23656 9.90352 6.14391 9.70312 5.34375 9.70312C3.77648 9.70312 0.5625 10.6643 0.5625 12.5859V14.0625H5.83594V13.4975C5.83594 12.8296 6.11719 12.1598 6.60938 11.6016C7.00207 11.1558 7.55191 10.742 8.22656 10.4062Z'
                      fill='#464B53'
                    />
                    <path
                      d='M11.9531 10.125C10.1225 10.125 6.46875 11.2556 6.46875 13.5V15.1875H17.4375V13.5C17.4375 11.2556 13.7837 10.125 11.9531 10.125Z'
                      fill='#464B53'
                    />
                    <path
                      d='M11.9531 9C13.6618 9 15.0469 7.61488 15.0469 5.90625C15.0469 4.19762 13.6618 2.8125 11.9531 2.8125C10.2445 2.8125 8.85938 4.19762 8.85938 5.90625C8.85938 7.61488 10.2445 9 11.9531 9Z'
                      fill='#464B53'
                    />
                  </svg>
                  <span>대인관계</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-[1.5rem] rounded-[1.25rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.5rem] shadow-[0px_4px_8px_0px_#00000033]'>
            {/* 제목, 날짜 */}
            <div className='flex items-center justify-between'>
              <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제목
              </span>
              <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
            </div>

            {/* 내용 + 태그 */}
            <div className='flex flex-col gap-[1.25rem]'>
              {/* 내용 */}
              <div className='line-height-[150%] text-[1rem] text-[#1A1A1A]'>
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
              </div>

              {/* 태그 */}
              <div className='flex items-center gap-[0.5rem]'>
                <div className='rounded-[3.75rem] border border-[#CDD0D5] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                  활동 A
                </div>

                <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                  >
                    <path
                      d='M5.34375 9C6.74172 9 7.875 7.86672 7.875 6.46875C7.875 5.07078 6.74172 3.9375 5.34375 3.9375C3.94578 3.9375 2.8125 5.07078 2.8125 6.46875C2.8125 7.86672 3.94578 9 5.34375 9Z'
                      fill='#464B53'
                    />
                    <path
                      d='M8.22656 10.4062C7.23656 9.90352 6.14391 9.70312 5.34375 9.70312C3.77648 9.70312 0.5625 10.6643 0.5625 12.5859V14.0625H5.83594V13.4975C5.83594 12.8296 6.11719 12.1598 6.60938 11.6016C7.00207 11.1558 7.55191 10.742 8.22656 10.4062Z'
                      fill='#464B53'
                    />
                    <path
                      d='M11.9531 10.125C10.1225 10.125 6.46875 11.2556 6.46875 13.5V15.1875H17.4375V13.5C17.4375 11.2556 13.7837 10.125 11.9531 10.125Z'
                      fill='#464B53'
                    />
                    <path
                      d='M11.9531 9C13.6618 9 15.0469 7.61488 15.0469 5.90625C15.0469 4.19762 13.6618 2.8125 11.9531 2.8125C10.2445 2.8125 8.85938 4.19762 8.85938 5.90625C8.85938 7.61488 10.2445 9 11.9531 9Z'
                      fill='#464B53'
                    />
                  </svg>
                  <span>대인관계</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
