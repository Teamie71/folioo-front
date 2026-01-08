'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/utils/utils';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function BackButton({ href, onClick, className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'cursor-pointer border-none bg-transparent',
        className,
      )}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='28'
        height='28'
        viewBox='0 0 28 28'
        fill='none'
      >
        <path
          d='M18 23L9 14L18 5.00001'
          stroke='black'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </button>
  );
}

