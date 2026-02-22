'use client';

import { CommonButton } from '@/components/CommonButton';

interface CorrectionAnalyzingViewProps {
  onLeaveClick: () => void;
}

export function CorrectionAnalyzingView({ onLeaveClick }: CorrectionAnalyzingViewProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-[2rem] py-[10rem]'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='56'
        height='60'
        viewBox='0 0 56 60'
        fill='none'
      >
        <path
          opacity='0.1'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M28 8C22.6957 8 17.6086 10.1071 13.8579 13.8579C10.1071 17.6086 8 22.6957 8 28C8 33.3043 10.1071 38.3914 13.8579 42.1421C17.6086 45.8929 22.6957 48 28 48C33.3043 48 38.3914 45.8929 42.1421 42.1421C45.8929 38.3914 48 33.3043 48 28C48 22.6957 45.8929 17.6086 42.1421 13.8579C38.3914 10.1071 33.3043 8 28 8ZM0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z'
          fill='#74777D'
        />
        <g
          className='animate-spin'
          style={{ transformOrigin: '28px 28px' }}
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M28.0007 8.00003C22.8444 7.989 17.8852 9.9805 14.1687 13.5547C13.3987 14.2666 12.3801 14.6477 11.3319 14.6159C10.2838 14.5841 9.29007 14.142 8.56467 13.3848C7.83927 12.6276 7.44023 11.6158 7.45344 10.5673C7.46666 9.51879 7.89108 8.51738 8.63534 7.7787C13.8408 2.77773 20.7822 -0.0105164 28.0007 2.98087e-05C29.0615 2.98087e-05 30.079 0.421457 30.8291 1.1716C31.5792 1.92175 32.0007 2.93916 32.0007 4.00003C32.0007 5.0609 31.5792 6.07831 30.8291 6.82846C30.079 7.5786 29.0615 8.00003 28.0007 8.00003Z'
            fill='url(#paint0_linear_correction_analyzing)'
          />
        </g>
        <defs>
          <linearGradient
            id='paint0_linear_correction_analyzing'
            x1='19.7269'
            y1='0'
            x2='19.7269'
            y2='14.6177'
            gradientUnits='userSpaceOnUse'
          >
            <stop stopColor='#93B3F4' />
            <stop offset='1' stopColor='#5060C5' />
          </linearGradient>
        </defs>
      </svg>
      <div className='flex flex-col items-center gap-[0.5rem] text-center'>
        <span className='text-[1.125rem] font-bold leading-[1.3] text-[#464B53]'>
          AI 컨설턴트가 포트폴리오 첨삭을 진행 중이에요.
        </span>
        <span className='text-[1.125rem] font-bold leading-[1.3] text-[#464B53]'>
          페이지를 떠나도 작업은 계속돼요.
        </span>
      </div>
      <CommonButton
        variantType='Outline'
        px='2.25rem'
        py='0.5rem'
        className='mt-[1rem] text-[1rem] font-semibold'
        onClick={onLeaveClick}
      >
        나가기
      </CommonButton>
    </div>
  );
}
