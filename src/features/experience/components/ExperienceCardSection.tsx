'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PortfolioCard } from '@/components/PortfolioCard';
import {
  getExperienceReturnPaths,
  type ExperienceReturnPath,
} from '@/features/experience/utils/experienceReturnPath';
import { useExperienceControllerGetExperiences } from '@/api/endpoints/experience/experience';
import type { ExperienceResDTO } from '@/api/models';
import { getHopeJobLabel } from '@/constants/hopeJob';

function toCard(item: ExperienceResDTO) {
  return {
    id: String(item.id),
    title: item.name,
    tag: getHopeJobLabel(item.hopeJob),
    date: item.createdAt.slice(0, 10),
  };
}

interface ExperienceCardSectionProps {
  searchQuery?: string;
  isSearching?: boolean;
  isClickable?: boolean;
}

export function ExperienceCardSection({
  searchQuery = '',
  isSearching = false,
  isClickable = true,
}: ExperienceCardSectionProps) {
  const [returnPaths, setReturnPaths] = useState<
    Record<string, ExperienceReturnPath>
  >({});

  const { data, isLoading, isFetching } = useExperienceControllerGetExperiences(
    searchQuery.trim() ? { keyword: searchQuery.trim() } : undefined,
  );

  const experienceList = data?.result ?? [];
  const cards = useMemo(() => experienceList.map(toCard), [experienceList]);

  useEffect(() => {
    setReturnPaths(getExperienceReturnPaths());
  }, []);

  const hasNoCards = cards.length === 0;
  const hasQuery = searchQuery.trim() !== '';
  const hasNoResults = hasQuery && hasNoCards;
  const showLoading = isLoading || (isSearching && isFetching);

  return (
    <div className='grid grid-cols-1 gap-[1.5rem] md:grid-cols-2'>
      {showLoading ? (
        <div className='col-span-1 mt-[5rem] flex items-center justify-center md:col-span-2'>
          <motion.div
            animate={{ rotate: 720 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeOut',
            }}
          >
            <Image
              src='/LoadingSpinnerIcon.svg'
              alt='loading'
              width={64}
              height={64}
            />
          </motion.div>
        </div>
      ) : hasNoResults ? (
        <div className='col-span-1 mt-[5rem] flex items-center justify-center text-center text-[1rem] font-bold leading-[150%] text-[#9EA4A9] md:col-span-2 md:text-[1.125rem]'>
          앗, 일치하는 결과가 없어요.
        </div>
      ) : hasNoCards ? (
        <div className='col-span-1 mt-[5rem] flex items-center justify-center text-center text-[1rem] font-bold leading-[150%] text-[#9EA4A9] md:col-span-2 md:text-[1.125rem]'>
          아직 정리한 경험이 없어요. <br />
          경험을 정리하고, <br className='md:hidden' />
          텍스트형 포트폴리오를 받아보세요!
        </div>
      ) : (
        cards.map((card) => {
          const subPath = returnPaths[card.id] ?? 'chat';
          return (
            <PortfolioCard
              key={card.id}
              title={card.title}
              tag={card.tag}
              date={card.date}
              href={
                isClickable
                  ? `/experience/settings/${card.id}/${subPath}`
                  : undefined
              }
            />
          );
        })
      )}
    </div>
  );
}
