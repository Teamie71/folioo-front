'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { RefundButton } from './RefundButton';

export type InvoiceCategory = '구매' | '만료' | '사용';
export type RefundStatus =
  | 'refund_request'
  | 'refund_completed'
  | 'gift'
  | null;

export interface InvoiceRow {
  category: InvoiceCategory;
  date: string;
  productName: string;
  amount: number | null;
  refundStatus: RefundStatus;
}

const SAMPLE_DATA: InvoiceRow[] = [
  {
    category: '구매',
    date: '2026.09.28',
    productName: '포트폴리오 첨삭 1회권',
    amount: 550,
    refundStatus: 'refund_request',
  },
  {
    category: '구매',
    date: '2026.09.28',
    productName: '경험 정리 3회권',
    amount: 2700,
    refundStatus: 'refund_completed',
  },
  {
    category: '만료',
    date: '2026.03.15',
    productName: '경험 정리 1회권 + 포트폴리오 첨삭 1회권',
    amount: null,
    refundStatus: null,
  },
  {
    category: '사용',
    date: '2026.03.15',
    productName: '경험 정리 1회권',
    amount: null,
    refundStatus: null,
  },
  {
    category: '구매',
    date: '2026.01.02',
    productName: '경험 정리 1회권',
    amount: 990,
    refundStatus: 'refund_request',
  },
  {
    category: '구매',
    date: '2025.12.01',
    productName: '700 크레딧 패키지',
    amount: 9100,
    refundStatus: null,
  },
  {
    category: '구매',
    date: '2025.11.15',
    productName: '경험 정리 1회권',
    amount: 990,
    refundStatus: 'gift',
  },
];

function RefundStatusCell({
  category,
  status,
}: {
  category: InvoiceCategory;
  status: RefundStatus;
}) {
  if (category !== '구매') return null;
  if (status === 'refund_completed') {
    return (
      <span className='text-[1.125rem] leading-[150%] text-[#74777D]'>
        환불 완료
      </span>
    );
  }
  if (status === 'gift') return null;
  return <RefundButton />;
}

interface InvoiceTableProps {
  data?: InvoiceRow[];
}

export function InvoiceTable({ data = SAMPLE_DATA }: InvoiceTableProps) {
  const columns: ColumnDef<InvoiceRow>[] = [
    {
      accessorKey: 'category',
      header: '분류',
      cell: ({ getValue }) => {
        const category = getValue() as InvoiceCategory;
        const isPurchase = category === '구매';
        const isUsed = category === '사용';
        const isExpired = category === '만료';
        const colorClass = isPurchase
          ? 'text-main'
          : isUsed
            ? 'text-gray9'
            : isExpired
              ? 'text-gray5'
              : 'text-gray6';
        return (
          <span className={`leading-[150%] font-semibold ${colorClass}`}>
            {category}
          </span>
        );
      },
    },
    {
      accessorKey: 'date',
      header: '일시',
      cell: ({ getValue }) => (
        <span className='text-gray9 leading-[150%]'>
          {(getValue() as string) || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'productName',
      header: '상품명',
      cell: ({ getValue }) => (
        <span className='text-gray9 leading-[150%]'>
          {(getValue() as string) || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: '결제금액',
      cell: ({ getValue, row }) => {
        const amount = getValue() as number | null;
        const isGift = row.original.refundStatus === 'gift';
        if (isGift) {
          return (
            <span className='text-gray9 text-[1.125rem] leading-[150%]'>
              증정 - 휴대폰 인증
            </span>
          );
        }
        return (
          <span className='text-gray9 text-[1.125rem] leading-[150%]'>
            {amount != null ? `₩ ${Number(amount).toLocaleString()}` : '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'refundStatus',
      header: '환불 상태',
      cell: ({ getValue, row }) => (
        <RefundStatusCell
          category={row.original.category}
          status={getValue() as RefundStatus}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='overflow-hidden rounded-t-[0.5rem]'>
      <table className='w-full border-collapse'>
        <colgroup>
          <col className='w-[5.5rem]' />
          <col className='w-[9.5rem]' />
          <col className='w-[28.25rem]' />
          <col className='w-[14rem]' />
          <col className='w-[8.75rem]' />
        </colgroup>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => (
                <th
                  key={header.id}
                  className={`bg-[#5060C5] py-[1.25rem] text-[1rem] leading-[150%] font-semibold text-white ${
                    i > 0 ? 'border-l-[0.0625rem]' : ''
                  } ${i === 0 ? 'rounded-tl-[0.5rem] rounded-bl-[0.5rem]' : ''} ${
                    i === headerGroup.headers.length - 1
                      ? 'rounded-tr-[0.5rem] rounded-br-[0.5rem]'
                      : ''
                  }`}
                >
                  <div className='flex justify-center'>
                    {header.column.columnDef.header as string}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className='border-b border-[#CDD0D5] bg-white'>
              {row.getVisibleCells().map((cell, i) => (
                <td
                  key={cell.id}
                  className={`py-[1.25rem] text-[1.125rem] leading-[150%] ${
                    i > 0 ? 'border-l border-[#E9EAEC]' : ''
                  } ${
                    i === 0
                      ? 'text-center'
                      : i === 1
                        ? 'text-center'
                        : i === 2
                          ? 'text-center'
                          : i === 3
                            ? 'pr-[1.75rem] text-right'
                            : 'text-center'
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
