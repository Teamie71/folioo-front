'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LandingVideo } from './LandingVideo';

type TabType = '설정' | 'AI 대화' | '포트폴리오';

const DEFAULT_VIDEO_SOURCES: Record<TabType, string> = {
  설정: '/landing/experience1.mp4',
  'AI 대화': '/landing/experience2.mp4',
  포트폴리오: '/landing/experience3.mp4',
};

export const ExperienceHIW = ({
  videoSources = DEFAULT_VIDEO_SOURCES,
}: {
  videoSources?: Partial<Record<TabType, string>>;
} = {}) => {
  const sources = { ...DEFAULT_VIDEO_SOURCES, ...videoSources };
  const [selectedTab, setSelectedTab] = useState<TabType>('설정');
  const videoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabContent = {
    설정: (
      <>
        간단한 정보만으로 경험 정리를 시작하세요. <br />
        희망 직무를 선택해주시면, <br />
        AI 컨설턴트가 참고하여 대화를 준비해요.
      </>
    ),
    'AI 대화': (
      <>
        AI 컨설턴트가 주도하는 4단계의 대화를 통해
        <br />
        경험을 체계적으로 풀어내세요.
        <br />
        관련된 로그는 AI가 알아서 참고하고,
        <br />
        필요한 건 직접 멘션할 수 있어요.
      </>
    ),
    포트폴리오: (
      <>
        진행된 대화 내용을 바탕으로
        <br />
        AI 컨설턴트가 바로 사용 가능한 수준의
        <br />
        텍스트형 포트폴리오를 작성해요.
        <br />
        결과물을 PDF로 내보내서 공유할 수 있어요.
      </>
    ),
  };

  const tabs: TabType[] = ['설정', 'AI 대화', '포트폴리오'];

  const handleTabClick = useCallback((tab: TabType) => {
    setSelectedTab(tab);
    const element = videoRefs.current[tab];
    if (element && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const elementTop = element.offsetTop - container.offsetTop;
      container.scrollTo({
        top: elementTop,
        behavior: 'smooth',
      });
    }
  }, []);

  // 컴포넌트 전체 영역에서 휠 이벤트를 오른쪽 영상 영역으로 전달
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  }, []);

  // Intersection Observer로 스크롤 위치에 따라 탭 자동 변경
  useEffect(() => {
    const options = {
      root: scrollContainerRef.current,
      threshold: 0.5, // 50% 이상 보이면 활성화
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const tab = entry.target.getAttribute('data-tab') as TabType;
          if (tab) {
            setSelectedTab(tab);
          }
        }
      });
    }, options);

    Object.values(videoRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className='flex justify-between'
      onWheel={handleWheel}
    >
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 아코디언 형태의 탭 목록 */}
        {tabs.map((tab) => (
          <div key={tab}>
            {selectedTab === tab ? (
              /* 선택된 탭: 세로 바 + 제목 + 내용 표시 */
              <div className='flex gap-[1.25rem]'>
                {/* 왼쪽 세로 바 */}
                <motion.div
                  className='w-[0.5rem] bg-[#5060C5]'
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />

                {/* 제목 + 내용 */}
                <motion.div
                  className='flex flex-col gap-[1.25rem]'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <h2 className='text-[1.75rem] leading-[130%] font-bold text-[#5060C5]'>
                    {tab}
                  </h2>
                  <p className='pb-[0.25rem] text-[1.125rem] leading-[150%] text-[#000000]'>
                    {tabContent[tab]}
                  </p>
                </motion.div>
              </div>
            ) : (
              // 선택되지 않은 탭: 회색 제목만 표시
              <motion.button
                onClick={() => handleTabClick(tab)}
                className='ml-[1.75rem] cursor-pointer text-[1.75rem] leading-[130%] font-bold text-[#5060C5]/40 transition-colors'
                whileHover={{ opacity: 0.7, x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {tab}
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* 영상 스크롤 영역 */}
      <div
        ref={scrollContainerRef}
        className='h-[37.125rem] w-[66rem] overflow-y-scroll'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {tabs.map((tab) => (
          <div
            key={tab}
            ref={(el) => {
              videoRefs.current[tab] = el;
            }}
            data-tab={tab}
            className='mb-[6.25rem] last:mb-0'
          >
            <LandingVideo src={sources[tab]} width='66rem' height='37.125rem' />
          </div>
        ))}
      </div>
    </div>
  );
};
