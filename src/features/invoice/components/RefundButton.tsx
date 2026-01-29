import { RefundButtonIcon } from '@/components/icons/RefundButtonIcon';
import Link from 'next/link';

export const RefundButton = () => {
  return (
    <Link href='/invoice/refund'>
      <button className='flex w-[5.7rem] cursor-pointer items-center gap-[0.375rem] rounded-[6.25rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[0.75rem] py-[0.375rem] text-[0.875rem] text-[#5060C5]'>
        <p>환불 신청</p>
        <RefundButtonIcon />
      </button>
    </Link>
  );
};
