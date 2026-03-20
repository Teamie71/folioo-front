import { RefundButtonIcon } from '@/components/icons/RefundButtonIcon';
import Link from 'next/link';

export const RefundButton = () => {
  return (
    <Link
      href='/invoice/refund'
      className='inline-flex h-[2.125rem] cursor-pointer items-center gap-[0.375rem] rounded-[6.25rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[0.75rem] py-[0.25rem] text-center text-[0.875rem] font-semibold text-[#5060C5] transition-colors hover:bg-[#EEEDF7]'
    >
      <span>환불 신청</span>
      <RefundButtonIcon />
    </Link>
  );
};
