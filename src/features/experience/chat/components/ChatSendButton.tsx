import { ChatSendIcon } from '@/components/icons/ChatSendIcon';

interface ChatSendButtonProps {
  onClick?: () => void;
}

export const ChatSendButton = ({ onClick }: ChatSendButtonProps) => {
  return (
    <button
      type='button'
      className='mr-[0.25rem] flex cursor-pointer items-center justify-center'
      onClick={onClick}
    >
      <ChatSendIcon />
    </button>
  );
};
