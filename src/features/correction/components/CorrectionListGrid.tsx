'use client';

import { PortfolioCard } from '@/components/PortfolioCard';

export interface CorrectionListItem {
  title: string;
  tag: string;
  date: string;
  href: string;
}

interface CorrectionListGridProps {
  items: CorrectionListItem[];
}

export function CorrectionListGrid({ items }: CorrectionListGridProps) {
  return (
    <div className='grid grid-cols-2 gap-[1.5rem]'>
      {items.map((item) => (
        <PortfolioCard
          key={item.href + item.title}
          title={item.title}
          tag={item.tag}
          date={item.date}
          href={item.href}
        />
      ))}
    </div>
  );
}
