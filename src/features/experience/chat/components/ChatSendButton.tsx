import { ChatSendIcon } from '@/components/icons/ChatSendIcon';

interface ChatSendButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const ChatSendButton = ({
  onClick,
  disabled = false,
}: ChatSendButtonProps) => {
  return (
    <button
      type='button'
      disabled={disabled}
      className={`mr-[0.25rem] flex items-center justify-center transition-colors ${
        disabled
          ? 'cursor-default text-[#CDD0D5]'
          : 'cursor-pointer text-[#5060C5] hover:text-[#404D9E]'
      }`}
      onClick={onClick}
    >
      <ChatSendIcon />
    </button>
  );
};
