import { CheckSquareIcon } from '@/components/icons/CheckSquareIcon';
import { PointIcon1 } from './PointIcon1';
import { PointIcon2 } from './PointIcon2';
import { PointIcon3 } from './PointIcon3';
import type { ComponentType } from 'react';
import { useId } from 'react';

const pointIcons: Record<number, ComponentType<{ id?: string }>> = {
  1: PointIcon1,
  2: PointIcon2,
  3: PointIcon3,
};

const portfolioPoints: { number: number; line1: string; line2: string }[] = [
  { number: 1, line1: '지원 직무 &', line2: 'JD에 적합한 Fit 발굴' },
  {
    number: 2,
    line1: '명확한 가이드라인으로',
    line2: '빠른 포트폴리오 개선 가능',
  },
  { number: 3, line1: '심층 기업 분석 정보 제공', line2: '및 맞춤 첨삭' },
];

export const PortfoliloPoints = () => {
  const uniqueId = useId();
  return (
    <div className='mx-auto flex w-[20.5rem] flex-col gap-[1.5rem] md:w-[46.25rem]'>
      {portfolioPoints.map((point) => {
        const PointIcon = pointIcons[point.number];
        return (
          <div
            key={point.number}
            className='flex items-center justify-between rounded-[1.75rem] bg-[#FFFFFF] px-[1.75rem] py-[2rem] shadow-[2px_4px_12px_0px_rgba(0,0,0,0.2)_inset] md:px-[2.5rem] md:py-[1.75rem]'
          >
            <div className='flex flex-col gap-[0.75rem]'>
              <div className='flex items-center gap-[0.5rem]'>
                <CheckSquareIcon />
                <span className='text-[1.25rem] leading-[130%] font-bold text-[#9EA4A9]'>
                  POINT {point.number}.
                </span>
              </div>
              <h3 className='text-left text-[1.125rem] leading-[130%] font-bold text-[#5060C5] md:text-[1.5rem]'>
                <span className='md:hidden'>
                  {point.line1}
                  <br />
                  {point.line2}
                </span>
                <span className='hidden md:inline'>
                  {point.line1} {point.line2}
                </span>
              </h3>
            </div>
            <div className='flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center overflow-visible md:h-[6rem] md:w-[6rem] [&_svg]:h-full [&_svg]:w-full [&_svg]:flex-shrink-0'>
              {PointIcon ? (
                <PointIcon id={`${uniqueId}-${point.number}`} />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
