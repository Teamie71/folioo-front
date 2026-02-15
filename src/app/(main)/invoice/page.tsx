import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import { PeriodDropdown } from '@/features/invoice/components/PeriodDropdown';
import { InvoiceTable } from '@/features/invoice/components/InvoiceTable';

export default function InvoicePage() {
  return (
    <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem] pt-[3.75rem]'>
      {/* 헤더 */}
      <div className='flex items-center gap-[1.25rem]'>
        <BackButton />

        <span className='text-[1.5rem] font-bold'>크레딧 거래 내역</span>
      </div>

      {/* 드롭다운 + 표 */}
      <div className='flex flex-col gap-[1.75rem]'>
        {/* 드롭다운 */}
        <div className='flex'>
          <PeriodDropdown />
        </div>

        {/* 표 */}
        <InvoiceTable />
      </div>
    </div>
  );
}
