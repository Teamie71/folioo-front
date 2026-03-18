'use client';

import { useState, useRef, useEffect } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { ButtonProps } from '@/components/ui/Button';
import { cn } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { OBTRedirectModal } from '@/components/OBT/OBTRedirectModal';
import { useUserControllerGetExpiringTickets } from '@/api/endpoints/user/user';
import { useAuthStore } from '@/store/useAuthStore';

/** API 만료일 값을 YYYY.MM.DD 문자열로 변환 */
function formatExpireDate(
  value: string | { [key: string]: unknown } | null | undefined
): string {
  if (value == null) return '-';
  if (typeof value === 'string') {
    const date = value.split('T')[0];
    return date ? date.replace(/-/g, '.') : '-';
  }
  return '-';
}

interface CreditExpireAlertProps
  extends Omit<ButtonProps, 'variant' | 'children'> {
  message: string;
  px?: string | number;
  py?: string | number;
  href?: string | number;
  /** 만료 예정 조회 기간(일). 기본 365 */
  expiringDays?: number;
  /** 만료 예정인 이용권이 없을 때 빈 공간을 차지하지 않고 아예 렌더링하지 않을지 여부 */
  hideWhenEmpty?: boolean;
  /** 최상위 wrapper div에 적용할 클래스 */
  wrapperClassName?: string;
}

export function CreditExpireAlert({
  className,
  message,
  px = '1.25rem',
  py = '0.75rem',
  expiringDays = 365,
  hideWhenEmpty = false,
  wrapperClassName,
  ...props
}: CreditExpireAlertProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: expiringData } = useUserControllerGetExpiringTickets(
    { days: expiringDays },
    { query: { enabled: !!accessToken } }
  );

  // 강제로 띄우기 위한 임시 코드 (테스트용)
  const hasExpiring = true;
  const experienceCount = 1;
  const portfolioCount = 1;
  const experienceExpireDate = '2026.03.18';
  const portfolioExpireDate = '2026.03.18';

  // 기존 로직 주석 처리
  // const result = expiringData?.result;
  // const experienceCount = result?.experience?.count ?? 0;
  // const portfolioCount = result?.portfolioCorrection?.count ?? 0;
  // const experienceExpireDate = formatExpireDate(
  //   result?.experience?.earliestExpiredAt as string | null | undefined
  // );
  // const portfolioExpireDate = formatExpireDate(
  //   result?.portfolioCorrection?.earliestExpiredAt as string | null | undefined
  // );
  // const hasExpiring = experienceCount > 0 || portfolioCount > 0;

  const [isOpen, setIsOpen] = useState(false);
  const [obtModalOpen, setObtModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!hasExpiring) {
    if (hideWhenEmpty) return null;
    return (
      <div
        className={cn('relative h-[2.75rem]', wrapperClassName)}
        aria-hidden
      />
    );
  }

  return (
    <div ref={containerRef} className={cn('relative', wrapperClassName)}>
      <CommonButton
        variantType='Cancel'
        px={px}
        py={py}
        className={cn(
          '!flex !items-center gap-[0.75rem] !rounded-[0.5rem] !border-none md:!border-solid md:!border-[#CDD0D5] !bg-[#FFF2F2] md:!text-[1rem] !text-[0.875rem] !font-normal whitespace-nowrap !text-[#1A1A1A]',
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {/* 경고 아이콘 */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='28'
          height='28'
          viewBox='0 0 28 28'
          fill='none'
          className='h-[1.25rem] w-[1.25rem] md:h-[1.75rem] md:w-[1.75rem] flex-shrink-0'
        >
          <path
            d='M13.9997 2.33325C7.55618 2.33325 2.33301 7.55642 2.33301 13.9999C2.33301 20.4434 7.55618 25.6666 13.9997 25.6666C20.4432 25.6666 25.6663 20.4434 25.6663 13.9999C25.6663 7.55642 20.4432 2.33325 13.9997 2.33325ZM15.1663 19.8333H12.833V17.4999H15.1663V19.8333ZM15.1663 15.1666H12.833L12.2497 8.16659H15.7497L15.1663 15.1666Z'
            fill='#DC0000'
          />
        </svg>

        {/* 메시지 텍스트 */}
        {message}
      </CommonButton>

      {/* 말풍선 팝오버 */}
      {isOpen && (
        <div className='absolute left-1/2 z-50 w-[22.75rem] -translate-x-1/2 md:left-[-1.125rem] md:w-[30rem] md:translate-x-0'>
          <div className='relative h-[9.9375rem] w-full md:h-[11.0625rem]'>
            {/* 데스크탑용 SVG */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='482'
              height='177'
              viewBox='0 0 482 177'
              fill='none'
              className='absolute inset-0 hidden h-full w-full md:block'
            >
              <g filter='url(#filter0_d_4539_3617)'>
                <path
                  d='M30 153C23.3726 153 18 147.627 18 141L18 47C18 40.3726 23.3726 35 30 35L54.0869 35C54.1215 34.9156 54.1634 34.8323 54.2109 34.75L66.7676 13C67.5374 11.6667 69.4626 11.6667 70.2324 13L82.7891 34.75C82.8366 34.8323 82.8785 34.9156 82.9131 35L452 35C458.627 35 464 40.3726 464 47L464 141C464 147.627 458.627 153 452 153L30 153Z'
                  fill='white'
                />
              </g>
              <defs>
                <filter
                  id='filter0_d_4539_3617'
                  x='0'
                  y='0'
                  width='482'
                  height='177'
                  filterUnits='userSpaceOnUse'
                  colorInterpolationFilters='sRGB'
                >
                  <feFlood floodOpacity='0' result='BackgroundImageFix' />
                  <feColorMatrix
                    in='SourceAlpha'
                    type='matrix'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                    result='hardAlpha'
                  />
                  <feMorphology
                    radius='2'
                    operator='erode'
                    in='SourceAlpha'
                    result='effect1_dropShadow_4539_3617'
                  />
                  <feOffset dy='6' />
                  <feGaussianBlur stdDeviation='10' />
                  <feComposite in2='hardAlpha' operator='out' />
                  <feColorMatrix
                    type='matrix'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'
                  />
                  <feBlend
                    mode='normal'
                    in2='BackgroundImageFix'
                    result='effect1_dropShadow_4539_3617'
                  />
                  <feBlend
                    mode='normal'
                    in='SourceGraphic'
                    in2='effect1_dropShadow_4539_3617'
                    result='shape'
                  />
                </filter>
              </defs>
            </svg>

            {/* 모바일용 SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="364" 
              height="159" 
              viewBox="0 0 364 159" 
              fill="none"
              className='absolute inset-0 block h-full w-full md:hidden'
            >
              <g filter="url(#filter0_d_6020_2909)">
                <path d="M30 135C23.3726 135 18 129.627 18 123L18 39C18 32.3726 23.3726 27 30 27L171.686 27L179.768 13C180.537 11.6667 182.463 11.6667 183.232 13L191.314 27L334 27C340.627 27 346 32.3726 346 39L346 123C346 129.627 340.627 135 334 135L30 135Z" fill="white"/>
              </g>
              <defs>
                <filter id="filter0_d_6020_2909" x="0" y="0" width="364" height="159" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6020_2909"/>
                  <feOffset dy="6"/>
                  <feGaussianBlur stdDeviation="10"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6020_2909"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6020_2909" result="shape"/>
                </filter>
              </defs>
            </svg>

            {/* 내용 영역 */}
            <div className='absolute inset-0 z-10 flex flex-col justify-center px-[1.5rem] pt-[0.25rem] md:px-[2.5rem]'>
              <ul className='list-none text-center text-[0.875rem] font-semibold text-[#1A1A1A] md:list-disc md:text-[1rem]'>
                {experienceCount > 0 && (
                  <li>
                    {experienceExpireDate} 경험 정리 {experienceCount}회 이용권
                    만료 예정
                  </li>
                )}
                {portfolioCount > 0 && (
                  <li>
                    {portfolioExpireDate} 포트폴리오 첨삭 {portfolioCount}회
                    이용권 만료 예정
                  </li>
                )}
              </ul>
              <p className='mt-[0.5rem] pl-[0.75rem] text-[0.75rem] text-[#74777D] md:pl-[1.75rem] md:text-[0.875rem]'>
                이용권 결제 또는 획득 내역은 {/* OBT 기간 동안 주석 처리 */}
                {/* <button
                  type='button'
                  className='cursor-pointer underline underline-offset-2 text-[#74777D]'
                  onClick={() => router.push('/invoice')}
                >
                  이용권 거래 내역
                </button> */}
                <button
                  type='button'
                  className='cursor-pointer text-[#74777D] underline underline-offset-2'
                  onClick={() => setObtModalOpen(true)}
                >
                  이용권 거래 내역
                </button>
                을 확인해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      <OBTRedirectModal open={obtModalOpen} onOpenChange={setObtModalOpen} />
    </div>
  );
}
