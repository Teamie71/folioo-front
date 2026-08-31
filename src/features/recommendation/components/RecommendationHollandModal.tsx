'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { HOLLAND_TYPES } from '@/features/recommendation/constants';
import { cn } from '@/utils/utils';

interface RecommendationHollandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'web' | 'mobile';
}

const SCROLLBAR_HIDE_DELAY_MS = 800;

export function RecommendationHollandModal({
  open,
  onOpenChange,
  variant = 'web',
}: RecommendationHollandModalProps) {
  const isMobile = variant === 'mobile';
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) return;

    setIsScrolling(false);
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = null;
    }
  }, [open]);

  useEffect(
    () => () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    },
    [],
  );

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }
    scrollEndTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
      scrollEndTimerRef.current = null;
    }, SCROLLBAR_HIDE_DELAY_MS);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName='bg-black/40'
        className={cn(
          isMobile
            ? 'flex h-[28.25rem] w-[19.5rem] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[16px] px-[1.25rem] py-[1.25rem] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.2)]'
            : 'w-[43.125rem] max-w-[43.125rem] gap-0 rounded-[12px] px-[1.25rem] pt-[1.25rem] pb-[1.25rem] text-left shadow-modal',
        )}
      >
        <DialogHeader className='shrink-0 pr-[2rem] text-left'>
          <DialogTitle
            className={cn(
              'text-gray9',
              isMobile ? 'typo-b2-b leading-[150%]' : 'typo-h5',
            )}
          >
            전체 유형별 특성
          </DialogTitle>
        </DialogHeader>

        <div
          onScroll={isMobile ? handleScroll : undefined}
          className={cn(
            'flex flex-col gap-[0.75rem]',
            isMobile
              ? cn(
                  'mt-[1rem] min-h-0 flex-1 overflow-y-auto',
                  isScrolling ? 'mention-scroll pr-[0.25rem]' : 'scrollbar-hide',
                )
              : 'mt-[1rem]',
          )}
        >
          {HOLLAND_TYPES.map((type) => (
            <div key={type.code} className='flex flex-col'>
              <p
                className={cn(
                  'text-gray9',
                  isMobile ? 'typo-c1-sb' : 'typo-c1-b',
                )}
              >
                {type.name}
              </p>
              <p className='typo-c1 text-gray9'>{type.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
