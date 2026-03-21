'use client';

import { useMemo } from 'react';
import { PeriodDropdown } from '@/features/invoice/components/PeriodDropdown';
import {
  InvoiceRow,
  InvoiceCategory,
  RefundStatus,
  RefundStatusCell,
} from '@/features/invoice/components/InvoiceTable';
import { cn } from '@/utils/utils';

interface InvoiceClientMobileProps {
  data: InvoiceRow[];
}

export default function InvoiceClientMobile({
  data,
}: InvoiceClientMobileProps) {
  // 날짜별로 그룹화 (YY.MM.DD)
  const groupedData = useMemo(() => {
    const groups: { [date: string]: InvoiceRow[] } = {};
    data.forEach((row) => {
      const dateKey = row.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(row);
    });
    // 날짜 역순 정렬
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [data]);

  return (
    <div className='mt-[1.5rem] flex flex-col px-[1rem]'>
      <div className='flex justify-end'>
        <PeriodDropdown />
      </div>

      <div className='flex flex-col gap-[2.5rem]'>
        {groupedData.map(([date, items]) => (
          <div key={date} className='flex flex-col gap-[1rem]'>
            <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
              {date}
            </span>
            <div className='flex flex-col gap-[0.75rem]'>
              {items.map((item, idx) => (
                <TransactionCard key={`${date}-${idx}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionCard({ item }: { item: InvoiceRow }) {
  const isPurchase = item.category === '구매';
  const isUsed = item.category === '사용';
  const isExpired = item.category === '만료';

  const categoryColor = isPurchase
    ? 'text-[#5060C5]'
    : isUsed
      ? 'text-[#464B53]'
      : 'text-[#CDD0D5]';

  return (
    <div className='flex flex-col gap-[1rem] rounded-[1rem] border border-[#CDD0D5] bg-white px-[1.25rem] py-[1rem] shadow-[0px_4px_12px_rgba(0,0,0,0.04)]'>
      <div className='flex items-start justify-between gap-[0.5rem]'>
        <span
          className={cn(
            'text-[1.125rem] leading-[150%] font-semibold',
            categoryColor,
          )}
        >
          {item.category}
        </span>
        <span className='typo-b2 text-gray9 flex-1 text-right'>
          {item.productName}
        </span>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-[1rem] leading-[150%] text-[#464B53]'>
          결제금액
        </span>
        <span className='text-[1rem] leading-[150%] font-bold text-[#1A1A1A]'>
          {item.refundStatus === 'gift'
            ? '증정 - 휴대폰 인증'
            : item.amount != null
              ? `₩ ${item.amount.toLocaleString()}`
              : '-'}
        </span>
      </div>

      <div className='flex justify-end'>
        <div className='text-[1.125rem]'>
          <RefundStatusCell
            category={item.category}
            status={item.refundStatus}
          />
        </div>
      </div>
    </div>
  );
}
