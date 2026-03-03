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
          'w-[23.625rem] items-center gap-[1.75rem] px-[5rem] py-[3.75rem] text-center',
          // 닫기 버튼 숨김
          '[&>button:last-child]:hidden',
        )}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className='flex flex-col items-center justify-center gap-[0.25rem] space-y-0'>
          <DialogTitle className='line-height-[130%] text-center text-[1.125rem] font-bold text-[#1A1A1A]'>
            로그인이 필요한 서비스입니다.
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
