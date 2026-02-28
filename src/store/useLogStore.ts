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

export type TemplateType =
  | 'none'
  | '대인관계'
  | '문제해결'
  | '학습'
  | '레퍼런스'
  | '기타';

export interface LogCardData {
  id: string;
  title: string;
  activityName: string;
  category: string;
  content: string;
  date: string;
}

// 템플릿 데이터 타입
interface InterpersonData {
  situation: string;
  response: string;
  result: string;
  lesson: string;
}

interface ProblemSolveData {
  problem: string;
  attempt: string;
  result: string;
  lesson: string;
}

interface LearningData {
  path: string;
  learned: string;
  plan: string;
}

interface ReferenceData {
  source: string;
  content: string;
  thought: string;
  plan: string;
}

interface Activity {
  id: string;
  label: string;
}

interface LogStore {
  // 로그 목록
  logCards: LogCardData[];

  // 검색 필터
  selectedCategoryId: string;
  selectedActivityId: string;

  // 폼 상태
  formData: {
    title: string;
    activityName: string;
    category: string;
    content: string;
  };

  // 템플릿 상태
  isTemplateEnabled: boolean;
  selectedTemplate: TemplateType;
  noTemplateContent: string;
  interpersonData: InterpersonData;
  problemSolveData: ProblemSolveData;
  learningData: LearningData;
  referenceData: ReferenceData;

  // 활동 목록
  activities: Activity[];

  // 폼 Actions
  setFormField: <K extends keyof LogStore['formData']>(
    field: K,
    value: LogStore['formData'][K],
  ) => void;
  resetForm: () => void;
  validateForm: () => {
    isValid: boolean;
    errors: Partial<Record<keyof LogFormData, string>>;
  };

  // 템플릿 Actions
  setIsTemplateEnabled: (enabled: boolean) => void;
  setSelectedTemplate: (template: TemplateType) => void;
  setNoTemplateContent: (content: string) => void;
  setInterpersonData: (
    data: InterpersonData | ((prev: InterpersonData) => InterpersonData),
  ) => void;
  setProblemSolveData: (
    data: ProblemSolveData | ((prev: ProblemSolveData) => ProblemSolveData),
  ) => void;
  setLearningData: (
    data: LearningData | ((prev: LearningData) => LearningData),
  ) => void;
  setReferenceData: (
    data: ReferenceData | ((prev: ReferenceData) => ReferenceData),
  ) => void;
  getFormattedContent: () => string;
  getCurrentTemplateFields: () => string[];

  // 로그 Actions
  addLog: (log: LogCardData) => void;
  updateLog: (id: string, data: Partial<LogCardData>) => void;
  removeLog: (id: string) => void;
  clearLogs: () => void;
  setSelectedCategoryId: (id: string) => void;
  setSelectedActivityId: (id: string) => void;

  // 활동 Actions
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
}

export const useLogStore = create<LogStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      logCards: [],
      selectedCategoryId: '',
      selectedActivityId: '',

      // 폼 초기 상태
      formData: {
        title: '',
        activityName: '',
        category: 'none',
        content: '',
      },

      // 템플릿 초기 상태
      isTemplateEnabled: false,
      selectedTemplate: 'none',
      noTemplateContent: '',
      interpersonData: {
        situation: '',
        response: '',
        result: '',
        lesson: '',
      },
      problemSolveData: {
        problem: '',
        attempt: '',
        result: '',
        lesson: '',
      },
      learningData: {
        path: '',
        learned: '',
        plan: '',
      },
      referenceData: {
        source: '',
        content: '',
        thought: '',
        plan: '',
      },

      // 활동 초기 상태
      activities: [
        { id: '1', label: '활동 A' },
        { id: '2', label: '활동 B' },
      ],

      // 폼 Actions
      setFormField: (field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),

      resetForm: () =>
        set({
          formData: {
            title: '',
            activityName: '',
            category: 'none',
            content: '',
          },
          isTemplateEnabled: false,
          selectedTemplate: 'none',
          noTemplateContent: '',
          interpersonData: {
            situation: '',
            response: '',
            result: '',
            lesson: '',
          },
          problemSolveData: {
            problem: '',
            attempt: '',
            result: '',
            lesson: '',
          },
          learningData: {
            path: '',
            learned: '',
            plan: '',
          },
          referenceData: {
            source: '',
            content: '',
            thought: '',
            plan: '',
          },
        }),

      validateForm: () => {
        const { formData } = get();
        const result = logFormSchema.safeParse(formData);

        if (result.success) {
          return { isValid: true, errors: {} };
        }

        const errors: Partial<Record<keyof LogFormData, string>> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0] as keyof LogFormData;
          if (path) {
            errors[path] = issue.message;
          }
        });

        return { isValid: false, errors };
      },

      // 템플릿 Actions
      setIsTemplateEnabled: (enabled) =>
        set((state) => {
          if (!enabled) {
            return { isTemplateEnabled: false };
          }
          return { isTemplateEnabled: enabled };
        }),

      setSelectedTemplate: (template) =>
        set({
          selectedTemplate: template,
        }),

      setNoTemplateContent: (content) =>
        set({
          noTemplateContent: content,
        }),

      setInterpersonData: (data) =>
        set((state) => ({
          interpersonData:
            typeof data === 'function' ? data(state.interpersonData) : data,
        })),

      setProblemSolveData: (data) =>
        set((state) => ({
          problemSolveData:
            typeof data === 'function' ? data(state.problemSolveData) : data,
        })),

      setLearningData: (data) =>
        set((state) => ({
          learningData:
            typeof data === 'function' ? data(state.learningData) : data,
        })),

      setReferenceData: (data) =>
        set((state) => ({
          referenceData:
            typeof data === 'function' ? data(state.referenceData) : data,
        })),

      getFormattedContent: () => {
        const state = get();
        let formattedContent = '';

        if (!state.isTemplateEnabled || state.selectedTemplate === 'none') {
          formattedContent = state.noTemplateContent;
        } else {
          switch (state.selectedTemplate) {
            case '대인관계':
              formattedContent = [
                state.interpersonData.situation &&
                  `상황 - ${state.interpersonData.situation}`,
                state.interpersonData.response &&
                  `나의 반응 - ${state.interpersonData.response}`,
                state.interpersonData.result &&
                  `결과 - ${state.interpersonData.result}`,
                state.interpersonData.lesson &&
                  `배운 점 - ${state.interpersonData.lesson}`,
              ]
                .filter(Boolean)
                .join('\n');
              break;
            case '문제해결':
              formattedContent = [
                state.problemSolveData.problem &&
                  `문제 - ${state.problemSolveData.problem}`,
                state.problemSolveData.attempt &&
                  `시도 - ${state.problemSolveData.attempt}`,
                state.problemSolveData.result &&
                  `결과 - ${state.problemSolveData.result}`,
                state.problemSolveData.lesson &&
                  `배운 점 - ${state.problemSolveData.lesson}`,
              ]
                .filter(Boolean)
                .join('\n');
              break;
            case '학습':
              formattedContent = [
                state.learningData.path &&
                  `학습 경로 - ${state.learningData.path}`,
                state.learningData.learned &&
                  `배운 내용 - ${state.learningData.learned}`,
                state.learningData.plan &&
                  `적용 계획 - ${state.learningData.plan}`,
              ]
                .filter(Boolean)
                .join('\n');
              break;
            case '레퍼런스':
              formattedContent = [
                state.referenceData.source &&
                  `출처 - ${state.referenceData.source}`,
                state.referenceData.content &&
                  `내용 - ${state.referenceData.content}`,
                state.referenceData.thought &&
                  `생각 - ${state.referenceData.thought}`,
                state.referenceData.plan &&
                  `적용 계획 - ${state.referenceData.plan}`,
              ]
                .filter(Boolean)
                .join('\n');
              break;
            case '기타':
              formattedContent = state.noTemplateContent;
              break;
          }
        }

        return formattedContent;
      },

      getCurrentTemplateFields: () => {
        const state = get();
        if (
          state.selectedTemplate === 'none' ||
          state.selectedTemplate === '기타'
        ) {
          return [state.noTemplateContent];
        }
        switch (state.selectedTemplate) {
          case '대인관계':
            return [
              state.interpersonData.situation,
              state.interpersonData.response,
              state.interpersonData.result,
              state.interpersonData.lesson,
            ];
          case '문제해결':
            return [
              state.problemSolveData.problem,
              state.problemSolveData.attempt,
              state.problemSolveData.result,
              state.problemSolveData.lesson,
            ];
          case '학습':
            return [
              state.learningData.path,
              state.learningData.learned,
              state.learningData.plan,
            ];
          case '레퍼런스':
            return [
              state.referenceData.source,
              state.referenceData.content,
              state.referenceData.thought,
              state.referenceData.plan,
            ];
          default:
            return [state.noTemplateContent];
        }
      },

      // 로그 Actions
      addLog: (log) =>
        set((state) => ({
          logCards: [log, ...state.logCards],
        })),

      updateLog: (id, data) =>
        set((state) => ({
          logCards: state.logCards.map((log) =>
            log.id === id ? { ...log, ...data } : log,
          ),
        })),

      removeLog: (id) =>
        set((state) => ({
          logCards: state.logCards.filter((log) => log.id !== id),
        })),

      clearLogs: () =>
        set({
          logCards: [],
        }),

      setSelectedCategoryId: (id) =>
        set({
          selectedCategoryId: id,
        }),

      setSelectedActivityId: (id) =>
        set({
          selectedActivityId: id,
        }),

      // 활동 Actions
      addActivity: (activity) =>
        set((state) => ({
          activities: [...state.activities, activity],
        })),

      removeActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((act) => act.id !== id),
        })),
    }),
    {
      name: 'log-store',
    },
  ),
);
