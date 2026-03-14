'use client';

import { CommonButton } from '@/components/CommonButton';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ReactNode, useRef } from 'react';

interface ContentCardProps {
  title: string;
  /* 카드 중앙에 표시할 아이콘(SVG) 또는 컴포넌트 */
  icon?: ReactNode;
  description: ReactNode;
  buttonText: string;
  /* 버튼 클릭 시 이동할 경로 */
  buttonHref?: string;
  /* 지정 시 새로 렌더링*/
  customButton?: ReactNode;
  /* true일 때 로그아웃 상태에서 클릭하면 로그인 페이지로 보냄 */
  requireLogin?: boolean;
  /* 지정 시 카드 클릭 시 해당 id를 가진 섹션으로 스무스 스크롤 */
  sectionId?: string;
  /* 지정 시 카드 클릭 시 해당 px만큼 아래로 스크롤 */
  scrollAmount?: number;
  /* 지정 시 카드 클릭 시 (카드 하단 + 이 값) 위치가 뷰포트 상단에 오도록 스크롤 */
  scrollToBelowCard?: number;
}

export const ContentCard = ({
  title,
  description,
  buttonText,
  icon,
  buttonHref,
  customButton,
  requireLogin = false,
  sectionId,
  scrollAmount,
  scrollToBelowCard,
}: ContentCardProps) => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleProtectedClick = () => {
    if (!buttonHref) return;

    if (requireLogin && !accessToken) {
      router.push(`/login?redirect_to=${encodeURIComponent(buttonHref)}`);
      return;
    }

    router.push(buttonHref);
  };

  const hasScrollAction =
    scrollAmount != null || sectionId != null || scrollToBelowCard != null;

  const scrollToBelowCardPosition = (element: HTMLElement) => {
    if (scrollToBelowCard == null) return;
    const rect = element.getBoundingClientRect();
    const targetScrollTop = rect.bottom + window.scrollY + scrollToBelowCard;
    window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    if (scrollToBelowCard != null) {
      scrollToBelowCardPosition(e.currentTarget as HTMLElement);
      return;
    }
    if (scrollAmount != null) {
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      return;
    }
    if (sectionId) {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (scrollToBelowCard != null && cardRef.current) {
      scrollToBelowCardPosition(cardRef.current);
      return;
    }
    if (scrollAmount != null) {
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      return;
    }
    if (sectionId) {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderButton = () =>
    customButton ? (
      <div onClick={(e) => e.stopPropagation()} role='presentation'>
        {customButton}
      </div>
    ) : buttonHref ? (
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          handleProtectedClick();
        }}
        className='inline-flex cursor-pointer items-center justify-center rounded-[6.25rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[2.25rem] py-[0.5rem] text-[1rem] font-semibold text-[#5060C5] hover:bg-[#EEEDF7]'
      >
        {buttonText}
      </button>
    ) : (
      <CommonButton variantType='Outline' px='2.25rem' py='0.5rem'>
        {buttonText}
      </CommonButton>
    );

  return (
    <motion.div
      ref={cardRef}
      role={hasScrollAction ? 'button' : undefined}
      tabIndex={hasScrollAction ? 0 : undefined}
      onClick={hasScrollAction ? handleCardClick : undefined}
      onKeyDown={hasScrollAction ? handleKeyDown : undefined}
      className={`flex h-[12.25rem] w-[20.5rem] flex-col rounded-[1.75rem] bg-white shadow-[0px_4px_8px_0px_#00000033] md:h-[25.125rem] md:w-[21rem] ${hasScrollAction ? 'cursor-pointer' : ''}`}
      whileHover={{
        y: -8,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 모바일: 좌(제목+설명) 우(아이콘), 하단 버튼 */}
      <div className='flex flex-1 flex-col gap-[1.5rem] px-[2rem] py-[1.75rem] md:hidden'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-1 flex-col gap-[0.75rem]'>
            <p className='text-gray9 typo-h5'>{title}</p>
            <p className='text-gray9 typo-c1'>{description}</p>
          </div>
          <div className='flex h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-contain [&>svg]:h-full [&>svg]:w-full'>
            {icon}
          </div>
        </div>
        <div className='flex justify-center'>{renderButton()}</div>
      </div>

      {/* 데스크톱: 기존 세로 중앙 배치 */}
      <div className='flex hidden h-full flex-col items-center justify-center gap-[1.75rem] md:flex'>
        <div className='flex flex-col items-center justify-center gap-[1.5rem]'>
          <p className='text-[1.75rem] leading-[130%] font-bold text-[#000000]'>
            {title}
          </p>
          <div className='flex h-[7.5rem] w-[7.5rem] shrink-0 items-center justify-center'>
            {icon ?? <div className='h-full w-full bg-[#D9D9D9]' />}
          </div>
          <p className='text-center text-[1rem] leading-[150%] text-[#000000]'>
            {description}
          </p>
        </div>
        {renderButton()}
      </div>
    </motion.div>
  );
};
