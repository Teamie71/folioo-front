'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { DropdownIcon } from '@/components/icons/DropdownIcon';
import { cn } from '@/utils/utils';

export type TermsAccordionItem = {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

type TermsAccordionProps = {
  items: TermsAccordionItem[];
  className?: string;
};

const contentTransition = { duration: 0.25, ease: 'easeInOut' as const };

export function TermsAccordion({ items, className }: TermsAccordionProps) {
  const [openValue, setOpenValue] = React.useState<string | undefined>();

  return (
    <Accordion
      type='single'
      collapsible
      value={openValue}
      onValueChange={setOpenValue}
      className={cn('w-full', className)}
    >
      {items.map((item) => {
        const isOpen = openValue === item.value;
        return (
          <AccordionItem
            key={item.value}
            value={item.value}
            className='border-b'
          >
            <AccordionPrimitive.Header className='flex items-center justify-between gap-2 py-4'>
              <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                {item.title}
              </span>
              <AccordionPrimitive.Trigger
                asChild
                className={cn(
                  'flex shrink-0 cursor-pointer items-center justify-center rounded border-none bg-transparent p-0 outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2 [&[data-state=open]>svg]:rotate-180',
                )}
              >
                <button
                  type='button'
                  aria-label='열기/닫기'
                  className='flex items-center justify-center'
                >
                  <DropdownIcon className='h-6 w-6 transition-transform duration-200' />
                </button>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content forceMount className='overflow-hidden'>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={contentTransition}
                    className='text-[1.125rem] leading-[150%]'
                  >
                    <div className='pb-4 pt-0'>{item.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AccordionPrimitive.Content>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
