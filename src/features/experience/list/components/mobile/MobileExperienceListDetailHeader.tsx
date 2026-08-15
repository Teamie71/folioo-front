'use client';

import {
  MenuButton,
  type MenuItem,
} from '@/features/experience/list/components/ExperienceListMenu';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { KebabIcon } from '@/components/icons/KebabIcon';

type Props = {
  title?: string;
  onBack: () => void;
  menuItems?: MenuItem[];
  menuAriaLabel?: string;
};

export function MobileExperienceListDetailHeader({
  title = '나의 경험',
  onBack,
  menuItems,
  menuAriaLabel = '메뉴',
}: Props) {
  return (
    <header className='flex h-[56px] shrink-0 items-center justify-between px-[16px]'>
      <div className='flex min-w-0 flex-1 items-center gap-[8px]'>
        <button
          type='button'
          onClick={onBack}
          className='flex size-[24px] shrink-0 items-center justify-center'
          aria-label='뒤로가기'
        >
          <ChevronLeftIcon className='size-[24px]' />
        </button>
        <h1 className='typo-b1-sb text-gray9 truncate'>{title}</h1>
      </div>

      {menuItems && menuItems.length > 0 ? (
        <MenuButton
          items={menuItems}
          ariaLabel={menuAriaLabel}
          menuPlacement='bottom'
          menuAlign='end'
          className='text-gray9 flex size-[24px] items-center justify-center'
        >
          <span className='relative flex size-[16px] items-center justify-center'>
            <KebabIcon className='h-[10px] w-[2px]' />
          </span>
        </MenuButton>
      ) : (
        <span className='size-[24px]' aria-hidden />
      )}
    </header>
  );
}
