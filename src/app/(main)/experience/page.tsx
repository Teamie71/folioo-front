import Link from 'next/link';

export default function ExperiencePage() {
  return (
    <div>
      {/* 경험정리 헤더 */}
      <div className='mx-auto flex h-[15.625rem] w-full min-w-[66rem] bg-[#F6F5FF]'>
        <div className='mx-auto flex min-w-[66rem] items-center justify-between'>
          {/* 경험정리 타이틀 */}
          <div>
            <div className='flex flex-col gap-[1.25rem]'>
              <div className='flex items-center gap-[1.125rem]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='1.75rem'
                  height='1.75rem'
                  viewBox='0 0 28 28'
                  fill='none'
                >
                  <path
                    d='M21 0H2.33333C1.04467 0 0 1.04467 0 2.33333V4.66667C0 5.95533 1.04467 7 2.33333 7H21C22.2887 7 23.3333 5.95533 23.3333 4.66667V2.33333C23.3333 1.04467 22.2887 0 21 0Z'
                    fill='black'
                  />
                  <path
                    d='M25.666 9.33337H6.99935C5.71068 9.33337 4.66602 10.378 4.66602 11.6667V14C4.66602 15.2887 5.71068 16.3334 6.99935 16.3334H25.666C26.9547 16.3334 27.9993 15.2887 27.9993 14V11.6667C27.9993 10.378 26.9547 9.33337 25.666 9.33337Z'
                    fill='black'
                  />
                  <path
                    d='M21 18.6666H2.33333C1.04467 18.6666 0 19.7113 0 21V23.3333C0 24.622 1.04467 25.6666 2.33333 25.6666H21C22.2887 25.6666 23.3333 24.622 23.3333 23.3333V21C23.3333 19.7113 22.2887 18.6666 21 18.6666Z'
                    fill='black'
                  />
                </svg>
                <span className='text-[1.5rem] font-bold'>경험 정리</span>
              </div>
              <span className='text-[1.125rem] leading-[150%] text-[#464B53]'>
                AI 비서 티미와의 채팅을 통해 경험을 체계적으로 정리해보세요.
                <br />
                채팅이 종료되면, 텍스트형 포트폴리오가 생성됩니다.
              </span>
            </div>
          </div>

          {/* 새로운 경험 정리 시작하기 버튼 */}
          <Link href='/experience/settings' className='no-underline'>
            <button className='flex cursor-pointer items-center gap-[0.5rem] rounded-[6.25rem] border border-[#FFFFFF] bg-[#FFFFFF] px-[2rem] py-[1.25rem] text-[1.125rem] text-[#1A1A1A] shadow-[0_0_0.5rem_0_#00000026]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1.5rem'
                height='1.5rem'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M18.8571 13.1429H13.1429V18.8571C13.1429 19.1602 13.0224 19.4509 12.8081 19.6653C12.5938 19.8796 12.3031 20 12 20C11.6969 20 11.4062 19.8796 11.1919 19.6653C10.9776 19.4509 10.8571 19.1602 10.8571 18.8571V13.1429H5.14286C4.83975 13.1429 4.54906 13.0224 4.33474 12.8081C4.12041 12.5938 4 12.3031 4 12C4 11.6969 4.12041 11.4062 4.33474 11.1919C4.54906 10.9776 4.83975 10.8571 5.14286 10.8571H10.8571V5.14286C10.8571 4.83975 10.9776 4.54906 11.1919 4.33473C11.4062 4.12041 11.6969 4 12 4C12.3031 4 12.5938 4.12041 12.8081 4.33473C13.0224 4.54906 13.1429 4.83975 13.1429 5.14286V10.8571H18.8571C19.1602 10.8571 19.4509 10.9776 19.6653 11.1919C19.8796 11.4062 20 11.6969 20 12C20 12.3031 19.8796 12.5938 19.6653 12.8081C19.4509 13.0224 19.1602 13.1429 18.8571 13.1429Z'
                  fill='#5060C5'
                />
              </svg>
              새로운 경험 정리 시작하기
            </button>
          </Link>
        </div>
      </div>

      {/* 나의 경험 */}
      <div className='mx-auto flex w-[66rem] flex-col gap-[3rem]'>
        <div className='flex flex-col gap-[2rem]'>
          <span className='text-[1.25rem] font-bold'>나의 경험</span>

          {/* 나의 경험 검색 */}
          <div className='relative flex items-center'>
            <input
              className='w-full rounded-[6.25rem] border border-[#74777D] bg-white px-[1.25rem] py-[0.75rem] text-[1rem]'
              placeholder='검색어를 입력하세요.'
            />
            <svg
              className='absolute right-[1.25rem] cursor-pointer'
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
          </div>
        </div>

        {/* 나의 경험 카드 
        TODO: 경험 카드 없을 때, 검색 결과 없을 때 문구
        */}
        <div className='grid grid-cols-2 gap-[1.5rem]'>
          <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
            <div className='flex flex-col gap-[1.25rem]'>
              <span className='text-[1.125rem]'>대중문화와 미디어 팀플</span>
              <div className='flex items-end justify-between'>
                <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                  기획
                </div>
                <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
              </div>
            </div>
          </div>
          <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
            <div className='flex flex-col gap-[1.25rem]'>
              <span className='text-[1.125rem]'>대중문화와 미디어 팀플</span>
              <div className='flex items-end justify-between'>
                <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                  기획
                </div>
                <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
              </div>
            </div>
          </div>
          <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
            <div className='flex flex-col gap-[1.25rem]'>
              <span className='text-[1.125rem]'>대중문화와 미디어 팀플</span>
              <div className='flex items-end justify-between'>
                <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                  기획
                </div>
                <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
