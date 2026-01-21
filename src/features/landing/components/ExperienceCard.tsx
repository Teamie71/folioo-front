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
        <div className='rounded-[0.75rem] bg-[#FDFDFD] w-[20.25rem] h-[5.5rem] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)] text-center flex items-center justify-center'>
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

      {/* 카드 */}
      <div
        className='relative h-[19.25rem] w-[20.25rem] rounded-[1.75rem] px-[2rem]'
        style={{
          background: `linear-gradient(to ${cssDirection}, rgba(204, 219, 255, 0.8), rgba(246, 248, 255, 0.8))`,
          boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* 카드 번호 */}
        {number && (
          <div className='mt-[1.75rem] inline-block rounded-full bg-[#F6F5FF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#5060C5]'>
            {number}
          </div>
        )}

        {/* 카드 콘텐츠 */}
        <div className='absolute bottom-[2.5rem] left-[2rem] right-[2rem] text-[1.5rem] font-bold leading-[130%] text-[#1A1A1A]'>
          {children}
        </div>
      </div>
    </div>
  );
};