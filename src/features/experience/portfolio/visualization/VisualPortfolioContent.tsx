import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PanelSlideToggleButton } from './PanelSlideToggleButton';
import { SlideListPanel } from './SlideListPanel';
import { SlideContent } from './SlideContent';

const SLIDE_COUNT = 15;

const VisualPortfolioContent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(SLIDE_COUNT - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  return (
    <motion.div layout className='flex flex-col gap-[0.75rem]'>
      <PanelSlideToggleButton onClick={() => setIsCollapsed(!isCollapsed)} />
      <motion.div layout className='flex w-full'>
        <SlideListPanel
          isCollapsed={isCollapsed}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
        <motion.div layout className='flex-1'>
          <SlideContent selectedIndex={selectedIndex} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VisualPortfolioContent;
