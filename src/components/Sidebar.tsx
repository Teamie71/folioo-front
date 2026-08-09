'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthControllerHandleLogout } from '@/api/endpoints/auth/auth';
import { useUserControllerGetProfile } from '@/api/endpoints/user/user';
import { LogoutModal } from '@/components/LogoutModal';
import { ProfileModal } from '@/components/ProfileModal';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/utils';

const SIDEBAR_WIDTH = {
  expanded: 240,
  collapsed: 60,
} as const;

const SIDEBAR_TRANSITION = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
};

type SidebarMenuItem = {
  label: string;
  href?: string;
  expandedIcon: string;
  collapsedIcon: string;
  expandedIconWidth?: number;
  expandedIconHeight?: number;
  collapsedIconWidth?: number;
  collapsedIconHeight?: number;
  disabled?: boolean;
};

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    label: '직무 추천',
    expandedIcon: '/sidebar/job-recommendation.svg',
    collapsedIcon: '/sidebar/job-recommendation-collapsed.svg',
    disabled: true,
  },
  {
    label: '경험 정리',
    href: '/experience',
    expandedIcon: '/sidebar/experience.svg',
    collapsedIcon: '/sidebar/experience-collapsed.svg',
    expandedIconWidth: 16,
    expandedIconHeight: 14.6667,
    collapsedIconWidth: 19.2,
    collapsedIconHeight: 17.6,
  },
  {
    label: '포트폴리오 첨삭',
    href: '/correction',
    expandedIcon: '/sidebar/correction.svg',
    collapsedIcon: '/sidebar/correction-collapsed.svg',
  },
  {
    label: '피드백',
    href: '/feedback',
    expandedIcon: '/sidebar/feedback.svg',
    collapsedIcon: '/sidebar/feedback-collapsed.svg',
  },
];

interface SidebarProps {
  defaultExpanded?: boolean;
}

type SidebarIconProps = {
  src: string;
  className?: string;
} &
  ({ size: number } | { width: number; height: number });

function SidebarIcon(props: SidebarIconProps) {
  const { src, className } = props;
  const width = 'size' in props ? props.size : props.width;
  const height = 'size' in props ? props.size : props.height;

  return (
    <Image src={src} alt='' width={width} height={height} className={className} />
  );
}

function MenuIcon({
  item,
  variant,
}: {
  item: SidebarMenuItem;
  variant: 'expanded' | 'collapsed';
}) {
  const frameSize = variant === 'expanded' ? 20 : 24;
  const src = variant === 'expanded' ? item.expandedIcon : item.collapsedIcon;
  const width =
    variant === 'expanded'
      ? (item.expandedIconWidth ?? frameSize)
      : (item.collapsedIconWidth ?? frameSize);
  const height =
    variant === 'expanded'
      ? (item.expandedIconHeight ?? frameSize)
      : (item.collapsedIconHeight ?? frameSize);

  // Figma 아이콘 프레임과 실제 벡터 크기가 다른 메뉴만 별도 크기를 둔다.
  return (
    <span
      className='flex shrink-0 items-center justify-center'
      style={{ width: frameSize, height: frameSize }}
    >
      <SidebarIcon src={src} width={width} height={height} />
    </span>
  );
}

function ExpandedMenuItem({
  item,
  top,
  active,
}: {
  item: SidebarMenuItem;
  top: number;
  active: boolean;
}) {
  const content = (
    <div
      className={cn(
        'flex h-[40px] w-[210px] items-center justify-between rounded-[4px] bg-white px-[8px]',
        item.disabled
          ? 'cursor-default'
          : cn('cursor-pointer hover:bg-gray2', active && 'bg-sub1'),
      )}
    >
      <div className='flex items-center gap-[8px]'>
        <MenuIcon item={item} variant='expanded' />
        <span className='typo-b2 text-gray9'>{item.label}</span>
      </div>
      {item.disabled ? (
        <span className='flex items-center rounded-[2px] bg-gray2 px-[4px] text-[0.75rem] leading-[150%] text-gray6'>
          준비중
        </span>
      ) : (
        <SidebarIcon
          src='/sidebar/chevron-right.svg'
          size={20}
          className='rotate-90'
        />
      )}
    </div>
  );

  return (
    <div className='absolute left-[15px]' style={{ top }}>
      {item.href ? <Link href={item.href}>{content}</Link> : content}
    </div>
  );
}

function CollapsedMenuItem({
  item,
  top,
  active,
}: {
  item: SidebarMenuItem;
  top: number;
  active: boolean;
}) {
  const content = (
    <div
      className={cn(
        'flex size-[36px] items-center justify-center rounded-[8px]',
        item.disabled
          ? 'cursor-default'
          : cn('cursor-pointer hover:bg-gray2', active && 'bg-sub1'),
      )}
    >
      <MenuIcon item={item} variant='collapsed' />
    </div>
  );

  return (
    <div className='absolute left-[12px]' style={{ top }}>
      {item.href ? <Link href={item.href}>{content}</Link> : content}
    </div>
  );
}

export default function Sidebar({
  defaultExpanded = false,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (state) => state.sessionRestoreAttempted,
  );
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isLoggedIn = accessToken != null;

  const { data: profileData } = useUserControllerGetProfile({
    query: { enabled: isLoggedIn },
  });
  const profile = profileData?.result;
  const socialEmail =
    (profile?.socialAccounts?.[0]?.socialEmail as unknown as string) || '';

  const finishLogout = () => {
    clearAuth();
    router.push('/');
  };

  const { mutate: logout } = useAuthControllerHandleLogout({
    mutation: {
      onSuccess: finishLogout,
      onError: finishLogout,
    },
  });

  const isActive = (href?: string) =>
    href != null &&
    (pathname === href || pathname.startsWith(`${href}/`));

  // 세션 복원 전에는 로그인 상태가 바뀌는 순간이 보여서 계정 영역을 숨긴다.
  const showAccount = sessionRestoreAttempted;

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isExpanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed,
      }}
      transition={SIDEBAR_TRANSITION}
      className={cn(
        'h-full shrink-0 overflow-hidden bg-white',
        isExpanded
          ? 'shadow-[0px_6px_20px_-2px_rgba(0,0,0,0.15)]'
          : 'border-r border-gray3',
      )}
      aria-label='사이드바'
    >
      {isExpanded ? (
        <div className='relative h-full w-[240px]'>
          <Image
            src='/sidebar/logo.svg'
            alt='Folioo'
            width={112}
            height={28}
            className='absolute top-[32px] left-[20px]'
          />
          <button
            type='button'
            onClick={() => setIsExpanded(false)}
            className='absolute top-[30px] right-[15px] flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] p-[4px] hover:bg-gray2'
            aria-label='사이드바 최소화'
          >
            <SidebarIcon src='/sidebar/sidebar-toggle.svg' size={22} />
          </button>

          <nav aria-label='주요 메뉴'>
            <ExpandedMenuItem
              item={MENU_ITEMS[0]}
              top={80}
              active={isActive(MENU_ITEMS[0].href)}
            />
            <ExpandedMenuItem
              item={MENU_ITEMS[1]}
              top={124}
              active={isActive(MENU_ITEMS[1].href)}
            />
            <ExpandedMenuItem
              item={MENU_ITEMS[2]}
              top={168}
              active={isActive(MENU_ITEMS[2].href)}
            />
            <ExpandedMenuItem
              item={MENU_ITEMS[3]}
              top={224}
              active={isActive(MENU_ITEMS[3].href)}
            />
          </nav>

          <Image
            src='/sidebar/divider.svg'
            alt=''
            width={201}
            height={1}
            className='absolute top-[215.5px] left-[19.5px]'
          />
          <Image
            src='/sidebar/divider.svg'
            alt=''
            width={201}
            height={1}
            className='absolute top-[271.5px] left-[19.5px]'
          />

          {showAccount &&
            (isLoggedIn ? (
              <button
                type='button'
                onClick={() => setIsProfileModalOpen(true)}
                className='absolute top-[288px] left-[20px] cursor-pointer text-left'
                aria-label='프로필 열기'
              >
                <span className='flex items-center gap-[8px]'>
                  <span className='typo-b2-b text-gray9'>
                    {profile?.name || '사용자'}
                  </span>
                  <span className='typo-c1 text-gray9'>님 프로필</span>
                  <SidebarIcon
                    src='/sidebar/profile-chevron.svg'
                    size={20}
                    className='rotate-90'
                  />
                </span>
                <span className='mt-[4px] flex items-center gap-[8px]'>
                  <SidebarIcon
                    src='/sidebar/profile-placeholder.svg'
                    size={20}
                  />
                  <span className='typo-c1 text-gray6'>{socialEmail}</span>
                </span>
              </button>
            ) : (
              <button
                type='button'
                onClick={() => router.push('/login')}
                className='absolute top-[288px] left-[20px] cursor-pointer text-left'
              >
                <span className='typo-b2-b text-gray9'>로그인</span>
                <span className='mt-[4px] block typo-c1 text-gray6'>
                  Folioo와 커리어 기록을 시작하세요.
                </span>
              </button>
            ))}

          {showAccount && isLoggedIn && (
            <button
              type='button'
              onClick={() => setIsLogoutModalOpen(true)}
              className='absolute bottom-[24px] left-[20px] flex cursor-pointer items-center gap-[6px]'
            >
              <SidebarIcon src='/sidebar/logout.svg' size={24} />
              <span className='typo-b2 text-gray9'>로그아웃</span>
            </button>
          )}

        </div>
      ) : (
        <div className='relative h-full w-[60px]'>
          <button
            type='button'
            onClick={() => setIsExpanded(true)}
            className='absolute top-[30px] left-[15px] size-[30px] cursor-pointer'
            aria-label='사이드바 최대화'
          >
            <SidebarIcon src='/sidebar/logo-symbol.svg' size={30} />
          </button>

          <nav aria-label='주요 메뉴'>
            <CollapsedMenuItem
              item={MENU_ITEMS[0]}
              top={82}
              active={isActive(MENU_ITEMS[0].href)}
            />
            <CollapsedMenuItem
              item={MENU_ITEMS[1]}
              top={126}
              active={isActive(MENU_ITEMS[1].href)}
            />
            <CollapsedMenuItem
              item={MENU_ITEMS[2]}
              top={170}
              active={isActive(MENU_ITEMS[2].href)}
            />
            <CollapsedMenuItem
              item={MENU_ITEMS[3]}
              top={226}
              active={isActive(MENU_ITEMS[3].href)}
            />
          </nav>

          <Image
            src='/sidebar/divider-collapsed.svg'
            alt=''
            width={45}
            height={1}
            className='absolute top-[215.5px] left-[7.5px]'
          />
          <Image
            src='/sidebar/divider-collapsed.svg'
            alt=''
            width={45}
            height={1}
            className='absolute top-[271.5px] left-[7.5px]'
          />
        </div>
      )}
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
      <LogoutModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={logout}
      />
    </motion.aside>
  );
}
