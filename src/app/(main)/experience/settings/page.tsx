import Link from 'next/link';

export default function ExperienceSettingsPage() {
  return (
    <div className='mx-auto mt-[2.5rem] w-[66rem] min-w-[66rem]'>
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
      <div className='flex flex-col gap-[0.75rem]'>
        {/* TODO: 프로그레스 바 애니메이션 */}
        <div className='h-[0.25rem] w-full rounded-[1.5rem] bg-[#E9EAEC]' />

        <div className='grid grid-cols-3 items-center'>
          {/* 설정 */}
          <div className='flex items-center gap-[0.5rem]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
            >
              <g clipPath='url(#clip0_3005_1201)'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10ZM11.5 5C11.5 4.80225 11.4413 4.60895 11.3314 4.44454C11.2215 4.28013 11.0654 4.15199 10.8827 4.07632C10.7 4.00065 10.4989 3.98085 10.305 4.01942C10.111 4.05798 9.93285 4.15319 9.793 4.293L7.793 6.293C7.61084 6.4816 7.51005 6.7342 7.51233 6.9964C7.5146 7.2586 7.61977 7.50941 7.80518 7.69482C7.99059 7.88023 8.2414 7.9854 8.5036 7.98767C8.7658 7.98995 9.0184 7.88916 9.207 7.707L9.5 7.414V15C9.5 15.2652 9.60536 15.5196 9.79289 15.7071C9.98043 15.8946 10.2348 16 10.5 16C10.7652 16 11.0196 15.8946 11.2071 15.7071C11.3946 15.5196 11.5 15.2652 11.5 15V5Z'
                  fill='#5060C5'
                />
              </g>
              <defs>
                <clipPath id='clip0_3005_1201'>
                  <rect width='20' height='20' fill='white' />
                </clipPath>
              </defs>
            </svg>
            <span className='text-[1rem] font-bold text-[#5060C5]'>설정</span>
          </div>

          {/* AI 대화 */}
          <div className='flex items-center gap-[0.5rem]'>
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
                d='M0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10ZM8.5 7.5C8.49978 7.25323 8.56045 7.01022 8.67663 6.7925C8.79281 6.57479 8.9609 6.3891 9.16602 6.2519C9.37113 6.11469 9.60693 6.03022 9.8525 6.00595C10.0981 5.98168 10.3458 6.01838 10.5738 6.11279C10.8018 6.20719 11.003 6.35639 11.1596 6.54716C11.3161 6.73793 11.4232 6.96437 11.4712 7.20641C11.5193 7.44845 11.507 7.69862 11.4352 7.93473C11.3635 8.17085 11.2346 8.38562 11.06 8.56L7.232 12.39C6.76343 12.8587 6.50014 13.4943 6.5 14.157V15C6.5 15.2652 6.60536 15.5196 6.79289 15.7071C6.98043 15.8946 7.23478 16 7.5 16H12.5C12.7652 16 13.0196 15.8946 13.2071 15.7071C13.3946 15.5196 13.5 15.2652 13.5 15C13.5 14.7348 13.3946 14.4804 13.2071 14.2929C13.0196 14.1054 12.7652 14 12.5 14H8.525C8.54939 13.9258 8.59083 13.8583 8.646 13.803L12.475 9.975C12.882 9.568 13.1823 9.06691 13.3493 8.51613C13.5164 7.96535 13.545 7.38187 13.4327 6.81737C13.3204 6.25287 13.0707 5.72478 12.7055 5.27986C12.3404 4.83495 11.8712 4.48695 11.3394 4.26669C10.8077 4.04643 10.2298 3.9607 9.65703 4.0171C9.08424 4.0735 8.5342 4.27028 8.05562 4.59003C7.57705 4.90977 7.18472 5.34261 6.91337 5.85019C6.64202 6.35777 6.50004 6.92444 6.5 7.5C6.5 7.76522 6.60536 8.01957 6.79289 8.20711C6.98043 8.39464 7.23478 8.5 7.5 8.5C7.76522 8.5 8.01957 8.39464 8.20711 8.20711C8.39464 8.01957 8.5 7.76522 8.5 7.5Z'
                fill='#CDD0D5'
              />
            </svg>
            <span className='font-regular text-[1rem] text-[#9EA4A9]'>
              AI 대화
            </span>
          </div>

          {/* 포트폴리오 */}
          <div className='flex items-center gap-[0.5rem]'>
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
                d='M0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10ZM8 4C7.73478 4 7.48043 4.10536 7.29289 4.29289C7.10536 4.48043 7 4.73478 7 5C7 5.26522 7.10536 5.51957 7.29289 5.70711C7.48043 5.89464 7.73478 6 8 6H11L9.2 8.4C9.08857 8.54857 9.02072 8.72523 9.00404 8.91019C8.98736 9.09516 9.02252 9.28111 9.10557 9.44721C9.18863 9.61332 9.31629 9.75302 9.47427 9.85065C9.63225 9.94829 9.81429 10 10 10C10.3242 10 10.6435 10.0788 10.9305 10.2296C11.2174 10.3804 11.4634 10.5987 11.6473 10.8657C11.8311 11.1327 11.9473 11.4404 11.9858 11.7623C12.0244 12.0842 11.9841 12.4106 11.8684 12.7134C11.7528 13.0163 11.5653 13.2865 11.322 13.5008C11.0788 13.715 10.7871 13.867 10.472 13.9435C10.157 14.02 9.82814 14.0188 9.51369 13.94C9.19924 13.8611 8.90867 13.7071 8.667 13.491C8.5694 13.402 8.45513 13.3332 8.33079 13.2886C8.20645 13.2439 8.0745 13.2244 7.94256 13.2311C7.81063 13.2378 7.68133 13.2705 7.56212 13.3274C7.44292 13.3844 7.33618 13.4644 7.24806 13.5628C7.15994 13.6612 7.0922 13.7761 7.04875 13.9009C7.00529 14.0256 6.98698 14.1577 6.99488 14.2896C7.00278 14.4215 7.03672 14.5505 7.09476 14.6691C7.15279 14.7878 7.23377 14.8938 7.333 14.981C7.76068 15.3631 8.26554 15.6489 8.81333 15.8187C9.36113 15.9886 9.93906 16.0387 10.5079 15.9656C11.0768 15.8926 11.6233 15.698 12.1103 15.3952C12.5974 15.0923 13.0136 14.6883 13.3308 14.2104C13.648 13.7326 13.8587 13.1921 13.9487 12.6257C14.0386 12.0592 14.0057 11.4801 13.8522 10.9275C13.6987 10.3749 13.4281 9.86173 13.0588 9.42288C12.6896 8.98404 12.2302 8.62973 11.712 8.384L13.8 5.6C13.9114 5.45143 13.9793 5.27477 13.996 5.08981C14.0126 4.90484 13.9775 4.71889 13.8944 4.55279C13.8114 4.38668 13.6837 4.24698 13.5257 4.14935C13.3678 4.05171 13.1857 4 13 4H8Z'
                fill='#CDD0D5'
              />
            </svg>
            <span className='font-regular text-[1rem] text-[#9EA4A9]'>
              포트폴리오
            </span>
          </div>
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
          <div className='flex items-center gap-[1.25rem]'>
            <div className='font-regular cursor-pointer rounded-[3.75rem] border border-[#74777D] px-[1.75rem] py-[0.5rem] text-[1rem] text-[#1A1A1A]'>
              미정
            </div>
            <div className='font-regular cursor-pointer rounded-[3.75rem] border border-[#74777D] px-[1.75rem] py-[0.5rem] text-[1rem] text-[#1A1A1A]'>
              기획
            </div>
            <div className='font-regular cursor-pointer rounded-[3.75rem] border border-[#74777D] px-[1.75rem] py-[0.5rem] text-[1rem] text-[#1A1A1A]'>
              광고/마케팅
            </div>
            <div className='font-regular cursor-pointer rounded-[3.75rem] border border-[#74777D] px-[1.75rem] py-[0.5rem] text-[1rem] text-[#1A1A1A]'>
              디자인
            </div>
            <div className='font-regular cursor-pointer rounded-[3.75rem] border border-[#74777D] px-[1.75rem] py-[0.5rem] text-[1rem] text-[#1A1A1A]'>
              IT 개발
            </div>
            <div className='font-regular cursor-pointer rounded-[3.75rem] border border-[#74777D] px-[1.75rem] py-[0.5rem] text-[1rem] text-[#1A1A1A]'>
              영상/미디어
            </div>
            <div className='font-regular cursor-pointer rounded-[3.75rem] border border-[#74777D] px-[1.75rem] py-[0.5rem] text-[1rem] text-[#1A1A1A]'>
              데이터
            </div>
          </div>
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
      <Link href='/experience/settings/chat'>
        <button className='fixed bottom-[7.5rem] left-1/2 z-100 mx-auto flex -translate-x-1/2 cursor-pointer gap-[0.75rem] rounded-[6.25rem] border-none bg-[#5060C5] px-[2.25rem] py-[0.75rem]'>
          {/* TODO: 아이콘 추가 */}
          <div className='h-[1.5rem] w-[1.5rem] bg-[#FFFFFF]' />
          <span className='text-[1rem] font-bold text-[#FFFFFF]'>
            AI와 대화 시작하기
          </span>
        </button>
      </Link>
    </div>
  );
}
