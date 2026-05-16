'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/utils';

export const PortfolioVisualizationSwitchToggle = () => {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className='h-[1.875rem] w-[9.625rem]'
    >
      <TabsList className='bg-gray3 grid h-full w-full grid-cols-2 rounded-[0.25rem] p-0 font-semibold'>
        <TabsTrigger
          value='text'
          className={cn(
            'relative h-full cursor-pointer rounded-[0.25rem] shadow-none transition-all',
            'typo-c1-b',
            activeTab === 'text' ? 'text-white' : 'text-gray6',
          )}
        >
          {activeTab === 'text' && (
            <motion.div
              layoutId='pill'
              className='bg-main absolute inset-0 rounded-[0.25rem]'
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.2 }}
            />
          )}
          <span className='relative z-10'>텍스트</span>
        </TabsTrigger>
        <TabsTrigger
          value='visual'
          className={cn(
            'relative h-full cursor-pointer rounded-[0.25rem] shadow-none transition-all',
            'typo-c1-b',
            activeTab === 'visual' ? 'text-white' : 'text-gray6',
          )}
        >
          {activeTab === 'visual' && (
            <motion.div
              layoutId='pill'
              className='bg-main absolute inset-0 rounded-[0.25rem]'
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.2 }}
            />
          )}
          <span className='relative z-10'>시각화</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
