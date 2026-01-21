'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = '설정' | 'AI 대화' | '포트폴리오';

export const ExperienceHIW = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>('설정');
  const [direction, setDirection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false);
  const scrollAccumulatorRef = useRef(0);
  const scrollDirectionRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabContent = {
    설정: (
      <>
        간단한 정보만으로 경험 정리를 시작하세요. <br />
        희망 직무와 관련 파일을 업로드하면 <br />
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

  const handleTabChange = useCallback((newTab: TabType) => {
    const currentIndex = tabs.indexOf(selectedTab);
    const newIndex = tabs.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setSelectedTab(newTab);
  }, [selectedTab]);

  useEffect(() => {
    const SCROLL_THRESHOLD = 200; // 탭 변경에 필요한 스크롤 임계값
    
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current || !isMouseInside) return;

      const deltaY = e.deltaY;
      const currentIndex = tabs.indexOf(selectedTab);

      // 첫 탭에서 위로 스크롤 또는 마지막 탭에서 아래로 스크롤하면 외부 스크롤 허용
      const isFirstTabScrollingUp = currentIndex === 0 && deltaY < 0;
      const isLastTabScrollingDown = currentIndex === tabs.length - 1 && deltaY > 0;

      if (isFirstTabScrollingUp || isLastTabScrollingDown) {
        return; // 외부 스크롤 허용
      }

      // 마우스가 영역 안에 있을 때만 외부 스크롤 방지
      e.preventDefault();

      if (isScrolling) return;

      // 스크롤 방향 확인
      const currentDirection = deltaY > 0 ? 1 : -1;
      
      // 방향이 바뀌면 누적량 리셋
      if (scrollDirectionRef.current !== 0 && scrollDirectionRef.current !== currentDirection) {
        scrollAccumulatorRef.current = 0;
      }
      
      scrollDirectionRef.current = currentDirection;

      // 같은 방향으로 스크롤 누적
      scrollAccumulatorRef.current += Math.abs(deltaY);

      // 임계값을 넘었을 때만 탭 변경
      if (scrollAccumulatorRef.current >= SCROLL_THRESHOLD) {
        if (deltaY > 0 && currentIndex < tabs.length - 1) {
          // 아래로 스크롤 - 다음 탭
          scrollAccumulatorRef.current = 0;
          scrollDirectionRef.current = 0;
          setIsScrolling(true);
          handleTabChange(tabs[currentIndex + 1]);
          setTimeout(() => setIsScrolling(false), 500);
        } else if (deltaY < 0 && currentIndex > 0) {
          // 위로 스크롤 - 이전 탭
          scrollAccumulatorRef.current = 0;
          scrollDirectionRef.current = 0;
          setIsScrolling(true);
          handleTabChange(tabs[currentIndex - 1]);
          setTimeout(() => setIsScrolling(false), 500);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [selectedTab, isScrolling, handleTabChange, isMouseInside]);

  // 탭이 변경될 때 스크롤 누적량 리셋
  useEffect(() => {
    scrollAccumulatorRef.current = 0;
    scrollDirectionRef.current = 0;
  }, [selectedTab]);

  // 애니메이션 variants
  const contentVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const imageVariants = {
    initial: (direction: number) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div 
      ref={containerRef} 
      className='flex justify-between'
      onMouseEnter={() => setIsMouseInside(true)}
      onMouseLeave={() => setIsMouseInside(false)}
    >
      <div className='flex flex-col gap-[1.5rem]'>
        {/* 아코디언 형태의 탭 목록 */}
        {tabs.map((tab) => (
          <div key={tab}>
            {selectedTab === tab ? (
              /* 선택된 탭: 세로 바 + 제목 + 내용 표시 */
              <div className='flex gap-[1.25rem]'>
                {/* 왼쪽 세로 바 */}
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={tab}
                    className='w-[0.5rem] bg-[#5060C5]'
                    variants={contentVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </AnimatePresence>

                {/* 제목 + 내용 */}
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={tab}
                    className='flex flex-col gap-[1.25rem]'
                    variants={contentVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <h2 className='text-[1.75rem] font-bold leading-[130%] text-[#5060C5]'>
                      {tab}
                    </h2>
                    <p className='text-[1.125rem] leading-[150%] text-[#000000] pb-[0.25rem]'>
                      {tabContent[tab]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              // 선택되지 않은 탭: 회색 제목만 표시
              <motion.button
                onClick={() => handleTabChange(tab)}
                className='ml-[1.75rem] text-[1.75rem] cursor-pointer font-bold leading-[130%] text-[#5060C5]/40 transition-colors'
                whileHover={{ opacity: 0.7, x: 5 }}
                transition={{ duration: 0.4 }}
              >
                {tab}
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* 영상 */}
      <AnimatePresence mode='wait' custom={direction}>
        <motion.div
          key={selectedTab}
          custom={direction}
          className='h-[37.125rem] w-[66rem] bg-[#D9D9D9]'
          variants={imageVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  );
};