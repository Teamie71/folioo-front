interface ChatSendIconProps {
  className?: string;
}

export function ChatSendIcon({ className }: ChatSendIconProps) {
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <svg
        className='absolute'
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        viewBox='0 0 32 32'
        fill='none'
      >
        <circle cx='16' cy='16' r='16' fill='currentColor' />
      </svg>
      <svg
        className='absolute'
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
      >
        <path
          d='M10 17.5L10 2.91663'
          stroke='white'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M15.8327 8.33333L9.99935 2.5L4.16602 8.33333'
          stroke='white'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  );
}
