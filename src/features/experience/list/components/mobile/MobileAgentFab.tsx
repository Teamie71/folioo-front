'use client';

import { cn } from '@/utils/utils';
import { ChatStartIcon } from '@/components/icons/ChatStartIcon';

export function MobileAgentFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'fixed right-[16px] bottom-[20px] z-[70] flex size-[48px] items-center justify-center rounded-[24px]',
        'to-main bg-gradient-to-b from-[#93b3f4] shadow-[0_4px_12px_rgba(80,96,197,0.35)]',
      )}
      aria-label='AI 에이전트'
    >
      <ChatStartIcon />
    </button>
  );
}
