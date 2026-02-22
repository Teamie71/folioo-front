'use client';

import { ChatErrorIcon } from '@/components/icons/ChatErrorIcon';

export type ChatErrorType = 'capacity' | 'format' | 'charLimit';

const ERROR_MESSAGES: Record<ChatErrorType, string> = {
  capacity: '업로드 가능한 총 용량(10MB)을 초과했어요.',
  format: 'PDF, PNG, JPG 형식만 업로드 가능해요.',
  charLimit: '입력 가능한 최대 글자수 (400자)를 초과했어요.',
};

interface ChatErrorMessageProps {
  error: ChatErrorType | null;
  positionAboveRight?: boolean;
}

export const ChatErrorMessage = ({
  error,
  positionAboveRight = true,
}: ChatErrorMessageProps): React.ReactElement | null => {
  if (!error) return null;

  const message = ERROR_MESSAGES[error];
  const wrapperClass = positionAboveRight
    ? 'absolute bottom-full right-0 z-10 mb-3 flex justify-end'
    : 'flex justify-end';

  return (
    <div className={wrapperClass}>
      <div
        className='flex w-fit max-w-full items-center gap-2 rounded-2xl bg-[#F6F5FF] px-4 py-3 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]'
        role='alert'
      >
        <span className='flex h-6 w-6 shrink-0 items-center justify-center'>
          <ChatErrorIcon />
        </span>
        <span className='text-[1rem] font-semibold text-[#1F2937]'>
          {message}
        </span>
      </div>
    </div>
  );
};
