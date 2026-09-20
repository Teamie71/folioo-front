'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type {
  ValueBalanceQuestion,
  ValueChoice,
} from '@/features/recommendation/types';

export type ValueQuestionPanel = {
  question: ValueBalanceQuestion;
  selected?: ValueChoice;
};

const DURATION = 0.4;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const variants = {
  initial: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 36 : -36,
  }),
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -36 : 36,
  }),
};

interface RecommendationValueQuestionTransitionProps {
  question: ValueBalanceQuestion;
  selected?: ValueChoice;
  className?: string;
  onSelect: (choice: ValueChoice) => void | Promise<void>;
  children: (
    panel: ValueQuestionPanel,
    selectChoice: (choice: ValueChoice) => void,
  ) => ReactNode;
}

export function RecommendationValueQuestionTransition({
  question,
  selected,
  className,
  onSelect,
  children,
}: RecommendationValueQuestionTransitionProps) {
  const [panel, setPanel] = useState<ValueQuestionPanel>({
    question,
    selected,
  });
  const [visible, setVisible] = useState(true);
  const [direction, setDirection] = useState(1);
  const busyRef = useRef(false);
  const pendingNextRef = useRef<ValueBalanceQuestion | null>(null);
  const panelSeqRef = useRef(panel.question.sequence);
  const questionRef = useRef(question);
  panelSeqRef.current = panel.question.sequence;
  questionRef.current = question;

  useEffect(() => {
    if (busyRef.current) return;

    if (question.sequence === panelSeqRef.current) {
      setPanel({ question, selected });
      return;
    }

    busyRef.current = true;
    setDirection(question.sequence < panelSeqRef.current ? -1 : 1);
    pendingNextRef.current = question;
    setVisible(false);
  }, [question, selected]);

  const selectChoice = (choice: ValueChoice) => {
    if (busyRef.current || !visible) return;

    busyRef.current = true;
    const seqBefore = panel.question.sequence;
    setPanel((prev) => ({ ...prev, selected: choice }));

    void (async () => {
      try {
        await onSelect(choice);
      } catch {
        setPanel((prev) => ({ ...prev, selected: undefined }));
        busyRef.current = false;
        return;
      }

      const next = questionRef.current;

      if (next.sequence === seqBefore) {
        setPanel({ question: next, selected: undefined });
        busyRef.current = false;
        return;
      }

      setDirection(1);
      pendingNextRef.current = next;
      setVisible(false);
    })();
  };

  const handleExitComplete = () => {
    const next = pendingNextRef.current;
    if (!next) return;

    pendingNextRef.current = null;
    setPanel({ question: next, selected: undefined });
    setVisible(true);
    busyRef.current = false;
  };

  return (
    <div className='relative w-full overflow-hidden'>
      <AnimatePresence
        mode='wait'
        initial={false}
        custom={direction}
        onExitComplete={handleExitComplete}
      >
        {visible ? (
          <motion.div
            key={panel.question.sequence}
            className={className}
            custom={direction}
            variants={variants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={{ duration: DURATION, ease: EASE }}
          >
            {children(panel, selectChoice)}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
