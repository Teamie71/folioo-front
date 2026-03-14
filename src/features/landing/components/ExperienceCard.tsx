import { ReactNode } from 'react';

type GradientDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface ExperienceCardProps {
  direction?: GradientDirection; // 그라디언트 방향 (기본값: 'bottom')
  label?: string; // 위쪽 박스에 표시될 텍스트
  number?: string; // 카드 좌측 상단 번호
  children?: ReactNode; // 카드 내부 콘텐츠
}

export const ExperienceCard = ({
  direction = 'bottom',
  label,
  number,
  children,
}: ExperienceCardProps) => {
  // 공백으로 스타일링 구분
  const cssDirection = direction.replace('-', ' ');

  return (
    <div className='flex flex-col items-center'>
      {/* 위쪽 멘트 박스 */}
      {label && (
        <div className='flex h-[3.5rem] w-[20.5rem] items-center justify-center rounded-[0.75rem] bg-[#FDFDFD] text-center shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)] md:h-[5.5rem] md:w-[20.25rem]'>
          <p className='text-[1.125rem] leading-[150%] text-[#000000]'>
            {label}
          </p>
        </div>
      )}

      {/* 연결선 */}
      {label && (
        <div className='flex flex-col items-center -mb-[1rem] z-10'>
          {/* 위쪽 선 */}
          <div className='h-[1.875rem] w-[0.125rem] bg-[#9EA4A9] opacity-50' />
          {/* 원형 노드 */}
          <div className='h-[0.75rem] w-[0.75rem] rounded-full bg-[#9EA4A9] opacity-50' />
        </div>
      )}

      {/* 카드: 모바일 20.5×9.75rem, radius 1rem, px/py 1.5/1.25rem */}
      <div
        className='relative h-[9.75rem] w-[20.5rem] rounded-[1rem] px-[1.5rem] py-[1.25rem] text-left md:h-[19.25rem] md:w-[20.25rem] md:rounded-[1.75rem] md:px-[2rem] md:pt-0'
        style={{
          background: `linear-gradient(to ${cssDirection}, rgba(204, 219, 255, 0.8), rgba(246, 248, 255, 0.8))`,
          boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* 카드 번호 (모바일 좌측, 데스크톱 좌상단) */}
        {number && (
          <div className='inline-block rounded-full bg-[#F6F5FF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#5060C5] md:mt-[1.75rem]'>
            {number}
          </div>
        )}

        {/* 카드 콘텐츠: 모바일 왼쪽 정렬·하단, 데스크톱 기존 */}
        <div className='absolute bottom-[1.25rem] left-[1.5rem] right-[1.5rem] flex flex-col items-start justify-end text-left text-[1.125rem] font-bold leading-[130%] text-[#1A1A1A] md:bottom-[2.5rem] md:left-[2rem] md:right-[2rem] md:top-auto md:text-[1.5rem]'>
          {children}
        </div>
      </div>
    </div>
  );
};