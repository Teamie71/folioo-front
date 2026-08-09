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
  expanded: 234,
  collapsed: 60,
} as const;

const SIDEBAR_TRANSITION = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
};

type SidebarMenuItem = {
  label: string;
  href?: string;
  icon: string;
  hoverIcon?: string;
  disabled?: boolean;
  tooltip?: string;
};

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    label: '직무 추천',
    icon: '/sidebar/job-recommendation.svg',
    hoverIcon: '/sidebar/job-recommendation-collapsed-hover.svg',
    disabled: true,
    tooltip: '준비 중이에요.',
  },
  {
    label: '경험 정리',
    href: '/experience',
    icon: '/sidebar/experience.svg',
    hoverIcon: '/sidebar/experience-collapsed-hover.svg',
  },
  {
    label: '포트폴리오 첨삭',
    href: '/correction',
    icon: '/sidebar/correction.svg',
    hoverIcon: '/sidebar/correction-collapsed-hover.svg',
  },
  {
    label: '피드백',
    href: '/feedback',
    icon: '/sidebar/correction.svg',
    hoverIcon: '/sidebar/correction-collapsed-hover.svg',
  },
];

const MENU_TOPS = [78, 117, 156, 195];

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

  return <Image src={src} alt='' width={width} height={height} className={className} />;
}

function MenuIcon({
  item,
  collapsed = false,
}: {
  item: SidebarMenuItem;
  collapsed?: boolean;
}) {
  const icon = (
    <SidebarIcon
      src={item.icon}
      width={16.38}
      height={item.label === '경험 정리' ? 15.015 : 16.38}
      className='group-hover:hidden'
    />
  );
  const hoverIcon = item.hoverIcon ? (
    <SidebarIcon
      src={item.hoverIcon}
      width={16.38}
      height={item.label === '경험 정리' ? 15.015 : 16.38}
      className='hidden group-hover:block'
    />
  ) : null;

  if (item.label === '경험 정리') {
    return (
      <span className='relative flex size-[16.38px] shrink-0 items-center justify-center overflow-hidden'>
        <span className='absolute top-[1.64px] left-[1.64px]'>
          {icon}
          {hoverIcon}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'relative flex size-[16.38px] shrink-0 items-center justify-center',
        collapsed && 'pointer-events-none',
      )}
    >
      {icon}
      {hoverIcon}
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
    <div className='group relative flex h-[24px] w-full items-center text-left'>
      <span className='ml-[21.92px]'>
        <MenuIcon item={item} />
      </span>
      <span className='typo-b2 ml-[13.7px] whitespace-nowrap text-gray9'>
        {item.label}
      </span>
      {item.disabled ? (
        <span className='absolute top-[3.2px] right-[20.6px] flex h-[17.6px] w-[36.8px] items-center justify-center rounded-[3px] border-[0.8px] border-[#898989] bg-white text-[8px] leading-[1.24] text-black'>
          준비중
        </span>
      ) : (
        <SidebarIcon
          src='/sidebar/chevron-right.svg'
          size={20}
          className='absolute top-[2px] right-[21px] rotate-90'
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
    <div className='absolute right-0 left-0' style={{ top }}>
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
    <div className='group flex h-[24px] w-[60px] items-center justify-center'>
      <MenuIcon item={item} collapsed />
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
    <div className='absolute right-0 left-0' style={{ top }}>
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
        width={104.84}
        height={26.21}
        className='absolute top-[32px] left-[17px]'
      />
      <button
        type='button'
        onClick={onClick}
        className='absolute top-[33px] left-[188px] flex size-[25px] cursor-pointer items-center justify-center'
        aria-label='사이드바 최소화'
      >
        <SidebarIcon src='/sidebar/sidebar-toggle.svg' width={20.75} height={20.75} />
      </button>
    </>
  );
}

function CollapsedBrand({ onClick }: { onClick: () => void }) {
  return (
    <HoverTooltip
      label='사이드바 열기'
      placement='bottom'
      wrapperClassName='absolute top-[30px] left-[17px] block h-[27.846px] w-[26.208px]'
    >
      <button
        type='button'
        onClick={onClick}
        className='group relative flex h-[27.846px] w-[26.208px] cursor-pointer items-center justify-center'
        aria-label='사이드바 최대화'
      >
        <span className='absolute top-0 left-0 h-[27.846px] w-[26.208px] overflow-hidden'>
          <Image
            src='/sidebar/logo-symbol.svg'
            alt='Folioo'
            width={104.832}
            height={26.208}
            className='absolute top-0 left-0 max-w-none transition-opacity group-hover:opacity-0'
          />
        </span>
        <span className='absolute top-[1.8px] left-[0.8px] flex size-[25px] items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
          <SidebarIcon src='/sidebar/sidebar-toggle-collapsed.svg' width={20.75} height={20.75} />
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
        'h-[100dvh] shrink-0 overflow-hidden bg-white',
        !isExpanded && 'border-r border-gray4',
      )}
      aria-label='사이드바'
    >
      {isExpanded ? (
        <div className='relative h-full w-[234px]'>
          <ExpandedBrand onClick={() => setIsExpanded(false)} />

          <nav aria-label='주요 메뉴'>
            {MENU_ITEMS.map((item, index) => (
              <ExpandedMenuItem
                key={item.label}
                item={item}
                top={MENU_TOPS[index]}
                active={isActive(item.href)}
              />
            ))}
          </nav>

          <Image
            src='/sidebar/divider.svg'
            alt=''
            width={202}
            height={1}
            className='absolute top-[239px] left-[16px]'
          />

          {showAccount &&
            (isLoggedIn ? (
              <button
                type='button'
                onClick={() => setIsProfileModalOpen(true)}
                className='absolute top-[264px] left-[20px] w-[162px] cursor-pointer text-left'
                aria-label='프로필 열기'
              >
                <span className='flex h-[23px] items-center'>
                  <span className='typo-h5 whitespace-nowrap text-gray9'>
                    {profile?.name || '사용자'}
                  </span>
                  <span className='typo-c1 ml-[8px] whitespace-nowrap text-gray9'>
                    님 프로필
                  </span>
                  <SidebarIcon
                    src='/sidebar/chevron-right.svg'
                    size={20}
                    className='absolute top-[2px] left-[115px] rotate-90'
                  />
                </span>
                <span className='absolute top-[31px] left-0 flex h-[21px] items-center'>
                  <SocialEmailLogo socialType={socialAccount?.socialType} />
                  <span className='typo-c1 ml-[8px] whitespace-nowrap text-gray6'>
                    {socialEmail}
                  </span>
                </span>
              </button>
            ) : (
              <button
                type='button'
                onClick={() => router.push('/login')}
                className='absolute top-[264px] left-[20px] w-[197px] cursor-pointer text-left'
                aria-label='로그인'
              >
                <span className='flex h-[23px] items-center'>
                  <span className='typo-h5 text-gray9'>로그인</span>
                  <SidebarIcon
                    src='/sidebar/chevron-right.svg'
                    size={20}
                    className='absolute top-[2px] left-[55px] rotate-90'
                  />
                </span>
                <span className='typo-c1 absolute top-[31px] left-0 whitespace-nowrap text-gray6'>
                  Folioo와 커리어 기록을 시작하세요.
                </span>
              </button>
            ))}

          {showAccount && isLoggedIn && (
            <button
              type='button'
              onClick={() => setIsLogoutModalOpen(true)}
              className='absolute bottom-[30px] left-[20px] flex cursor-pointer items-center gap-[8px]'
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

          <nav aria-label='주요 메뉴'>
            {MENU_ITEMS.map((item, index) => (
              <CollapsedMenuItem
                key={item.label}
                item={item}
                top={MENU_TOPS[index]}
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
