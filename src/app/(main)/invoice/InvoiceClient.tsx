'use client';

import { useMemo } from 'react';
import { BackButton } from '@/components/BackButton';
import { PeriodDropdown } from '@/features/invoice/components/PeriodDropdown';
import {
  InvoiceTable,
  type InvoiceRow,
} from '@/features/invoice/components/InvoiceTable';
import { useUserControllerGetTicketHistory } from '@/api/endpoints/user/user';
import type { TicketHistoryItemResDTO } from '@/api/models';
import {
  TicketHistoryItemResDTOStatus,
  TicketHistoryItemResDTOType,
} from '@/api/models';
import InvoiceClientMobile from './InvoiceClientMobile';

function formatDate(iso: string | undefined): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function productNameFromType(type: TicketHistoryItemResDTOType): string {
  switch (type) {
    case TicketHistoryItemResDTOType.EXPERIENCE:
      return '경험 정리 1회권';
    case TicketHistoryItemResDTOType.PORTFOLIO_CORRECTION:
      return '포트폴리오 첨삭 1회권';
    default:
      return '-';
  }
}

function mapHistoryToInvoiceRow(item: TicketHistoryItemResDTO): InvoiceRow {
  const category =
    item.status === TicketHistoryItemResDTOStatus.USED
      ? ('사용' as const)
      : item.status === TicketHistoryItemResDTOStatus.EXPIRED
        ? ('만료' as const)
        : ('구매' as const);
  const date =
    category === '사용'
      ? formatDate(item.usedAt as string | undefined)
      : category === '만료'
        ? formatDate(item.expiredAt as string | undefined)
        : formatDate(item.createdAt);
  return {
    category,
    date,
    productName: productNameFromType(item.type),
    amount: null,
    refundStatus: null,
  };
}

export default function InvoiceClient({ isMobile }: { isMobile: boolean }) {
  const { data } = useUserControllerGetTicketHistory();
  const history = data?.result?.history ?? [];
  const tableData = useMemo<InvoiceRow[]>(
    () => history.map(mapHistoryToInvoiceRow),
    [history],
  );

  if (isMobile) {
    return <InvoiceClientMobile data={tableData} />;
  }

  return (
    <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem] pt-[3.75rem]'>
      {/* 헤더 */}
      <div className='flex items-center gap-[1.25rem]'>
        <BackButton />
        <span className='text-[1.5rem] font-bold'>이용권 거래 내역</span>
      </div>

      {/* 드롭다운 + 표 */}
      <div className='flex flex-col gap-[1.75rem]'>
        {/* 드롭다운 */}
        <div className='flex'>
          <PeriodDropdown />
        </div>

        {/* 표 */}
        <InvoiceTable data={tableData} />
      </div>
    </div>
  );
}
