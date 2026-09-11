import { create } from 'zustand/react';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { InterestLikertValue } from '@/features/recommendation/constants';
import type {
  ValueBalanceHistoryItem,
  ValueBalanceQuestion,
  ValueKind,
} from '@/features/recommendation/types';

const DRAFT_STATE = {
  majorId: '',
  interestAnswers: {} as Record<string, InterestLikertValue>,
  valueSessionToken: '',
  valueCurrent: null as ValueBalanceQuestion | null,
  valueHistory: [] as ValueBalanceHistoryItem[],
  valueRanking: null as ValueKind[] | null,
};

const INITIAL_STATE = {
  ...DRAFT_STATE,
  assessmentUuid: '',
  hasHydrated: false,
};

interface RecommendationTestStore {
  majorId: string;
  interestAnswers: Record<string, InterestLikertValue>;
  valueSessionToken: string;
  valueCurrent: ValueBalanceQuestion | null;
  valueHistory: ValueBalanceHistoryItem[];
  valueRanking: ValueKind[] | null;
  assessmentUuid: string;
  /** sessionStorage rehydrate 완료 여부. 완료 전 redirect/create 하면 빈 상태로 오판한다. */
  hasHydrated: boolean;
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
  setHasHydrated: (hasHydrated: boolean) => void;
  resetValueSession: () => void;
  /** 전공/흥미/가치관 진행값만 제거. 이탈 시 저장하지 않기 위함. */
  clearDraft: () => void;
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
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      resetValueSession: () =>
        set({
          valueSessionToken: '',
          valueCurrent: null,
          valueHistory: [],
          valueRanking: null,
          assessmentUuid: '',
        }),
      clearDraft: () => set({ ...DRAFT_STATE }),
      reset: () => set({ ...INITIAL_STATE, hasHydrated: true }),
    }),
    {
      name: 'recommendation-test',
      storage: createJSONStorage(() => sessionStorage),
      // 완료 uuid만 유지. 전공/흥미/가치관은 이탈 시 저장하지 않는다.
      partialize: (state) => ({
        assessmentUuid: state.assessmentUuid,
      }),
      onRehydrateStorage: () => (state) => {
        // 예전 storage에 남아 있던 전공/흥미/가치관 draft는 복원하지 않는다.
        state?.clearDraft();
        state?.setHasHydrated(true);
      },
    },
  ),
);
