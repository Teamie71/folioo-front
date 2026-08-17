/** 맵 뷰 선택 삭제 상태 표시 (3-1 미선택 / 3-2 선택) */
export const MapBlockCheckIcon = ({
  selected,
  className,
}: {
  selected: boolean;
  className?: string;
}) => {
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
      <circle cx='9' cy='9' r='9' fill={selected ? '#5060C5' : '#FFFFFF'} />
      {!selected && <circle cx='9' cy='9' r='8.5' stroke='#CDD0D5' />}
      <path
        d='M5.25 9.15L7.8 11.55L12.75 6.6'
        stroke={selected ? '#FFFFFF' : '#CDD0D5'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
