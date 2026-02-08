import { RefundButtonIcon } from '@/components/icons/RefundButtonIcon';
import Link from 'next/link';
import { RefundButton } from './RefundButton';

export function InvoiceTable() {
  return (
    <div className='flex flex-col'>
      {/* 분류 */}
      <div className='flex w-full rounded-[0.5rem] bg-[#5060C5] py-[1.25rem] text-[1.125rem] font-semibold text-[#FFFFFF]'>
        <div className='w-[5.5rem] text-center'>분류</div>
        <div className='w-[9.5rem] px-[1.75rem]'>일시</div>
        <div className='w-[16rem] px-[1.75rem]'>상품명</div>
        <div className='flex w-[8.75rem] justify-end pr-[1.75rem]'>
          변동 크레딧
        </div>
        <div className='flex w-[8.75rem] justify-end pr-[1.75rem]'>
          결제금액
        </div>
        <div className='flex w-[8.75rem] justify-end pr-[1.75rem]'>
          잔여 크레딧
        </div>
        <div className='w-[8.75rem] text-center'>환불 상태</div>
      </div>

      {/* 내역 */}
      <div className='flex flex-col text-[1.125rem]'>
        <div className='flex flex-col'>
          <div className='flex'>
            <div className='w-[5.5rem] border-r-[0.125rem] border-[#F6F5FF] py-[1.25rem] text-center font-semibold'>
              충전
            </div>
            <div className='px-[1.75rem w-[9.5rem] border-r-[0.125rem] border-[#F6F5FF] py-[1.25rem] text-center'>
              2000.00.00
            </div>
            <div className='w-[16rem] border-r-[0.125rem] border-[#F6F5FF] px-[1.75rem] py-[1.25rem]'>
              700 크레딧 패키지
            </div>
            <div className='flex w-[8.75rem] justify-end border-r-[0.125rem] border-[#F6F5FF] py-[1.25rem] pr-[1.75rem]'>
              +700
            </div>
            <div className='flex w-[8.75rem] justify-end border-r-[0.125rem] border-[#F6F5FF] py-[1.25rem] pr-[1.75rem]'>
              ₩ 9,100
            </div>
            <div className='flex w-[8.75rem] justify-end border-r-[0.125rem] border-[#F6F5FF] py-[1.25rem] pr-[1.75rem]'>
              700
            </div>
            <div className='px-[1.575rem] py-[1.25rem]'>
              <RefundButton />
            </div>
          </div>
          <div className='w-full border border-[#CDD0D5]' />
        </div>
      </div>
    </div>
  );
}
