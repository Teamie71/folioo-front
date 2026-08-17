/**
 * 개별 삭제 아이콘 (5-1-1).
 * 흰색 원형 배경 + 빨간 테두리 + 빨간 마이너스.
 */
export const MapBlockRemoveIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      aria-hidden
    >
      <circle cx='9' cy='9' r='8.25' fill='white' stroke='#DC0000' strokeWidth='1.5' />
      <line
        x1='5.25'
        y1='9'
        x2='12.75'
        y2='9'
        stroke='#DC0000'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};
