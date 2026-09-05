'use client';

import { CommonButton } from '@/components/CommonButton';
import { CorrectionLoadingSpinner } from './CorrectionLoadingSpinner';

interface CorrectionAnalyzingViewProps {
  onLeaveClick: () => void;
  /* 생성 실패 시 true → 에러 문구 + 다시 시도하기 버튼 표시 */
  isError?: boolean;
  /* 다시 시도하기 클릭 시 호출 (생성 재요청) */
  onRetry?: () => void;
}

export function CorrectionAnalyzingView({
  onLeaveClick,
  isError = false,
  onRetry,
}: CorrectionAnalyzingViewProps) {
  return (
    <div className='flex flex-col items-center pt-[5.5rem]'>
      {!isError && <CorrectionLoadingSpinner size={64} />}
      <div
        className={`flex flex-col items-center text-center ${
          isError ? 'mt-[6.75rem]' : 'mt-[2.75rem]'
        }`}
      >
        {isError ? (
          <>
            <span className='text-[1.125rem] leading-[1.3] font-bold text-[#464B53]'>
              앗, 포트폴리오 첨삭 중 오류가 발생했어요.
            </span>
            <span className='text-[1.125rem] leading-[1.3] font-bold text-[#464B53]'>
              아래 버튼을 눌러 다시 시도해주세요.
            </span>
          </>
        ) : (
          <>
            <span className='text-[1.125rem] leading-[1.3] font-bold text-[#464B53]'>
              AI 컨설턴트가 포트폴리오 첨삭을 진행 중이에요.
            </span>
            <span className='text-[1.125rem] leading-[1.3] font-bold text-[#464B53]'>
              페이지를 떠나도 작업은 계속돼요.
            </span>
          </>
        )}
      </div>
      {isError && onRetry ? (
        <CommonButton
          variantType='Outline'
          px='2.25rem'
          py='0.5rem'
          className='mt-[3rem] text-[1rem] font-bold'
          onClick={onRetry}
        >
          다시 시도하기
        </CommonButton>
      ) : (
        <CommonButton
          variantType='Outline'
          px='2.25rem'
          py='0.5rem'
          className='mt-[3rem] text-[1rem] font-bold'
          onClick={onLeaveClick}
        >
          나가기
        </CommonButton>
      )}
    </div>
  );
}
