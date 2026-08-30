'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/utils/utils';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface BackButtonProps {
  href?: string;
  /**
   * href가 "진짜 뒤로가기"가 아니라 안전한 복귀 목적지일 때 true.
   * push 대신 replace를 써서 브라우저 뒤로가기로 이전 화면에 다시 들어가지 않게 한다.
   */
  replace?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BackButton({
  href,
  replace = false,
  onClick,
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      if (replace) router.replace(href);
      else router.push(href);
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
