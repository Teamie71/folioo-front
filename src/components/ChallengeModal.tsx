'use client';

import { useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { CommonModal } from '@/components/CommonModal';
import { Stamp } from '@/components/icons/Stamp';
import { BigStamp } from '@/components/icons/BigStamp';
import { cn } from '@/utils/utils';
import { ChevronDown } from '@/components/icons/ChevronDown';

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <span className={className}>
    <ChevronDown />
  </span>
);

export function ChallengeModal({
  open,
  onOpenChange,
  currentCount = 3,
  hasWrittenToday = false,
  onLogClick,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  currentCount?: number;
  /** 오늘 인사이트 로그를 이미 작성했는지 여부. true면 버튼이 "확인"으로만 표시됨 */
  hasWrittenToday?: boolean;
  onLogClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogClick = () => {
    onLogClick?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      primaryBtnText={hasWrittenToday ? '확인' : '오늘의 로그 작성하기'}
      onPrimaryClick={hasWrittenToday ? handleConfirm : handleLogClick}
      footer={
        <div className='flex w-full flex-col items-start gap-[1rem]'>
          <CommonButton
            variantType='Execute'
            px='2.5rem'
            py='0.5rem'
            className='rounded-lg text-[1.125rem] font-semibold hover:bg-[#4352B3]'
            onClick={hasWrittenToday ? handleConfirm : handleLogClick}
          >
            {hasWrittenToday ? '확인' : '오늘의 로그 작성하기 →'}
          </CommonButton>
          <p className='text-[0.875rem] text-[#9EA4A9]'>
            본 이벤트는{' '}
            <span className='cursor-pointer underline'>이용권 구매</span>에서
            다시 확인 가능합니다.
          </p>
        </div>
      }
      className='max-w-[46.25rem] w-full items-start px-[3.75rem] py-[3.75rem] text-left'
      title={
        <div className='flex flex-col gap-[1.5rem]'>
          <h2 className='text-[1.5rem] font-bold text-[#1A1A1A] text-left'>
            인사이트 로그 작성 챌린지
          </h2>
          <p className='text-[1rem] font-medium text-[#1A1A1A]'>
            4월 한 달간, 인사이트 로그 10개를 꾸준히 작성하시면 경험 정리 1회권을 드려요!
          </p>
        </div>
      }
    >
      <div className='w-full flex flex-col mt-[1rem] gap-[2.5rem]'>
        {/* 스탬프 보드 컨테이너 */}
        <div className='relative w-full items-center flex flex-col gap-[1.875rem]'>
          {/* 첫 번째 줄: 1 2 3 4 5 */}
          <div className='relative flex items-center gap-[1.75rem]'>
            <div className='absolute left-0 right-0 top-1/2 z-0 h-[3px] -translate-y-1/2 bg-[#CDD0D5] w-[29rem]' />
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className='relative z-10'>
                <StampSlot index={n} active={n <= currentCount} />
              </div>
            ))}
            {/* 5번과 6번을 잇는 곡선 */}
            <svg
              className='absolute right-[1.5rem] top-[2.5rem] -mr-[2.25rem]'
              width={60}
              height={115}
              viewBox='0 0 60 115'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M-2.15386e-06 113.5C15.3826 113.5 30.1351 107.6 41.0122 97.098C51.8893 86.5959 58 72.3521 58 57.5C58 42.6479 51.8893 28.4041 41.0122 17.902C30.1351 7.39999 15.3826 1.5 1.05738e-05 1.5'
                stroke='#CDD0D5'
                strokeWidth={3}
              />
            </svg>
          </div>

          {/* 두 번째 줄: 리워드 9 8 7 6 */}
          <div className='relative flex items-center gap-[1.75rem]'>
            {/* 리워드~6번 뒤 일자선 (3px #CDD0D5) */}
            <div className='absolute left-0 right-0 top-1/2 z-0 h-[3px] -translate-y-1/2 bg-[#CDD0D5] w-[30rem]' />
            <StampSlot index={10} active={currentCount >= 10} isReward />
            <StampSlot index={9} active={currentCount >= 9} />
            <StampSlot index={8} active={currentCount >= 8} />
            <StampSlot index={7} active={currentCount >= 7} />
            <StampSlot index={6} active={currentCount >= 6} />
          </div>
        </div>

        {/* 아코디언 가이드 */}
        <div className='space-y-3'>
          <button
            type='button'
            onClick={() => setIsOpen(!isOpen)}
            className='flex items-center gap-1 text-[1rem] font-bold text-[#1A1A1A]'
          >
            <ChevronDownIcon className={cn('transition-transform duration-300', isOpen && 'rotate-180')} />
            리워드 지급 및 인정 기준
          </button>
          {isOpen && (
            <ul className='list-disc flex flex-col gap-[0.5rem] pl-[3.25rem] text-[0.875rem] text-[#464B53]'>
              <li>이벤트 진행 기간 (2026년 4/1 ~ 4/31) 동안 작성된 로그만 인정돼요.</li>
              <li>하루에 인사이트 로그 1개만 작성 인정돼요.</li>
            </ul>
          )}
        </div>
      </div>
    </CommonModal>
  );
}

function StampSlot({
  index,
  active,
  isReward,
}: {
  index: number;
  active: boolean;
  isReward?: boolean;
}) {
  if (isReward) {
    return (
      <div
        className={cn(
          'z-20 flex h-[6rem] w-[6rem] items-center justify-center rounded-full border-2 text-center text-[0.875rem] font-bold leading-tight border-[#5060C5] bg-[#F6F8FA] text-[#5060C5]'
        )}
      >
        {active ? (
          <BigStamp />
        ) : (
          <>
            경험 정리
            <br />
            1회권
          </>
        )}
      </div>
    );
  }
  if (active) {
    return (
    <div className='z-20 flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-[#F6F8FA]'>
        <div className='flex h-[4.375rem] w-[4.375rem] items-center justify-center rounded-full border border-[#E9EAEC]'>
            <Stamp />
        </div>
    </div>
    );
  }
  return (
    <div className='z-20 flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-[#F6F8FA]'>
      <div className='flex h-[4.375rem] w-[4.375rem] items-center justify-center rounded-full border border-[#E9EAEC]'>
        <span className='text-[1.5rem] font-bold text-[#CDD0D5]'>{index}</span>
      </div>
    </div>
  );
}
