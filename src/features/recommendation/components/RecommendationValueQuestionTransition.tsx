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
  const [direction, setDirection] = useState<1 | -1>(1);
  const [motionActive, setMotionActive] = useState(false);
  const busyRef = useRef(false);
  const pendingNextRef = useRef<ValueBalanceQuestion | null>(null);
  const shouldExitRef = useRef(false);
  const isEnteringRef = useRef(false);
  const panelSeqRef = useRef(panel.question.sequence);
  const questionRef = useRef(question);
  panelSeqRef.current = panel.question.sequence;
  questionRef.current = question;

  const queueTransition = (next: ValueBalanceQuestion, dir: 1 | -1) => {
    pendingNextRef.current = next;
    setDirection(dir);
    isEnteringRef.current = false;
    shouldExitRef.current = true;
    setMotionActive(true);
  };

  useEffect(() => {
    if (busyRef.current) return;

    if (question.sequence === panelSeqRef.current) {
      setPanel({ question, selected });
      return;
    }

    busyRef.current = true;
    const dir: 1 | -1 =
      question.sequence < panelSeqRef.current ? -1 : 1;
    queueTransition(question, dir);
  }, [question, selected]);

  useEffect(() => {
    if (!motionActive || !shouldExitRef.current) return;
    shouldExitRef.current = false;
    const id = window.requestAnimationFrame(() => {
      setVisible(false);
    });
    return () => window.cancelAnimationFrame(id);
  }, [motionActive]);

  const selectChoice = (choice: ValueChoice) => {
    if (busyRef.current || motionActive) return;

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

      queueTransition(next, 1);
    })();
  };

  const handleExitComplete = () => {
    const next = pendingNextRef.current;
    if (!next) {
      setVisible(true);
      setMotionActive(false);
      busyRef.current = false;
      return;
    }

    pendingNextRef.current = null;
    isEnteringRef.current = true;
    setPanel({ question: next, selected: undefined });
    setVisible(true);
  };

  const content = children(panel, selectChoice);

  if (!motionActive) {
    return <div className={className}>{content}</div>;
  }

  return (
    <AnimatePresence
      mode='wait'
      custom={direction}
      onExitComplete={handleExitComplete}
    >
      {visible ? (
        <motion.div
          key={panel.question.sequence}
          className={className}
          custom={direction}
          variants={variants}
          initial={isEnteringRef.current ? 'initial' : false}
          animate='animate'
          exit='exit'
          transition={{ duration: DURATION, ease: EASE }}
          onAnimationComplete={(definition) => {
            if (definition === 'animate' && isEnteringRef.current) {
              isEnteringRef.current = false;
              setMotionActive(false);
              busyRef.current = false;
            }
          }}
        >
          {content}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
