'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PortfolioCard } from '@/components/PortfolioCard';
import { useExperienceStore } from '@/store/useExperienceStore';
import {
  getExperienceReturnPaths,
  type ExperienceReturnPath,
} from '@/features/experience/utils/experienceReturnPath';

interface ExperienceCardSectionProps {
  searchQuery?: string;
  isSearching?: boolean;
}

export function ExperienceCardSection({
  searchQuery = '',
  isSearching = false,
}: ExperienceCardSectionProps) {
  const { experienceCards } = useExperienceStore();
  const [returnPaths, setReturnPaths] = useState<
    Record<string, ExperienceReturnPath>
  >({});

  useEffect(() => {
    setReturnPaths(getExperienceReturnPaths());
  }, []);

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === '') return experienceCards;
    return experienceCards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.tag.toLowerCase().includes(query),
    );
  }, [experienceCards, searchQuery]);

  const hasNoCards = experienceCards.length === 0;
  const hasQuery = searchQuery.trim() !== '';
  const hasNoResults = hasQuery && filteredCards.length === 0;

  return (
    <div className='grid grid-cols-2 gap-[1.5rem]'>
      {isSearching ? (
        <div className='col-span-2 mt-[5rem] flex items-center justify-center'>
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
      ) : hasNoCards ? (
        <div className='col-span-2 mt-[5rem] flex items-center justify-center text-center text-[1.125rem] leading-[130%] font-bold text-[#9EA4A9]'>
          아직 정리한 경험이 없어요. <br />
          경험을 정리하고, 텍스트형 포트폴리오를 받아보세요!
        </div>
      ) : hasNoResults ? (
        <div className='col-span-2 mt-[5rem] flex items-center justify-center text-center text-[1.125rem] leading-[130%] font-bold text-[#9EA4A9]'>
          앗, 일치하는 결과가 없어요.
        </div>
      ) : (
        filteredCards.map((card) => {
          const subPath = returnPaths[card.id] ?? 'chat';
          return (
            <PortfolioCard
              key={card.id}
              title={card.title}
              tag={card.tag}
              date={card.date}
              href={`/experience/settings/${card.id}/${subPath}`}
            />
          );
        })
      )}
    </div>
  );
}
