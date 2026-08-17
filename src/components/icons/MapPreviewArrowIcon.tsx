/**
 * 활동 미리보기 모달의 좌우 넘김 버튼 아이콘.
 * 44×44, 흰색 60% 원 배경 + 그라데이션 테두리(1px, inner) + 흰색 화살표,
 * 드롭섀도우(X0 Y2 Blur4 Spread0 #000000 20%).
 * 왼쪽 화살표는 이 아이콘을 scale-x-[-1]로 뒤집어 쓴다.
 */
export const MapPreviewArrowIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='44'
      height='44'
      viewBox='0 0 44 44'
      fill='none'
      style={{ overflow: 'visible' }}
    >
      <g filter='url(#filter0_d_map_preview_arrow)'>
        <circle cx='22' cy='22' r='22' fill='white' fillOpacity='0.6' />
        <circle
          cx='22'
          cy='22'
          r='21.5'
          stroke='url(#paint0_linear_map_preview_arrow)'
        />
        <path
          d='M19 31L27 22L19 13'
          stroke='white'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_map_preview_arrow'
          x='-4'
          y='-2'
          width='52'
          height='52'
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
          <feOffset dy='2' />
          <feGaussianBlur stdDeviation='2' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_map_preview_arrow'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_map_preview_arrow'
            result='shape'
          />
        </filter>
        <linearGradient
          id='paint0_linear_map_preview_arrow'
          x1='0'
          y1='0'
          x2='34.2414'
          y2='21.2414'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='white' />
          <stop offset='1' stopColor='#F2F2F2' />
        </linearGradient>
      </defs>
    </svg>
  );
};
