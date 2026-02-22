import { ChatSendIcon } from '@/components/icons/ChatSendIcon';

interface ChatSendButtonProps {
  onClick?: () => void;
}

export const ChatSendButton = ({ onClick }: ChatSendButtonProps) => {
  return (
    <button
      type='button'
      className='mr-[0.25rem] flex cursor-pointer items-center justify-center text-[#5060C5] transition-colors hover:text-[#404D9E]'
      onClick={onClick}
    >
      <ChatSendIcon />
    </button>
  );
};
