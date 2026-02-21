'use client';

import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { CommonModal } from '@/components/CommonModal';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFirstFeedback: boolean; // 첫 피드백 여부
  onFeedbackClick: () => void;
}

export function OBTFeedbackModal({
  open,
  onOpenChange,
  isFirstFeedback,
  onFeedbackClick,
}: FeedbackModalProps) {
  const router = useRouter();

  const handleTopupClick = () => {
    onOpenChange(false);
    router.replace('/topup?noBack=1');
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      primaryBtnText='피드백 남기기'
      onPrimaryClick={onFeedbackClick}
      footer={
        <div className='flex flex-col items-start gap-[0.75rem]'>
          <CommonButton
            variantType='Outline'
            px='1.5rem'
            py='0.375rem'
            className='rounded-[0.375rem] hover:bg-[#E8EBFF]'
            onClick={onFeedbackClick}
          >
            피드백 남기기
          </CommonButton>
          {isFirstFeedback && (
            <p className='text-[0.75rem] leading-[1.5] text-[#9EA4A9]'>
              무의미한 피드백 (뜻을 알 수 없는 무의미한 문자 반복 등)은
              미참여로 분류되며, <br />
              본 이벤트는{' '}
              <button
              type='button'
              className='cursor-pointer underline bg-transparent border-none p-0 text-inherit'
              onClick={handleTopupClick}
            >
              이용권 구매
            </button>에서
              다시 확인 가능합니다.
            </p>
          )}
        </div>
      }
      className='max-w-[37.5rem] w-full items-start px-[4.5rem] py-[3.5rem] text-left'
      title={
        <span className='block text-left text-[1.5rem] font-bold text-[#1A1A1A]'>
          {isFirstFeedback
            ? '사용 후기 남기고, 추가 이용권 받으세요!'
            : 'Folioo 사용 후기를 알려주세요!'}
        </span>
      }
    >
      <div className='flex w-full flex-col'>
        {/* 본문 설명 영역 */}
        <div className='flex flex-col gap-[1.25rem] text-[1rem] leading-[1.6] text-[#1A1A1A]'>
          {isFirstFeedback ? (
            <>
              <p>
                이번 주의 첫 피드백을 남겨주시면,
                <br />
                감사의 마음을 담아{' '}
                <span className='font-bold'>경험 정리 1회권 + 포트폴리오 첨삭 1회권</span>을
                드려요.
              </p>
              <p>이용권은 2 영업일 이내에 지급돼요.</p>
              <p>
                Beta 기간의 베스트 피드백으로 선정된 분께는,
                <br />
                정식 출시 이후{' '}
                <span className='font-bold'>배민 1만원 상품권</span>을
                드려요!
              </p>
            </>
          ) : (
            <>
                <p>
                    피드백을 남겨주시면,
                    <br />
                    소중한 의견을 참고하여 더 나은 Folioo를 만들게요.
                </p>
                <p>
                    Beta 기간의 베스트 피드백으로 선정된 분께는,
                    <br />
                    정식 출시 이후{' '}
                    <span className='font-bold'>배민 1만원 상품권</span>을
                    드려요!
                </p>
          </>
          )}
        </div>
      </div>
    </CommonModal>
  );
}
