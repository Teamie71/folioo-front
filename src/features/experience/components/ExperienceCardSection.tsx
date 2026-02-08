'use client';

import { PortfolioCard } from '@/components/PortfolioCard';
import { useExperienceStore } from '@/store/useExperienceStore';

export function ExperienceCardSection() {
  const { experienceCards } = useExperienceStore();

  return (
    <div className='grid grid-cols-2 gap-[1.5rem]'>
      {experienceCards.length === 0 ? (
        <div className='col-span-2 mt-[5rem] flex items-center justify-center text-center text-[1.125rem] font-bold text-[#000000]'>
          아직 정리한 경험이 없어요. <br />
          경험을 정리하고, 텍스트형 포트폴리오를 받아보세요!
        </div>
      ) : (
        experienceCards.map((card) => (
          <PortfolioCard
            key={card.id}
            title={card.title}
            tag={card.tag}
            date={card.date}
            href={`/experience/settings/${card.id}/chat`}
          />
        ))
      )}
    </div>
  );
}
