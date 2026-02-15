import { create } from 'zustand/react';
import { devtools } from 'zustand/middleware';
import { z } from 'zod';

// Zod 스키마 (경험 설정)
export const experienceSettingsFormSchema = z.object({
  experienceName: z.string().min(1, '경험명을 입력해주세요').trim(),
  desiredJob: z.string().min(1, '희망 직군을 선택해주세요').trim(),
});

export type ExperienceSettingsFormData = z.infer<
  typeof experienceSettingsFormSchema
>;

export interface ExperienceCard {
  id: string;
  title: string;
  tag: string;
  date: string;
}

interface ExperienceStore {
  /* 나의 경험 카드 목록 (experience 페이지에 표시) */
  experienceCards: ExperienceCard[];
  addExperience: (card: ExperienceCard) => void;

  removeExperience: (id: string) => void;

  updateExperienceTitle: (id: string, title: string) => void;

  formData: {
    experienceName: string;
    desiredJob: string;
  };

  setFormField: <K extends keyof ExperienceStore['formData']>(
    field: K,
    value: ExperienceStore['formData'][K],
  ) => void;
  validateForm: () => {
    isValid: boolean;
    errors: Partial<Record<keyof ExperienceSettingsFormData, string>>;
  };
  resetForm: () => void;
}

export const useExperienceStore = create<ExperienceStore>()(
  devtools(
    (set, get) => ({
      // 나의 경험 카드 목록
      experienceCards: [],

      // 나의 경험 카드 추가
      addExperience: (card) =>
        set((state) => ({
          experienceCards: [card, ...state.experienceCards],
        })),

      // 나의 경험 카드 삭제
      removeExperience: (id) =>
        set((state) => ({
          experienceCards: state.experienceCards.filter(
            (card) => card.id !== id,
          ),
        })),

      // 경험 카드 제목 수정 (채팅 페이지에서 수정 시)
      updateExperienceTitle: (id, title) =>
        set((state) => ({
          experienceCards: state.experienceCards.map((card) =>
            card.id === id ? { ...card, title } : card,
          ),
        })),

      formData: {
        experienceName: '',
        desiredJob: '',
      },

      setFormField: (field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),

      validateForm: () => {
        const { formData } = get();
        const result = experienceSettingsFormSchema.safeParse(formData);

        if (result.success) {
          return { isValid: true, errors: {} };
        }

        const errors: Partial<
          Record<keyof ExperienceSettingsFormData, string>
        > = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0] as keyof ExperienceSettingsFormData;
          if (path) {
            errors[path] = issue.message;
          }
        });

        return { isValid: false, errors };
      },

      resetForm: () =>
        set({
          formData: {
            experienceName: '',
            desiredJob: '',
          },
        }),
    }),
    { name: 'experience-store' },
  ),
);
