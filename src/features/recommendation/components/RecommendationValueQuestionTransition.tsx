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
const OFFSET = 56;

const verticalVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? OFFSET : -OFFSET,
  }),
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -OFFSET : OFFSET,
  }),
};

/** 다음(direction>0): 왼쪽 아웃 / 오른쪽 인. 이전(direction<0): 오른쪽 아웃 / 왼쪽 인 */
const horizontalVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? OFFSET : -OFFSET,
  }),
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -OFFSET : OFFSET,
  }),
};

interface RecommendationValueQuestionTransitionProps {
  question: ValueBalanceQuestion;
  selected?: ValueChoice;
  axis?: 'x' | 'y';
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
  axis = 'y',
  className,
  onSelect,
  children,
}: RecommendationValueQuestionTransitionProps) {
  const [panel, setPanel] = useState<ValueQuestionPanel>({
    question,
    selected,
  });
  const [direction, setDirection] = useState(1);
  const busyRef = useRef(false);
  const questionRef = useRef(question);
  const panelSeqRef = useRef(panel.question.sequence);
  questionRef.current = question;
  panelSeqRef.current = panel.question.sequence;

  const variants = axis === 'x' ? horizontalVariants : verticalVariants;

  useEffect(() => {
    if (busyRef.current) return;

    if (question.sequence === panelSeqRef.current) {
      setPanel({ question, selected });
      return;
    }

    // goBack 등 외부 sequence 변경 → 이전/다음 방향 결정
    setDirection(question.sequence < panelSeqRef.current ? -1 : 1);
    setPanel({ question, selected: undefined });
  }, [question, selected]);

  const selectChoice = (choice: ValueChoice) => {
    if (busyRef.current) return;

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

      // 다음 문항: 항상 forward
      setDirection(1);
      setPanel({ question: next, selected: undefined });
      busyRef.current = false;
    })();
  };

  return (
    <div className={axis === 'x' ? 'relative overflow-hidden' : undefined}>
      <AnimatePresence mode='wait' custom={direction} initial={false}>
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
      </AnimatePresence>
    </div>
  );
}
