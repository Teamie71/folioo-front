'use client';

import Link from 'next/link';
import { cn } from '@/utils/utils';
import { Card, CardContent, CardTitle, CardFooter } from './ui/Card';

interface PortfolioCardProps {
  title: string;
  tag: string;
  date: string;
  onClick?: () => void;
  href?: string;
  selected?: boolean;
  variant?: 'default' | 'white';
  rounded?: '1rem' | '1.25rem' | '1.75rem';
  className?: string;
}

export function PortfolioCard({
  title,
  tag,
  date,
  onClick,
  href,
  selected = false,
  variant = 'default',
  rounded = '1rem',
  className,
}: PortfolioCardProps) {
  const cardClassName = cn(
    // 클릭 가능한 경우 커서 포인터 및 호버 효과
    (onClick || href) &&
      'cursor-pointer transition-all hover:shadow-[0_0.5rem_1rem_0_#00000033]',
    // 선택된 경우 활성화 색상 (border와 배경색 변경)
    selected &&
      'border-[#5060C5] bg-[#F6F5FF] shadow-[0_0.25rem_0.5rem_0_#5060C533]',
    className,
  );

  const cardContent = (
    <Card
      variant={variant}
      rounded={rounded}
      className={cardClassName}
      onClick={onClick}
    >
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardFooter>
          <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
            {tag}
          </div>
          <span className='text-[1rem] text-[#74777D]'>{date}</span>
        </CardFooter>
      </CardContent>
    </Card>
  );

  // onClick이 있으면 선택 모드 (링크 없이 onClick만 사용)
  if (onClick) {
    return cardContent;
  }

  // href가 있으면 링크 모드 (Link로 감싸기)
  if (href) {
    return (
      <Link href={href} className='no-underline'>
        {cardContent}
      </Link>
    );
  }

  // 둘 다 없으면 일반 카드
  return cardContent;
}

