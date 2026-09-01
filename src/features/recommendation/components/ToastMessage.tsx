import { cn } from '@/utils/utils';

interface ToastMessageProps {
  open: boolean;
  message: string;
  variant?: 'web' | 'mobile';
}

export function ToastMessage({
  open,
  message,
  variant = 'web',
}: ToastMessageProps) {
  if (!open) return null;

  return (
    <div
      role='status'
      aria-live='polite'
      className={cn(
        'shadow-chat-card fixed left-1/2 z-50 -translate-x-1/2 rounded-[12px] border border-gray3 bg-sub1 px-[2rem] py-[1rem]',
        variant === 'mobile' ? 'bottom-[1.5rem]' : 'bottom-[2.5rem]',
      )}
    >
      <p className='typo-b2-sb whitespace-nowrap text-gray9'>{message}</p>
    </div>
  );
}
