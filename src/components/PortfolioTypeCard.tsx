'use client';

import { cn } from '@/utils/utils';
import { Card } from './ui/card';

interface PortfolioTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PortfolioTypeCard({
  icon,
  title,
  description,
  selected = false,
  onClick,
  className,
}: PortfolioTypeCardProps) {
  return (
    <Card
      rounded="1.25rem"
      variant="white"
      className={cn(
        'flex cursor-pointer flex-col items-center gap-[0.25rem] border-2 p-[2.25rem] transition-all',
        selected
          ? 'border-[#5060C5] bg-[#F6F5FF]'
          : 'border-[#E9EAEC] hover:border-[#CDD0D5]',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex h-[80px] w-[80px] items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col items-center gap-[0.5rem] text-center">
        <span className="text-[1.125rem] font-bold text-[#1A1A1A]">
          {title}
        </span>
        <span className="pb-[0.5rem] text-[0.875rem] text-[#74777D]">
          {description}
        </span>
      </div>
    </Card>
  );
}

