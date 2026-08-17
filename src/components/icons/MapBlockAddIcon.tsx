/**
 * 블록 추가 버튼 (5-2-1).
 * 흰색 원형 배경 + 회색 십자(8×8) + 드롭섀도우(X0 Y2 Blur6 Spread0 #0000001A).
 */
export const MapBlockAddIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      aria-hidden
      style={{ filter: 'drop-shadow(0px 2px 6px #0000001A)' }}
    >
      <circle cx='10' cy='10' r='10' fill='white' />
      <line
        x1='6'
        y1='10'
        x2='14'
        y2='10'
        stroke='#9EA4A9'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <line
        x1='10'
        y1='6'
        x2='10'
        y2='14'
        stroke='#9EA4A9'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};
