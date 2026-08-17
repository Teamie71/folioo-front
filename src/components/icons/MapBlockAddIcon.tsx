export const MapBlockAddIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      aria-hidden
    >
      <rect width='14' height='14' rx='7' fill='#CDD0D5' />
      <line
        x1='3.75'
        y1='7'
        x2='10.25'
        y2='7'
        stroke='white'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <line
        x1='7'
        y1='3.75'
        x2='7'
        y2='10.25'
        stroke='white'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};
