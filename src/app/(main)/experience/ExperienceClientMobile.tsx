'use client';

import { useState, useEffect } from 'react';
import InputArea from '@/components/InputArea';
import { SearchButton } from '@/components/SearchButton';
import { ExperienceCardSection } from '@/features/experience/components/ExperienceCardSection';

export default function ExperienceClientMobile() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchQuery(searchInput.trim());
  };

  useEffect(() => {
    if (!isSearching) return;
    const id = setTimeout(() => setIsSearching(false), 400);
    return () => clearTimeout(id);
  }, [isSearching, searchQuery]);

  return (
    <div className='flex min-h-screen flex-col bg-[#FDFDFD]'>
      {/* 경험정리 헤더 (모바일) */}
      <div className='bg-sub1 flex flex-col gap-[0.75rem] px-[1rem] py-[1.25rem]'>
        <p className='typo-c1 text-gray7'>
          AI 컨설턴트와의 대화를 통해 경험을 정리해 보세요.
          <br />
          대화가 끝나면 포트폴리오가 완성돼요.
        </p>
        <div className='typo-c1 text-main rounded-[0.5rem] bg-white py-[0.5rem] text-center'>
          새로운 경험 정리는 PC에서만 할 수 있어요.
        </div>
      </div>

      <div className='flex flex-col gap-[1.5rem] px-[1rem] py-[2.5rem]'>
        {/* 나의 경험 타이틀 */}
        <h2 className='text-[1.25rem] font-bold text-[#1A1A1A]'>나의 경험</h2>

        {/* 검색창 */}
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
          className='shadow-[0_4px_10px_0_rgba(0,0,0,0.05)]'
        />

        {/* 카드 목록 */}
        <div className='mt-[0.5rem]'>
          <ExperienceCardSection
            searchQuery={searchQuery}
            isSearching={isSearching}
            isClickable={false}
          />
        </div>
      </div>
    </div>
  );
}
