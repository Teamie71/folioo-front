'use client';

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
}

export function RecommendationHollandModal({
  open,
  onOpenChange,
}: RecommendationHollandModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'w-[43.125rem] max-w-[43.125rem] gap-0 rounded-[12px] px-[1.25rem] pt-[1.25rem] pb-[1.25rem] text-left shadow-modal',
        )}
      >
        <DialogHeader className='pr-[2rem] text-left'>
          <DialogTitle className='typo-h5 text-gray9'>
            전체 유형별 특성
          </DialogTitle>
        </DialogHeader>
        <div className='mt-[1rem] flex flex-col gap-[0.75rem]'>
          {HOLLAND_TYPES.map((type) => (
            <div key={type.code} className='flex flex-col'>
              <p className='typo-c1-b text-gray9'>{type.name}</p>
              <p className='typo-c1 text-gray9'>{type.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
