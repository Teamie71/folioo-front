'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/utils';
import { motion } from 'framer-motion';

type ViewMode = 'map' | 'list';

type Props = {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
};

export function ExperienceListViewSwitchToggle({
  value,
  onValueChange,
}: Props) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as ViewMode)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
        }
      }}
      className='h-[1.875rem] w-[9.875rem]'
    >
      <TabsList className='bg-gray3 grid h-full w-full grid-cols-2 rounded-[0.25rem] p-0 font-semibold'>
        <TabsTrigger
          value='map'
          className={cn(
            'relative h-full cursor-pointer rounded-[0.25rem] shadow-none transition-all',
            'typo-c1-b',
            value === 'map' ? 'text-white' : 'text-gray6',
          )}
        >
          {value === 'map' && (
            <motion.div
              layoutId='experience-list-view-pill'
              className='bg-main absolute inset-0 rounded-[0.25rem]'
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.2 }}
            />
          )}
          <span className='relative z-10'>맵 뷰</span>
        </TabsTrigger>
        <TabsTrigger
          value='list'
          className={cn(
            'relative h-full cursor-pointer rounded-[0.25rem] shadow-none transition-all',
            'typo-c1-b',
            value === 'list' ? 'text-white' : 'text-gray6',
          )}
        >
          {value === 'list' && (
            <motion.div
              layoutId='experience-list-view-pill'
              className='bg-main absolute inset-0 rounded-[0.25rem]'
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.2 }}
            />
          )}
          <span className='relative z-10'>리스트 뷰</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
