'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthControllerHandleLogout } from '@/api/endpoints/auth/auth';
import { useUserControllerGetProfile } from '@/api/endpoints/user/user';
import { HoverTooltip } from '@/components/HoverTooltip';
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
  collapsedActiveIcon?: string;
  disabled?: boolean;
  tooltip?: string;
};

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    label: '직무 추천',
    href: '/recommendation',
    expandedIcon: '/sidebar/job-recommendation.svg',
    collapsedIcon: '/sidebar/job-recommendation-hover.svg',
    collapsedActiveIcon: '/sidebar/job-recommendation-active.svg',
  },
  {
    label: '경험 정리',
    href: '/experience',
    expandedIcon: '/sidebar/experience.svg',
    collapsedIcon: '/sidebar/experience-collapsed.svg',
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

const EXPANDED_MENU_TOPS = [80, 124, 168, 224];
const COLLAPSED_MENU_TOPS = [82, 126, 170, 226];

interface SidebarProps {
  defaultExpanded?: boolean;
}

type SidebarIconProps = {
  src: string;
  className?: string;
} & ({ size: number } | { width: number; height: number });

function SidebarIcon(props: SidebarIconProps) {
  const { src, className } = props;
  const width = 'size' in props ? props.size : props.width;
  const height = 'size' in props ? props.size : props.height;

  return (
    <Image
      src={src}
      alt=''
      width={width}
      height={height}
      className={className}
    />
  );
}

function MenuIcon({
  item,
  collapsed = false,
  active = false,
}: {
  item: SidebarMenuItem;
  collapsed?: boolean;
  active?: boolean;
}) {
  const iconSize = collapsed ? 24 : 20;
  const icon =
    collapsed && active && item.collapsedActiveIcon
      ? item.collapsedActiveIcon
      : collapsed
        ? item.collapsedIcon
        : item.expandedIcon;
  const activeClass =
    collapsed && active && !item.collapsedActiveIcon
      ? 'sidebar-menu-icon-active'
      : undefined;

  if (collapsed && item.label === '직무 추천') {
    return (
      <span className='relative block size-[24px] shrink-0 overflow-hidden'>
        <Image
          src={icon}
          alt=''
          width={21.6}
          height={21.6}
          className='absolute top-[1.2px] left-[1.2px]'
        />
      </span>
    );
  }

  if (item.label === '경험 정리') {
    return (
      <span
        className={cn(
          'relative block shrink-0 overflow-hidden',
          collapsed ? 'size-[24px]' : 'size-[20px]',
        )}
      >
        <Image
          src={icon}
          alt=''
          width={collapsed ? 19.2 : 16}
          height={collapsed ? 17.6 : 14.6667}
          className={cn(
            'absolute',
            activeClass,
            collapsed ? 'top-[3.6px] left-[2.4px]' : 'top-[3px] left-[2px]',
          )}
        />
      </span>
    );
  }

  return <SidebarIcon src={icon} size={iconSize} className={activeClass} />;
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
        'group flex h-[40px] w-[210px] items-center justify-between rounded-[4px] bg-white px-[8px]',
        item.disabled
          ? 'cursor-default'
          : cn('hover:bg-gray2 cursor-pointer', active && 'bg-sub1'),
      )}
    >
      <div className='flex items-center gap-[8px]'>
        <MenuIcon item={item} active={active} />
        <span className='typo-b2 text-gray9'>{item.label}</span>
      </div>
      {item.disabled ? (
        <span className='bg-gray2 text-gray6 flex items-center rounded-[2px] px-[4px] text-[0.75rem] leading-[150%]'>
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

  const itemContent = item.disabled ? (
    <HoverTooltip label={item.tooltip ?? ''} wrapperClassName='block w-full'>
      {content}
    </HoverTooltip>
  ) : (
    <Link
      href={item.href ?? '#'}
      aria-current={active ? 'page' : undefined}
      className='block w-full'
    >
      {content}
    </Link>
  );

  return (
    <div className='absolute left-[15px]' style={{ top }}>
      {itemContent}
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
        'group flex size-[36px] items-center justify-center rounded-[8px]',
        item.disabled
          ? 'cursor-default'
          : cn('hover:bg-gray2 cursor-pointer', active && 'bg-sub1'),
      )}
    >
      <MenuIcon item={item} collapsed active={active} />
    </div>
  );

  const itemContent = item.href ? (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className='block'
    >
      {content}
    </Link>
  ) : (
    <HoverTooltip label={item.label} wrapperClassName='block'>
      {content}
    </HoverTooltip>
  );

  return (
    <div className='absolute left-[12px]' style={{ top }}>
      {item.href ? (
        <HoverTooltip label={item.label} wrapperClassName='block'>
          {itemContent}
        </HoverTooltip>
      ) : (
        itemContent
      )}
    </div>
  );
}

function SocialEmailLogo({ socialType }: { socialType?: string }) {
  const logo =
    socialType === 'KAKAO'
      ? '/KakaoEmailLogo.svg'
      : socialType === 'NAVER'
        ? '/NaverEmailLogo.svg'
        : socialType === 'GOOGLE'
          ? '/GoogleEmailLogo.svg'
          : null;

  return logo ? (
    <Image src={logo} alt='' width={20} height={20} />
  ) : (
    <SidebarIcon src='/sidebar/profile-placeholder.svg' size={20} />
  );
}

function ExpandedBrand({ onClick }: { onClick: () => void }) {
  return (
    <>
      <Image
        src='/sidebar/logo.svg'
        alt='Folioo'
        width={112}
        height={28}
        className='absolute top-[32px] left-[20px]'
      />
      <button
        type='button'
        onClick={onClick}
        className='hover:bg-gray2 absolute top-[30px] right-[15px] flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] p-[4px]'
        aria-label='사이드바 최소화'
      >
        <SidebarIcon src='/sidebar/sidebar-toggle.svg' size={20} />
      </button>
    </>
  );
}

function CollapsedBrand({ onClick }: { onClick: () => void }) {
  return (
    <HoverTooltip
      label='사이드바 열기'
      placement='bottom'
      wrapperClassName='absolute top-[29px] left-[14px] block size-[32px]'
    >
      <button
        type='button'
        onClick={onClick}
        className='group relative flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] p-[4px]'
        aria-label='사이드바 최대화'
      >
        <Image
          src='/sidebar/logo-symbol.svg'
          alt='Folioo'
          width={30}
          height={30}
          className='absolute transition-opacity group-hover:opacity-0'
        />
        <span className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
          <span className='flex size-[28px] items-center justify-center overflow-hidden rounded-[2px] p-[3px]'>
            <span className='relative size-[20px]'>
              <Image
                src='/sidebar/sidebar-icon-hover.svg'
                alt=''
                width={20}
                height={20}
                className='absolute top-[-5%] left-[-5%] size-[110%] max-w-none'
              />
            </span>
          </span>
        </span>
      </button>
    </HoverTooltip>
  );
}

export default function Sidebar({ defaultExpanded = false }: SidebarProps) {
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
  const socialAccount = profile?.socialAccounts?.[0];
  const socialEmail = (socialAccount?.socialEmail as unknown as string) || '';

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
    href != null && (pathname === href || pathname.startsWith(`${href}/`));

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
        'h-[100dvh] shrink-0 overflow-hidden bg-white',
        isExpanded
          ? 'shadow-[0px_6px_20px_-2px_rgba(0,0,0,0.15)]'
          : 'border-gray3 border-r',
      )}
      aria-label='사이드바'
    >
      {isExpanded ? (
        <div className='relative h-full w-[240px]'>
          <ExpandedBrand onClick={() => setIsExpanded(false)} />

          <nav aria-label='주요 메뉴'>
            {MENU_ITEMS.map((item, index) => (
              <ExpandedMenuItem
                key={item.label}
                item={item}
                top={EXPANDED_MENU_TOPS[index]}
                active={isActive(item.href)}
              />
            ))}
          </nav>

          <Image
            src='/sidebar/divider.svg'
            alt=''
            width={200}
            height={1}
            className='absolute top-[216px] left-[20px]'
          />
          <Image
            src='/sidebar/divider.svg'
            alt=''
            width={200}
            height={1}
            className='absolute top-[272px] left-[20px]'
          />

          {showAccount &&
            (isLoggedIn ? (
              <button
                type='button'
                onClick={() => setIsProfileModalOpen(true)}
                className='absolute top-[288px] left-[20px] cursor-pointer text-left'
                aria-label='프로필 열기'
              >
                <span className='relative flex items-center'>
                  <span className='typo-b2-b text-gray9 whitespace-nowrap'>
                    {profile?.name || '사용자'}
                  </span>
                  <span className='typo-c1 text-gray9 absolute top-[2px] left-[50px] whitespace-nowrap'>
                    님 프로필
                  </span>
                  <SidebarIcon
                    src='/sidebar/profile-chevron.svg'
                    size={20}
                    className='absolute top-[2px] left-[106px] rotate-90'
                  />
                </span>
                <span className='mt-[4px] flex items-center gap-[8px]'>
                  <SocialEmailLogo socialType={socialAccount?.socialType} />
                  <span className='typo-c1 text-gray6 whitespace-nowrap'>
                    {socialEmail}
                  </span>
                </span>
              </button>
            ) : (
              <button
                type='button'
                onClick={() => router.push('/login')}
                className='absolute top-[288px] left-[20px] cursor-pointer text-left'
                aria-label='로그인'
              >
                <span className='relative flex items-center'>
                  <span className='typo-b2-b text-gray9'>로그인</span>
                  <SidebarIcon
                    src='/sidebar/profile-chevron.svg'
                    size={20}
                    className='absolute top-[2px] left-[46px] rotate-90'
                  />
                </span>
                <span className='typo-c1 text-gray6 mt-[4px] block whitespace-nowrap'>
                  Folioo와 커리어 기록을 시작하세요.
                </span>
              </button>
            ))}

          {showAccount && isLoggedIn && (
            <button
              type='button'
              onClick={() => setIsLogoutModalOpen(true)}
              className='absolute bottom-[24px] left-[20px] flex cursor-pointer items-center gap-[6px]'
              aria-label='로그아웃'
            >
              <SidebarIcon src='/sidebar/logout.svg' size={24} />
              <span className='typo-b2 text-gray9'>로그아웃</span>
            </button>
          )}
        </div>
      ) : (
        <div className='relative h-full w-[60px]'>
          <CollapsedBrand onClick={() => setIsExpanded(true)} />

          <Image
            src='/sidebar/divider-collapsed.svg'
            alt=''
            width={44}
            height={1}
            className='absolute top-[216px] left-[8px]'
          />
          <Image
            src='/sidebar/divider-collapsed.svg'
            alt=''
            width={44}
            height={1}
            className='absolute top-[272px] left-[8px]'
          />

          <nav aria-label='주요 메뉴'>
            {MENU_ITEMS.map((item, index) => (
              <CollapsedMenuItem
                key={item.label}
                item={item}
                top={COLLAPSED_MENU_TOPS[index]}
                active={isActive(item.href)}
              />
            ))}
          </nav>
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
