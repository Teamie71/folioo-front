'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { Stamp } from '@/components/icons/StampIcon';
import { BigStamp } from '@/components/icons/BigStampIcon';
import { cn } from '@/utils/utils';
import { ChevronDown } from '@/components/icons/ChevronDownIcon';
import { OBTEventModalMobile } from '@/components/OBT/OBTEventModalMobile';
import { MobileBottomSheet } from '@/components/MobileBottomSheet';

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <span className={className}>
    <ChevronDown />
  </span>
);

export function ChallengeModalMobile({
  open,
  onOpenChange,
  currentCount = 1,
  hasWrittenToday = false,
  onLogClick,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  currentCount?: number;
  hasWrittenToday?: boolean;
  onLogClick?: () => void;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const handleEventModalButtonClick = () => {
    router.push('/experience/settings');
  };

  const handleLogClick = () => {
    onLogClick?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onOpenChange(false);
  };

  const handleRewardClick = () => {
    onOpenChange(false);
    setEventModalOpen(true);
  };

  const handleEventModalOpenChange = (open: boolean) => {
    setEventModalOpen(open);
    if (!open) onOpenChange(false);
  };

  const isRewardReady = currentCount >= 10;
  const buttonText = isRewardReady
    ? '보상 받기 →'
    : hasWrittenToday
      ? '확인'
      : '오늘의 로그 작성하기';
  const handlePrimaryClick = isRewardReady ? handleRewardClick : hasWrittenToday ? handleConfirm : handleLogClick;

  const titleText = isRewardReady
    ? '인사이트 로그 작성 챌린지 성공!'
    : hasWrittenToday
      ? '인사이트 로그 작성 챌린지 참여 완료!'
      : '인사이트 로그 작성 챌린지';

  const descriptionText = isRewardReady
    ? '보상을 받고, 작성한 인사이트를 활용해\n풍부한 경험 정리를 진행해보세요.'
    : hasWrittenToday
      ? `${10 - currentCount}개의 로그를 더 작성하고, 경험 정리 1회권을 받으세요.`
      : '4월 한 달간, 인사이트 로그 10개를 꾸준히 작성하시면\n경험 정리 1회권을 드려요!';

  return (
    <>
      {open && (
        <MobileBottomSheet
          open={open}
          onOpenChange={onOpenChange}
          zIndexClassName='z-50'
          heightClassName='h-[80vh]'
          contentBottomPaddingClassName='pb-[5rem]'
          footer={
            <CommonButton
              variantType='Execute'
              style={{ width: '20.5rem' }}
              className='rounded-[0.75rem] px-[6.125rem] py-[0.75rem] text-[1rem] font-bold hover:bg-[#4352B3]'
              onClick={handlePrimaryClick}
            >
              {buttonText}
            </CommonButton>
          }
        >
              {/* 헤더 */}
              <div className='flex flex-col gap-[0.75rem] mb-[2rem] mt-[0.5rem]'>
                <h2 className='text-[1.125rem] font-bold text-[#1A1A1A] text-left'>
                  {titleText}
                </h2>
                <p className='text-[0.875rem] font-medium text-[#464B53] whitespace-pre-line leading-[1.4]'>
                  {descriptionText}
                </p>
              </div>

            {/* 스탬프 보드 */}
            <div className='w-full flex flex-col mb-[2rem]'>
              <div className='relative w-full flex flex-col items-center'>
                {/* 배경 선 (수정된 SVG) */}
                <svg 
                  className="absolute left-1/2 -translate-x-1/2 top-[2.25rem] z-0" 
                  width="300" 
                  height="290" 
                  viewBox="0 0 300 290" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M250 97C262.996 97 275.459 91.9956 284.648 83.0876C293.838 74.1796 299 62.0978 299 49.5C299 36.9022 293.838 24.8204 284.648 15.9124C275.459 7.00445 262.996 2 250 2" stroke="#CDD0D5" strokeWidth="2"/>
                  <path d="M250 289C262.996 289 275.459 283.996 284.648 275.088C293.838 266.18 299 254.098 299 241.5C299 228.902 293.838 216.82 284.648 207.912C275.459 199.004 262.996 194 250 194" stroke="#CDD0D5" strokeWidth="2"/>
                  <path d="M50 97C37.0044 97 24.541 102.004 15.3518 110.912C6.16248 119.82 0.999998 131.902 0.999998 144.5C0.999997 157.098 6.16248 169.18 15.3518 178.088C24.541 186.996 37.0044 192 50 192" stroke="#CDD0D5" strokeWidth="2"/>
                  <line x1="50" y1="1" x2="250" y2="0.999983" stroke="#CDD0D5" strokeWidth="2"/>
                  <line x1="50" y1="193" x2="250" y2="193" stroke="#CDD0D5" strokeWidth="2"/>
                  <line x1="50" y1="97" x2="250" y2="97" stroke="#CDD0D5" strokeWidth="2"/>
                  <line x1="99" y1="289" x2="250" y2="289" stroke="#CDD0D5" strokeWidth="2"/>
                </svg>

                {/* 첫 번째 줄: 1 2 3 */}
                <div className='relative z-10 flex w-full justify-center gap-[1.75rem] mb-[1.5rem]'>
                  <StampSlot index={1} active={1 <= currentCount} />
                  <StampSlot index={2} active={2 <= currentCount} />
                  <StampSlot index={3} active={3 <= currentCount} />
                </div>

                {/* 두 번째 줄: 4 5 (왼쪽 정렬) */}
                <div className='relative z-10 flex w-full justify-center gap-[2rem] mb-[1.5rem]'>
                  <StampSlot index={5} active={5 <= currentCount} />
                  <StampSlot index={4} active={4 <= currentCount} />
                </div>

                {/* 세 번째 줄: 6 7 8 */}
                <div className='relative z-10 flex w-full justify-center gap-[1.75rem] mb-[1.5rem]'>
                  <StampSlot index={6} active={6 <= currentCount} />
                  <StampSlot index={7} active={7 <= currentCount} />
                  <StampSlot index={8} active={8 <= currentCount} />
                </div>

                {/* 네 번째 줄: 9 리워드 (오른쪽 정렬) */}
                <div className='relative z-10 flex w-full justify-center gap-[1.75rem]'>
                  <StampSlot index={10} active={currentCount >= 10} isReward />
                  <StampSlot index={9} active={currentCount >= 9} />
                </div>
              </div>
            </div>

            {/* 아코디언 가이드 */}
            <div className='space-y-3 mb-[1rem]'>
              <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-1 text-[0.875rem] font-bold text-[#1A1A1A] cursor-pointer'
              >
                <ChevronDownIcon className={cn('transition-transform duration-300', !isOpen && '-rotate-90')} />
                리워드 지급 및 인정 기준
              </button>
              {isOpen && (
                <div className='flex flex-col gap-[1rem]'>
                  <ul className='list-disc flex flex-col gap-[0.5rem] pl-[2.5rem] text-[0.75rem] text-[#464B53] leading-[1.5]'>
                    <li>이벤트 진행 기간 (2026년 4/1 ~ 4/31) 동안 <br />작성된 로그만 인정돼요.</li>
                    <li>하루에 인사이트 로그 1개만 작성 인정돼요.</li>
                  </ul>
                  <p className='text-[0.75rem] text-[#9EA4A9] pl-[0.5rem] leading-[1.5]'>
                    본 이벤트는{' '}
                    <Link
                      href='/topup'
                      className='cursor-pointer underline underline-offset-2'
                      onClick={() => onOpenChange(false)}
                    >
                      이용권 구매
                    </Link>
                    에서 다시 확인 가능합니다.
                  </p>
                </div>
              )}
            </div>
        </MobileBottomSheet>
      )}

      <OBTEventModalMobile
        open={eventModalOpen}
        onOpenChange={handleEventModalOpenChange}
        eventTitle='인사이트 로그 챌린지'
        eventSubTitle='보상 지급 완료'
        reward='경험 정리 1회권'
        validityMessage='지급된 이용권은 6개월 간 사용 가능해요.'
        buttonText='경험 정리하기'
        onButtonClick={handleEventModalButtonClick}
      />
    </>
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
          'z-20 flex h-[4.5rem] w-[4.5rem] flex-shrink-0 items-center justify-center rounded-full border-2 text-center text-[0.75rem] font-bold leading-tight border-[#5060C5] bg-[#F6F8FA] text-[#5060C5]'
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
      <div className='z-20 flex h-[4.5rem] w-[4.5rem] flex-shrink-0 items-center justify-center rounded-full bg-[#F6F8FA]'>
        <div className='flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full border border-[#E9EAEC]'>
          <Stamp />
        </div>
      </div>
    );
  }
  return (
    <div className='z-20 flex h-[4.5rem] w-[4.5rem] flex-shrink-0 items-center justify-center rounded-full bg-[#F6F8FA]'>
      <div className='flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full border border-[#E9EAEC]'>
        <span className='text-[1.25rem] font-bold text-[#CDD0D5]'>{index}</span>
      </div>
    </div>
  );
}