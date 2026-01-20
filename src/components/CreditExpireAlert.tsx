import * as React from 'react';
import { cn } from '@/utils/utils';

interface CreditExpireAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
}

export const CreditExpireAlert = React.forwardRef<HTMLDivElement, CreditExpireAlertProps>(
  ({ className, message, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-[0.75rem] rounded-[0.5rem] border border-[#DC0000] bg-[#FFF2F2] px-[1.25rem] py-[0.5rem] whitespace-nowrap',
          className,
        )}
        {...props}
      >
        {/* 경고 아이콘 */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='28'
          height='28'
          viewBox='0 0 28 28'
          fill='none'
          className='h-[1.75rem] w-[1.75rem] flex-shrink-0'
        >
          <path
            d='M13.9997 2.33325C7.55618 2.33325 2.33301 7.55642 2.33301 13.9999C2.33301 20.4434 7.55618 25.6666 13.9997 25.6666C20.4432 25.6666 25.6663 20.4434 25.6663 13.9999C25.6663 7.55642 20.4432 2.33325 13.9997 2.33325ZM15.1663 19.8333H12.833V17.4999H15.1663V19.8333ZM15.1663 15.1666H12.833L12.2497 8.16659H15.7497L15.1663 15.1666Z'
            fill='#DC0000'
          />
        </svg>

        {/* 메시지 텍스트 */}
        <span className='text-[1rem] font-normal text-[#1A1A1A]'>
          {message}
        </span>
      </div>
    );
  },
);

CreditExpireAlert.displayName = 'CreditExpireAlert';
