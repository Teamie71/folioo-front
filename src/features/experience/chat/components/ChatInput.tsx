'use client';

import { ChatSendButton } from './ChatSendButton';

interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
}

export const ChatInput = ({
  value = '',
  onChange,
  onSend,
}: ChatInputProps): React.ReactElement => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend?.();
    }
  };

  return (
    <div className='flex w-full items-center rounded-[2rem] bg-[#FDFDFD] px-[1.5rem] py-[1rem] shadow-[0px_1px_4px_0px_#0000001A] shadow-[inset_0px_2px_4px_0px_#00000040]'>
      <input
        className='font-regular w-full border-none bg-transparent text-[1rem] outline-none'
        placeholder='답변을 입력하거나 @를 입력하여 인사이트 로그를 멘션하세요.'
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <ChatSendButton onClick={onSend} />
    </div>
  );
};
