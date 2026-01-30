import { BackButton } from '@/components/BackButton';
import { StepProgressBar } from '@/components/StepProgressBar';

export default function ExperienceSettingsChatPage() {
  return (
    <div className='mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]'>
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 헤더 */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-[1.25rem]'>
            <BackButton />
            <span className='text-[1.25rem] font-bold'>새로운 경험 정리</span>
          </div>

          <button className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='20'
              viewBox='0 0 18 20'
              fill='none'
            >
              <path
                d='M3.375 20C2.75625 20 2.22675 19.7826 1.7865 19.3478C1.34625 18.913 1.12575 18.3896 1.125 17.7778V3.89583C1.125 3.58517 0.87316 3.33333 0.5625 3.33333C0.25184 3.33333 0 3.08149 0 2.77083V2.11111C0 1.55883 0.447715 1.11111 1 1.11111H5.06944C5.37627 1.11111 5.625 0.86238 5.625 0.555556C5.625 0.248731 5.87373 0 6.18056 0H11.8194C12.1263 0 12.375 0.248731 12.375 0.555556C12.375 0.86238 12.6237 1.11111 12.9306 1.11111H17C17.5523 1.11111 18 1.55883 18 2.11111V2.77083C18 3.08149 17.7482 3.33333 17.4375 3.33333C17.1268 3.33333 16.875 3.58517 16.875 3.89583V17.7778C16.875 18.3889 16.6549 18.9122 16.2146 19.3478C15.7744 19.7833 15.2445 20.0007 14.625 20H3.375ZM14.625 4.33333C14.625 3.78105 14.1773 3.33333 13.625 3.33333H4.375C3.82272 3.33333 3.375 3.78105 3.375 4.33333V16.7778C3.375 17.3301 3.82272 17.7778 4.375 17.7778H13.625C14.1773 17.7778 14.625 17.3301 14.625 16.7778V4.33333ZM5.625 14.5556C5.625 15.1078 6.07272 15.5556 6.625 15.5556H6.875C7.42728 15.5556 7.875 15.1078 7.875 14.5556V6.55556C7.875 6.00327 7.42728 5.55556 6.875 5.55556H6.625C6.07272 5.55556 5.625 6.00327 5.625 6.55556V14.5556ZM10.125 14.5556C10.125 15.1078 10.5727 15.5556 11.125 15.5556H11.375C11.9273 15.5556 12.375 15.1078 12.375 14.5556V6.55556C12.375 6.00327 11.9273 5.55556 11.375 5.55556H11.125C10.5727 5.55556 10.125 6.00327 10.125 6.55556V14.5556Z'
                fill='#74777D'
              />
            </svg>
            <span className='text-[1rem] text-[#1A1A1A]'>삭제</span>
          </button>
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
