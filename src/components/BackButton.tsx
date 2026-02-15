'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/utils/utils';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

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
      className={cn('cursor-pointer border-none bg-transparent', className)}
    >
      <ChevronLeftIcon />
    </button>
  );
}
