'use client';

import { useState } from 'react';
import InputArea from '@/components/InputArea';
import { ExperienceIcon } from '@/components/icons/ExperienceIcon';
import { SearchButton } from '@/components/SearchButton';
import { ExperienceCardSection } from '@/features/experience/components/ExperienceCardSection';
import { NewExperienceStartButton } from '@/features/experience/components/NewExperienceStartButton';

export default function ExperiencePage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
                AI 비서 티미와의 채팅을 통해 경험을 체계적으로 정리해보세요.
                <br />
                채팅이 종료되면, 텍스트형 포트폴리오가 생성됩니다.
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
        <ExperienceCardSection searchQuery={searchQuery} />
      </div>
    </div>
  );
}
