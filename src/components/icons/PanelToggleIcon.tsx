export const PanelToggleIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
      className={className}
    >
      <path
        d='M23.333 5H4.66634C3.37768 5 2.33301 5.89543 2.33301 7V21C2.33301 22.1046 3.37768 23 4.66634 23H23.333C24.6217 23 25.6663 22.1046 25.6663 21V7C25.6663 5.89543 24.6217 5 23.333 5Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M10.5 5V23' stroke='currentColor' strokeWidth='1.8' />
    </svg>
  );
};
