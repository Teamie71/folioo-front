import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { ModifyIcon } from '@/components/icons/ModifyIcon';

interface ModifyButtonProps {
  isModifying?: boolean;
  onClick?: () => void;
}

export const ModifyButton = ({
  isModifying = false,
  onClick,
}: ModifyButtonProps) => {
  return (
    <button
      onClick={onClick}
      className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent transition-opacity hover:opacity-80'
    >
      {isModifying ? <CheckCircleIcon /> : <ModifyIcon />}
    </button>
  );
};
