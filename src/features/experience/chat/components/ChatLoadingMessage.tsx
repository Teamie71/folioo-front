'use client';

import { motion } from 'framer-motion';

const DOT_OFFSET = 6; // px 위로 이동
const DURATION = 0.6;
const STAGGER = 0.15;

export const ChatLoadingMessage = () => {
  return (
    <div className='flex items-end gap-[0.5rem]'>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className='h-[0.5rem] w-[0.5rem] rounded-full bg-[#CDD0D5]'
          animate={{ y: [0, -DOT_OFFSET, 0] }}
          transition={{
            duration: DURATION,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: i * STAGGER,
          }}
        />
      ))}
    </div>
  );
};

