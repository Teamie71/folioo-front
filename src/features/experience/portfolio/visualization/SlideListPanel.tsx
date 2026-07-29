import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/utils/utils';
import { VisualizationFailedIcon } from '@/components/icons/VisualizationFailedIcon';

export const SlideListPanel = ({
  isCollapsed,
  selectedIndex,
  setSelectedIndex,
}: {
  isCollapsed: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}) => {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 0 : '10.5rem',
        marginRight: isCollapsed ? 0 : '1.5rem',
        paddingLeft: isCollapsed ? 0 : '1.5rem',
        paddingRight: isCollapsed ? 0 : '0.5rem',
        paddingTop: isCollapsed ? 0 : '1.5rem',
        paddingBottom: isCollapsed ? 0 : '1.5rem',
        opacity: isCollapsed ? 0 : 1,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: 'hidden' }}
      className='bg-gray2 flex h-[42.1875rem] flex-col rounded-[0.75rem]'
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0.5rem;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E2E4E7;
          border-radius: 6.25rem;
        }
      `}</style>
      <div className='custom-scrollbar flex flex-col gap-[1.5rem] overflow-x-hidden overflow-y-auto pr-[1rem]'>
        {Array.from({ length: 15 }).map((_, i) => (
          <button
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type='button'
            onClick={() => setSelectedIndex(i)}
            className={cn(
              'flex h-[4.25rem] w-[7.5rem] shrink-0 cursor-pointer items-center justify-center rounded-[0.5rem] bg-white transition-all outline-none focus:outline-none focus-visible:outline-none',
              selectedIndex === i
                ? 'border-main border-[0.1875rem]'
                : 'border-gray5 border',
            )}
          >
            {i === 0 && (
              <motion.div
                animate={{ rotate: 720 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeOut',
                }}
                className='flex items-center justify-center'
              >
                <Image
                  src='/LoadingSpinnerIcon.svg'
                  alt='loading'
                  width={28}
                  height={28}
                />
              </motion.div>
            )}
            {i === 1 && <VisualizationFailedIcon />}
          </button>
        ))}
        {/* Bottom padding spacing for scroll area */}
        <div className='h-[1.5rem] shrink-0' />
      </div>
    </motion.div>
  );
};
