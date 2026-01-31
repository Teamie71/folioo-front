'use client';

import { useState, useRef, useEffect } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { ButtonProps } from '@/components/ui/Button';
import { cn } from '@/utils/utils';
import { useRouter } from 'next/navigation';

interface CreditExpireAlertProps
  extends Omit<ButtonProps, 'variant' | 'children'> {
  message: string;
  px?: string | number;
  py?: string | number;
  href?: string | number;
  expireDate?: string; // YYYY.MM.DD 형식
  expireCredits?: number; // 만료 예정 크레딧 수
}

export function CreditExpireAlert({
  className,
  message,
  px = '1.25rem',
  py = '0.5rem',
  expireDate = '2024.12.31',
  expireCredits = 10,
  ...props
}: CreditExpireAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div ref={containerRef} className='relative'>
      <CommonButton
        variantType='Cancel'
        px={px}
        py={py}
        className={cn(
          '!flex !items-center gap-[0.75rem] !rounded-[0.5rem] !border-[#DC0000] !bg-[#FFF2F2] !text-[#1A1A1A] !text-[1rem] !font-normal whitespace-nowrap [&_svg]:!h-[1.75rem] [&_svg]:!w-[1.75rem]',
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
          className='h-[1.75rem] w-[1.75rem] flex-shrink-0'
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
        <div className='absolute top-[calc(100%+0.75rem)] right-[-1rem] z-50 w-[28.7rem]'>
          {/* SVG 말풍선 */}
          <div className='relative h-[9.25rem] w-full'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='463'
              height='148'
              viewBox='0 0 463 148'
              fill='none'
              className='absolute inset-0 h-full w-full'
            >
              <g filter='url(#filter0_d_3242_5331)'>
                <path
                  d='M30 124C23.3726 124 18 118.627 18 112L18 47C18 40.3726 23.3726 35 30 35L398.087 35C398.121 34.9156 398.163 34.8323 398.211 34.75L410.768 13C411.537 11.6667 413.463 11.6667 414.232 13L426.789 34.75C426.837 34.8323 426.878 34.9156 426.913 35L433 35C439.627 35 445 40.3726 445 47L445 112C445 118.627 439.627 124 433 124L30 124Z'
                  fill='white'
                />
              </g>
              <defs>
                <filter
                  id='filter0_d_3242_5331'
                  x='0'
                  y='0'
                  width='463'
                  height='148'
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
                    result='effect1_dropShadow_3242_5331'
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
                    result='effect1_dropShadow_3242_5331'
                  />
                  <feBlend
                    mode='normal'
                    in='SourceGraphic'
                    in2='effect1_dropShadow_3242_5331'
                    result='shape'
                  />
                </filter>
              </defs>
            </svg>

            {/* 내용 영역 */}
            <div className='absolute inset-0 z-10 flex items-center justify-center px-[2.5rem] pt-[0.5rem]'>
              <div className='flex flex-col gap-[0.25rem] text-center'>
                <p className='text-[1rem] font-semibold text-[#1A1A1A]'>
                  {expireDate}에 {expireCredits}크레딧이 만료 예정이에요.
                </p>
                <p className='text-[0.875rem] text-[#74777D]'>
                  크레딧 결제 또는 획득 내역은{' '}
                  <button
                    type='button'
                    className='underline underline-offset-3 text-[#74777D] cursor-pointer'
                    onClick={() => {
                      router.push('/invoice');
                    }}
                  >
                    크레딧 거래 내역
                  </button>
                  을 확인해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
