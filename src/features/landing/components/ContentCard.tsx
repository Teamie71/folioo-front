'use client';

import { CommonButton } from '@/components/CommonButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ContentCardProps {
  title: string;
  /** 카드 중앙에 표시할 아이콘(SVG) 또는 컴포넌트 */
  icon?: ReactNode;
  description: ReactNode;
  buttonText: string;
  /** 버튼 클릭 시 이동할 경로. 지정 시 버튼이 해당 경로로 링크됩니다 */
  buttonHref?: string;
}

export const ContentCard = ({
  title,
  description,
  buttonText,
  icon,
  buttonHref,
}: ContentCardProps) => {
  return (
    <motion.div
      className='flex h-[25.125rem] w-[21rem] flex-col items-center justify-center gap-[1.75rem] rounded-[1.75rem] bg-[#FCFCFF] shadow-[0px_4px_8px_0px_#00000033]'
      whileHover={{
        y: -8,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className='flex flex-col items-center justify-center gap-[1.5rem]'>
        <p className='text-[1.75rem] leading-[130%] font-bold text-[#000000]'>
          {title}
        </p>
        <div className='flex h-[7.5rem] w-[7.5rem] shrink-0 items-center justify-center'>
          {icon ?? <div className='h-full w-full bg-[#D9D9D9]' />}
        </div>
        <p className='text-center text-[1rem] leading-[150%] text-[#000000]'>
          {description}
        </p>
      </div>
      {buttonHref ? (
        <Link
          href={buttonHref}
          className='inline-flex cursor-pointer items-center justify-center rounded-[6.25rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[2.25rem] py-[0.5rem] text-[1rem] font-semibold text-[#5060C5]'
        >
          {buttonText}
        </Link>
      ) : (
        <CommonButton variantType='Outline' px='2.25rem' py='0.5rem'>
          {buttonText}
        </CommonButton>
      )}
    </motion.div>
  );
};
