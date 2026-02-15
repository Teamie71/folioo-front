'use client';

import { cn } from '@/utils/utils';
import { Card } from './ui/Card';

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
        'flex cursor-pointer flex-col items-center gap-[0.25rem] border border-[#CDD0D5] bg-[#FFFFFF] p-[2.25rem] shadow-[0_0.25rem_0.5rem_0_#00000033] transition-all hover:shadow-[0_0.375rem_1.25rem_0_#00000033]',
        selected &&
          'border-[1.5px] border-[#5060C5] bg-[#F6F5FF] shadow-[0_0.25rem_0.5rem_0_#00000033] hover:shadow-[0_0.25rem_0.5rem_0_#00000033]',
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

