import { Checkbox } from '@/components/ui/checkbox';

export default function LogPage() {
  return (
    <div className='flex flex-col gap-[4.5rem] pb-[4.5rem]'>
      {/* 인사이트 로그 헤더 */}
      <div className='mx-auto flex h-[15.625rem] w-full min-w-[66rem] flex-col justify-center bg-[#F6F5FF]'>
        <div className='mx-auto flex min-w-[66rem] flex-col items-start gap-[1rem]'>
          <div className='flex items-center gap-[1rem]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 32 32'
              fill='none'
            >
              <path
                d='M29.0511 1.97333L29.8378 2.75999C30.9218 3.84533 30.7578 5.76933 29.4684 7.05733L13.2458 23.28L7.98976 25.2027C7.32976 25.4453 6.68709 25.1307 6.55643 24.5027C6.51241 24.2748 6.5332 24.0392 6.61643 23.8227L8.57643 18.5213L24.7538 2.34266C26.0431 1.05466 27.9671 0.887993 29.0511 1.97333ZM12.5378 3.58666C12.7129 3.58666 12.8862 3.62115 13.048 3.68815C13.2098 3.75516 13.3568 3.85337 13.4806 3.97718C13.6044 4.101 13.7026 4.24798 13.7696 4.40975C13.8366 4.57152 13.8711 4.7449 13.8711 4.91999C13.8711 5.09509 13.8366 5.26847 13.7696 5.43024C13.7026 5.59201 13.6044 5.73899 13.4806 5.8628C13.3568 5.98661 13.2098 6.08483 13.048 6.15183C12.8862 6.21884 12.7129 6.25333 12.5378 6.25333H7.20443C6.49718 6.25333 5.81891 6.53428 5.31881 7.03438C4.81871 7.53447 4.53776 8.21275 4.53776 8.91999V24.92C4.53776 25.6272 4.81871 26.3055 5.31881 26.8056C5.81891 27.3057 6.49718 27.5867 7.20443 27.5867H23.2044C23.9117 27.5867 24.59 27.3057 25.09 26.8056C25.5901 26.3055 25.8711 25.6272 25.8711 24.92V19.5867C25.8711 19.233 26.0116 18.8939 26.2616 18.6439C26.5117 18.3938 26.8508 18.2533 27.2044 18.2533C27.5581 18.2533 27.8972 18.3938 28.1472 18.6439C28.3973 18.8939 28.5378 19.233 28.5378 19.5867V24.92C28.5378 26.3345 27.9759 27.691 26.9757 28.6912C25.9755 29.6914 24.6189 30.2533 23.2044 30.2533H7.20443C5.78994 30.2533 4.43339 29.6914 3.43319 28.6912C2.433 27.691 1.87109 26.3345 1.87109 24.92V8.91999C1.87109 7.50551 2.433 6.14895 3.43319 5.14876C4.43339 4.14856 5.78994 3.58666 7.20443 3.58666H12.5378Z'
                fill='#1A1A1A'
              />
            </svg>
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
          <button className='text-bold cursor-pointer rounded-[6.25rem] bg-[#5060C5] px-[2.25rem] py-[0.75rem] text-[#ffffff]'>
            로그 등록하기
          </button>
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
              <input
                className='w-[28.5rem] rounded-[0.5rem] border-[0.1rem] border-[#74777D] px-[1.25rem] py-[0.75rem]'
                placeholder='제목 입력'
              />
            </div>

            <div className='flex flex-col gap-[0.5rem]'>
              <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                <span>활동명</span>
                <span className='text-[#DC0000]'>*</span>
              </div>
              <div className='relative flex items-center'>
                <input
                  className='w-[28.5rem] rounded-[0.5rem] border-[0.1rem] border-[#74777D] px-[1.25rem] py-[0.75rem]'
                  placeholder='활동명 입력 또는 선택'
                />
                <button className='absolute right-[1rem] cursor-pointer border-none bg-transparent'>
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

          {/* 카테고리 선택 */}
          <div className='flex flex-col gap-[1rem]'>
            <div className='flex flex-col gap-[0.75rem]'>
              <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                <span>카테고리</span>
                <span className='text-[#DC0000]'>*</span>
              </div>

              <div className='flex flex-col gap-[0.5rem]'>
                <div className='flex items-center gap-[0.75rem]'>
                  <Checkbox />
                  <span>템플릿 사용</span>
                </div>
                <span className='text-[0.875rem] text-[#74777D]'>
                  카테고리 맞춤 템플릿을 사용하여 인사이트를 체계적으로
                  기록하세요.
                </span>
              </div>
            </div>

            <div className='flex items-center gap-[1.25rem]'>
              <button className='flex cursor-pointer items-center gap-[1rem] rounded-[3.75rem] border border-[#9EA4A9] bg-[#FDFDFD] px-[1.5rem] py-[0.75rem] text-[1rem] text-[#1A1A1A]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M5.9375 10C7.4908 10 8.75 8.7408 8.75 7.1875C8.75 5.6342 7.4908 4.375 5.9375 4.375C4.3842 4.375 3.125 5.6342 3.125 7.1875C3.125 8.7408 4.3842 10 5.9375 10Z'
                    fill='#74777D'
                  />
                  <path
                    d='M9.14062 11.5625C8.04063 11.0039 6.82656 10.7812 5.9375 10.7812C4.19609 10.7812 0.625 11.8492 0.625 13.9844V15.625H6.48438V14.9973C6.48438 14.2551 6.79688 13.5109 7.34375 12.8906C7.78008 12.3953 8.39102 11.9355 9.14062 11.5625Z'
                    fill='#74777D'
                  />
                  <path
                    d='M13.2812 11.25C11.2473 11.25 7.1875 12.5063 7.1875 15V16.875H19.375V15C19.375 12.5063 15.3152 11.25 13.2812 11.25Z'
                    fill='#74777D'
                  />
                  <path
                    d='M13.2812 10C15.1797 10 16.7188 8.46098 16.7188 6.5625C16.7188 4.66402 15.1797 3.125 13.2812 3.125C11.3828 3.125 9.84375 4.66402 9.84375 6.5625C9.84375 8.46098 11.3828 10 13.2812 10Z'
                    fill='#74777D'
                  />
                </svg>
                <span>대인관계</span>
              </button>

              <button className='flex cursor-pointer items-center gap-[1rem] rounded-[3.75rem] border border-[#9EA4A9] bg-[#FDFDFD] px-[1.5rem] py-[0.75rem] text-[1rem] text-[#1A1A1A]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M9.99935 1.66675C8.45225 1.66675 6.96852 2.28133 5.87456 3.37529C4.7806 4.46925 4.16602 5.95299 4.16602 7.50008C4.16602 9.48341 5.15768 11.2251 6.66602 12.2834V14.1667C6.66602 14.3878 6.75381 14.5997 6.91009 14.756C7.06637 14.9123 7.27834 15.0001 7.49935 15.0001H12.4993C12.7204 15.0001 12.9323 14.9123 13.0886 14.756C13.2449 14.5997 13.3327 14.3878 13.3327 14.1667V12.2834C14.841 11.2251 15.8327 9.48341 15.8327 7.50008C15.8327 5.95299 15.2181 4.46925 14.1241 3.37529C13.0302 2.28133 11.5464 1.66675 9.99935 1.66675ZM7.49935 17.5001C7.49935 17.7211 7.58715 17.9331 7.74343 18.0893C7.89971 18.2456 8.11167 18.3334 8.33268 18.3334H11.666C11.887 18.3334 12.099 18.2456 12.2553 18.0893C12.4116 17.9331 12.4993 17.7211 12.4993 17.5001V16.6667H7.49935V17.5001Z'
                    fill='#74777D'
                  />
                </svg>
                <span>문제해결</span>
              </button>

              <button className='flex cursor-pointer items-center gap-[1rem] rounded-[3.75rem] border border-[#9EA4A9] bg-[#FDFDFD] px-[1.5rem] py-[0.75rem] text-[1rem] text-[#1A1A1A]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.125 10.5342V13.26C3.125 13.6935 3.24792 14.118 3.4795 14.4844C3.71108 14.8508 4.04182 15.144 4.43333 15.33L8.6 17.3083C8.90726 17.4543 9.24316 17.53 9.58333 17.53C9.9235 17.53 10.2594 17.4543 10.5667 17.3083L14.7333 15.33C15.1249 15.144 15.4556 14.8508 15.6872 14.4844C15.9188 14.118 16.0417 13.6935 16.0417 13.26V10.535L10.6458 13.2325C10.316 13.3975 9.95218 13.4834 9.58333 13.4834C9.21449 13.4834 8.85071 13.3975 8.52083 13.2325L3.125 10.5342Z'
                    fill='#74777D'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M9.07906 2.88657C9.39573 2.72824 9.76906 2.72824 10.0857 2.88657L17.3007 6.49407C18.1299 6.90824 18.1299 8.09157 17.3007 8.50657L10.0857 12.1149C9.76906 12.2732 9.39573 12.2732 9.07906 12.1149L1.86406 8.50657C1.0349 8.09157 1.0349 6.90824 1.86406 6.49407L9.07906 2.88657Z'
                    fill='#74777D'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M16.5237 6.80406C16.5977 6.65576 16.7276 6.54295 16.8849 6.49044C17.0421 6.43793 17.2137 6.45003 17.362 6.52406L19.0287 7.35739C19.1324 7.40938 19.2196 7.48923 19.2806 7.58798C19.3415 7.68674 19.3737 7.80052 19.3737 7.91656V10.8332C19.3737 10.999 19.3078 11.158 19.1906 11.2752C19.0734 11.3924 18.9144 11.4582 18.7487 11.4582C18.5829 11.4582 18.4239 11.3924 18.3067 11.2752C18.1895 11.158 18.1237 10.999 18.1237 10.8332V8.30323L16.8028 7.64239C16.6545 7.56835 16.5417 7.43843 16.4892 7.28121C16.4367 7.124 16.4496 6.95236 16.5237 6.80406Z'
                    fill='#74777D'
                  />
                </svg>
                <span>학습</span>
              </button>

              <button className='flex cursor-pointer items-center gap-[1rem] rounded-[3.75rem] border border-[#9EA4A9] bg-[#FDFDFD] px-[1.5rem] py-[0.75rem] text-[1rem] text-[#1A1A1A]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M3.84667 15.8334C3.46278 15.8334 3.1425 15.7051 2.88583 15.4484C2.62917 15.1917 2.50056 14.8712 2.5 14.4867V5.51341C2.5 5.12953 2.62861 4.80925 2.88583 4.55258C3.14306 4.29591 3.46306 4.1673 3.84583 4.16675H7.99667L9.66333 5.83341H16.1542C16.5375 5.83341 16.8578 5.96203 17.115 6.21925C17.3722 6.47647 17.5006 6.79675 17.5 7.18008V14.4876C17.5 14.8709 17.3717 15.1912 17.115 15.4484C16.8583 15.7056 16.5381 15.834 16.1542 15.8334H3.84667Z'
                    fill='#74777D'
                  />
                </svg>
                <span>레퍼런스</span>
              </button>

              <button className='flex cursor-pointer items-center gap-[1rem] rounded-[3.75rem] border border-[#9EA4A9] bg-[#FDFDFD] px-[1.5rem] py-[0.75rem] text-[1rem] text-[#1A1A1A]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <g clipPath='url(#clip0_3242_1984)'>
                    <path
                      d='M7.08268 4.58321L10.0289 1.63696L12.9752 4.58321L10.0293 7.52946L7.08268 4.58321ZM12.4993 9.99988L15.4456 7.05363L18.3918 9.99988L15.446 12.9461L12.4993 9.99988ZM1.66602 9.99988L4.61227 7.05363L7.55852 9.99988L4.61268 12.9461L1.66602 9.99988ZM7.08268 15.4165L10.0289 12.4703L12.9752 15.4165L10.0293 18.3628L7.08268 15.4165Z'
                      fill='#74777D'
                      stroke='#74777D'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_3242_1984'>
                      <rect width='20' height='20' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
                <span>기타</span>
              </button>
            </div>
          </div>

          {/* 내용 - 템플릿 미사용 */}
          <div className='flex flex-col gap-[0.5rem]'>
            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
              <span>내용</span>
              <span className='text-[#DC0000]'>*</span>
            </div>

            <div className='flex flex-col'>
              <textarea
                className='line-height-[160%] h-full rounded-[0.5rem] border border-[#74777D] px-[1.75rem] py-[1.25rem]'
                placeholder='오늘은 어떤 인사이트를 얻으셨나요?'
              />
              <span className='mt-[0.5rem] text-right'>0/250</span>
            </div>
          </div>

          {/* 내용 - 대인관계 템플릿 */}
          <div className='flex flex-col gap-[1.25rem]'>
            <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
              <span>내용</span>
              <span className='text-[#DC0000]'>*</span>
            </div>

            <div className='flex flex-col gap-[0.5rem]'>
              <div className='flex flex-col gap-[1.25rem]'>
                {/* 상황/대상 */}
                <div className='flex items-center justify-between'>
                  <span className='text-[1rem] text-[#1A1A1A]'>상황/대상</span>
                  <input
                    className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                    placeholder='누구와, 어떤 상황이 발생했나요?'
                  />
                </div>

                {/* 대응 */}
                <div className='flex items-center justify-between'>
                  <span className='text-[1rem] text-[#1A1A1A]'>대응</span>
                  <input
                    className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                    placeholder='나는 어떻게 대응했나요?'
                  />
                </div>

                {/* 결과 */}
                <div className='flex items-center justify-between'>
                  <span className='text-[1rem] text-[#1A1A1A]'>결과</span>
                  <input
                    className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                    placeholder='어떤 결과가 나타났나요?'
                  />
                </div>

                {/* 배운 점/계획 */}
                <div className='flex items-center justify-between'>
                  <span className='text-[1rem] text-[#1A1A1A]'>
                    배운 점/계획
                  </span>
                  <input
                    className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                    placeholder='무엇을 배웠고, 앞으로는 비슷한 상황에서 어떻게 대응할건가요?'
                  />
                </div>
              </div>

              <span className='text-right'>0/250</span>
            </div>
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
