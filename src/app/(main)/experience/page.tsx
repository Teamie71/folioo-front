'use client';

import { useEffect, useState } from 'react';
import InputArea from '@/components/InputArea';
import { ExperienceIcon } from '@/components/icons/ExperienceIcon';
import { SearchButton } from '@/components/SearchButton';
import { ExperienceCardSection } from '@/features/experience/components/ExperienceCardSection';
import { NewExperienceStartButton } from '@/features/experience/components/NewExperienceStartButton';
import { useExperienceControllerGetExperiences } from '@/api/endpoints/experience/experience';
import { ExperienceResDTOHopeJob } from '@/api/models/experienceResDTOHopeJob';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useAuthStore } from '@/store/useAuthStore';

const HOPE_JOB_TO_LABEL: Record<ExperienceResDTOHopeJob, string> = {
  NONE: '미정',
  PLANNING: '기획',
  MARKETING: '광고/마케팅',
  DESIGN: '디자인',
  DEV: 'IT 개발',
  MEDIA: '영상/미디어',
  DATA: '데이터',
};

export default function ExperiencePage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const setExperienceCards = useExperienceStore(
    (state) => state.setExperienceCards,
  );
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );

  const isAuthReady = sessionRestoreAttempted && !!accessToken;

  const { data, isLoading } = useExperienceControllerGetExperiences(
    isAuthReady && searchQuery ? { keyword: searchQuery } : isAuthReady ? {} : undefined,
    { query: { enabled: isAuthReady } },
  );

  useEffect(() => {
    if (!data) return;

    const experiences = data.result ?? [];
    const cards = experiences.map((exp) => ({
      id: String(exp.id),
      title: exp.name,
      tag: HOPE_JOB_TO_LABEL[exp.hopeJob] ?? '미정',
      date: exp.createdAt.slice(0, 10),
    }));

    setExperienceCards(cards);
  }, [data, setExperienceCards]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  return (
    <div className='flex flex-col gap-[4.5rem]'>
      {/* 경험정리 헤더 */}
      <div className='mx-auto flex h-[15.625rem] w-full min-w-[66rem] bg-[#F6F5FF]'>
        <div className='mx-auto flex min-w-[66rem] items-center justify-between'>
          {/* 경험정리 타이틀 */}
          <div>
            <div className='flex flex-col gap-[1.25rem]'>
              <div className='flex items-center gap-[1.125rem]'>
                <ExperienceIcon />
                <span className='text-[1.5rem] font-bold'>경험 정리</span>
              </div>
              <span className='text-[1.125rem] leading-[150%] text-[#464B53]'>
                AI 컨설턴트와의 대화를 통해 경험을 정리해 보세요.
                <br />
                대화가 끝나면 포트폴리오가 완성돼요.
              </span>
            </div>
          </div>

          {/* 새로운 경험 정리 시작하기 버튼 */}
          <NewExperienceStartButton />
        </div>
      </div>

      {/* 나의 경험 */}
      <div className='mx-auto flex w-[66rem] flex-col gap-[3rem] pb-[15rem]'>
        <div className='flex flex-col gap-[2rem]'>
          <span className='text-[1.25rem] font-bold'>나의 경험</span>

          {/* 나의 경험 검색 */}
          <InputArea
            variant='rounded'
            placeholder='검색어를 입력하세요.'
            rightElement={<SearchButton onClick={handleSearch} />}
            maxLength={20}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
        </div>

        {/* 나의 경험 카드 */}
        <ExperienceCardSection
          searchQuery={searchQuery}
          isSearching={!sessionRestoreAttempted || isLoading}
        />
      </div>
    </div>
  );
}
