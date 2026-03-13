import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { ProfileButton } from '@/components/ProfileButton';
import { useState, useRef } from 'react';

const meta = {
  title: 'Components/Dropdowns/ProfileDropdown',
  component: ProfileDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// 프로필 버튼과 함께
export const Default: Story = {
  args: {
    open: false,
    onClose: () => {},
    triggerRef: { current: null },
    onProfileClick: () => {},
    onLogoutClick: () => {},
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div className='h-[300px] p-8'>
        <ProfileButton
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
        />
        <ProfileDropdown
          open={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
          onProfileClick={() => {
            alert('프로필 클릭!');
            setIsOpen(false);
          }}
          onLogoutClick={() => {
            alert('로그아웃 클릭!');
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
};
