'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { cn } from '@/utils/utils';

interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginRequiredModal({ open }: LoginRequiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className={cn(
          'w-[calc(100vw-2rem)] max-w-[23.625rem] items-center gap-[1.75rem] px-[1.5rem] py-[2rem] text-center md:w-[23.625rem] md:px-[5rem] md:py-[3.75rem]',
          // 닫기 버튼 숨김
          '[&>button:last-child]:hidden',
        )}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className='flex flex-col items-center justify-center gap-[0.25rem] space-y-0'>
          <DialogTitle className='line-height-[130%] whitespace-nowrap text-center text-[1rem] font-bold text-[#1A1A1A] md:text-[1.125rem]'>
            로그인이 필요한 서비스입니다.
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
