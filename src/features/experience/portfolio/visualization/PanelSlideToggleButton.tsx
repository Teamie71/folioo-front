import { PanelToggleIcon } from '@/components/icons/PanelToggleIcon';

export const PanelSlideToggleButton = ({
  onClick,
}: {
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className='group hover:bg-gray2 flex h-[2.25rem] w-[2.25rem] cursor-pointer items-center justify-center rounded-[0.25rem] transition-colors'
    >
      <PanelToggleIcon className='text-gray6 group-hover:text-gray9 transition-colors' />
    </div>
  );
};
