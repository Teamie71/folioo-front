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
import { ExperienceResDTOHopeJob } from '@/api/models';
import type { ExperienceResDTO } from '@/api/models';

/* API hopeJob enum → 카드 태그 라벨 */
const HOPE_JOB_TO_LABEL: Record<string, string> = {
  [ExperienceResDTOHopeJob.NONE]: '미정',
  [ExperienceResDTOHopeJob.PLANNING]: '기획',
  [ExperienceResDTOHopeJob.MARKETING]: '광고/마케팅',
  [ExperienceResDTOHopeJob.DESIGN]: '디자인',
  [ExperienceResDTOHopeJob.DEV]: 'IT 개발',
  [ExperienceResDTOHopeJob.MEDIA]: '영상/미디어',
  [ExperienceResDTOHopeJob.DATA]: '데이터',
};

function toCard(item: ExperienceResDTO) {
  return {
    id: String(item.id),
    title: item.name,
    tag: HOPE_JOB_TO_LABEL[item.hopeJob] ?? '미정',
    date: item.createdAt.slice(0, 10),
  };
}

interface ExperienceCardSectionProps {
  searchQuery?: string;
  isSearching?: boolean;
}

export function ExperienceCardSection({
  searchQuery = '',
  isSearching = false,
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
    <div className='grid grid-cols-2 gap-[1.5rem]'>
      {showLoading ? (
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
        cards.map((card) => {
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
