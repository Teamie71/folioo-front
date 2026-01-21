'use client';

import { CommonButton } from '@/components/CommonButton';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ContentCardProps {
  title: string;
  description: ReactNode;
  buttonText: string;
}

export const ContentCard = ({
  title,
  description,
  buttonText,
}: ContentCardProps) => {
  return (
    <motion.div 
      className='flex h-[25.125rem] w-[21rem] flex-col items-center justify-center gap-[1.75rem] rounded-[1.75rem] bg-[#FCFCFF] shadow-[0px_4px_8px_0px_#00000033]'
      whileHover={{ 
        y: -8
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className='flex flex-col items-center justify-center gap-[1.5rem]'>
        <p className='text-[1.75rem] font-bold leading-[130%] text-[#000000]'>
          {title}
        </p>
        <div className='h-[7.5rem] w-[7.5rem] bg-[#D9D9D9]' />
        <p className='text-center text-[1rem] leading-[150%] text-[#000000]'>
          {description}
        </p>
      </div>
      <CommonButton variantType='Outline' px='2.25rem' py='0.5rem'>
        {buttonText}
      </CommonButton>
    </motion.div>
  );
};