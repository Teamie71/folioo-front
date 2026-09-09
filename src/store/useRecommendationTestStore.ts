import { create } from 'zustand/react';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { InterestLikertValue } from '@/features/recommendation/constants';
import type {
  ValueBalanceHistoryItem,
  ValueBalanceQuestion,
  ValueKind,
} from '@/features/recommendation/types';

const INITIAL_STATE = {
  majorId: '',
  interestAnswers: {} as Record<string, InterestLikertValue>,
  valueSessionToken: '',
  valueCurrent: null as ValueBalanceQuestion | null,
  valueHistory: [] as ValueBalanceHistoryItem[],
  valueRanking: null as ValueKind[] | null,
  assessmentUuid: '',
};

interface RecommendationTestStore {
  majorId: string;
  interestAnswers: Record<string, InterestLikertValue>;
  valueSessionToken: string;
  valueCurrent: ValueBalanceQuestion | null;
  valueHistory: ValueBalanceHistoryItem[];
  valueRanking: ValueKind[] | null;
  assessmentUuid: string;
  setMajorId: (majorId: string) => void;
  setInterestAnswer: (
    questionId: string,
    value: InterestLikertValue,
  ) => void;
  setValueSessionToken: (token: string) => void;
  setValueCurrent: (question: ValueBalanceQuestion | null) => void;
  setValueHistory: (history: ValueBalanceHistoryItem[]) => void;
  setValueRanking: (ranking: ValueKind[] | null) => void;
  setAssessmentUuid: (uuid: string) => void;
  resetValueSession: () => void;
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
      setValueSessionToken: (valueSessionToken) => set({ valueSessionToken }),
      setValueCurrent: (valueCurrent) => set({ valueCurrent }),
      setValueHistory: (valueHistory) => set({ valueHistory }),
      setValueRanking: (valueRanking) => set({ valueRanking }),
      setAssessmentUuid: (assessmentUuid) => set({ assessmentUuid }),
      resetValueSession: () =>
        set({
          valueSessionToken: '',
          valueCurrent: null,
          valueHistory: [],
          valueRanking: null,
          assessmentUuid: '',
        }),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'recommendation-test',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        majorId: state.majorId,
        interestAnswers: state.interestAnswers,
        valueSessionToken: state.valueSessionToken,
        valueCurrent: state.valueCurrent,
        valueHistory: state.valueHistory,
        valueRanking: state.valueRanking,
        assessmentUuid: state.assessmentUuid,
      }),
    },
  ),
);
