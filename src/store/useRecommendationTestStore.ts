import { create } from 'zustand/react';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { InterestLikertValue } from '@/features/recommendation/constants';
import type { ValueChoice } from '@/features/recommendation/types';

const INITIAL_STATE = {
  majorId: '',
  interestAnswers: {} as Record<string, InterestLikertValue>,
  valueAnswers: {} as Record<string, ValueChoice>,
  valueQuestionIndex: 0,
  hasSavedResult: false,
};

interface RecommendationTestStore {
  majorId: string;
  interestAnswers: Record<string, InterestLikertValue>;
  valueAnswers: Record<string, ValueChoice>;
  valueQuestionIndex: number;
  hasSavedResult: boolean;
  setMajorId: (majorId: string) => void;
  setInterestAnswer: (questionId: string, value: InterestLikertValue) => void;
  setValueAnswer: (questionId: string, choice: ValueChoice) => void;
  clearValueAnswers: (questionIds: string[]) => void;
  setValueQuestionIndex: (index: number) => void;
  setHasSavedResult: (hasSavedResult: boolean) => void;
  reset: () => void;
}

export const useRecommendationTestStore = create<RecommendationTestStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setMajorId: (majorId) => set({ majorId }),
      setInterestAnswer: (questionId, value) =>
        set((state) => ({
          interestAnswers: {
            ...state.interestAnswers,
            [questionId]: value,
          },
        })),
      setValueAnswer: (questionId, choice) =>
        set((state) => ({
          valueAnswers: {
            ...state.valueAnswers,
            [questionId]: choice,
          },
        })),
      clearValueAnswers: (questionIds) =>
        set((state) => {
          const valueAnswers = { ...state.valueAnswers };
          for (const id of questionIds) {
            delete valueAnswers[id];
          }
          return { valueAnswers };
        }),
      setValueQuestionIndex: (valueQuestionIndex) =>
        set({ valueQuestionIndex }),
      setHasSavedResult: (hasSavedResult) => set({ hasSavedResult }),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'recommendation-test',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        majorId: state.majorId,
        interestAnswers: state.interestAnswers,
        valueAnswers: state.valueAnswers,
        valueQuestionIndex: state.valueQuestionIndex,
        hasSavedResult: state.hasSavedResult,
      }),
    },
  ),
);
