import { create } from 'zustand/react';
import { devtools } from 'zustand/middleware';
import { z } from 'zod';

// Zod 스키마
export const logFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').trim(),
  activityName: z.string().optional(),
  category: z.string().refine((val) => val !== 'none', {
    message: '카테고리를 선택해주세요.',
  }),
  content: z.string().min(1, '내용을 입력해주세요.').trim(),
});

export type LogFormData = z.infer<typeof logFormSchema>;

export interface LogCardData {
  id: string;
  title: string;
  activityName: string;
  category: string;
  content: string;
  date: string;
}

interface LogStore {
  // 로그 목록
  logCards: LogCardData[];

  // 검색 필터
  selectedCategoryId: string;
  selectedActivityId: string;

  // Actions
  addLog: (log: LogCardData) => void;
  removeLog: (id: string) => void;
  clearLogs: () => void;
  setSelectedCategoryId: (id: string) => void;
  setSelectedActivityId: (id: string) => void;
}

export const useLogStore = create<LogStore>()(
  devtools(
    (set) => ({
      // Initial state
      logCards: [],
      selectedCategoryId: '',
      selectedActivityId: '',

      // Actions
      addLog: (log: LogCardData) =>
        set((state) => ({
          logCards: [log, ...state.logCards],
        })),

      removeLog: (id: string) =>
        set((state) => ({
          logCards: state.logCards.filter((log) => log.id !== id),
        })),

      clearLogs: () =>
        set({
          logCards: [],
        }),

      setSelectedCategoryId: (id: string) =>
        set({
          selectedCategoryId: id,
        }),

      setSelectedActivityId: (id: string) =>
        set({
          selectedActivityId: id,
        }),
    }),
    {
      name: 'log-store',
    },
  ),
);
