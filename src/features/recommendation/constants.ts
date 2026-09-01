import type { HollandCode, HollandTypeResult } from '@/features/recommendation/types';

export const RECOMMENDATION_QUERY_KEYS = {
  majors: ['recommendation', 'majors'] as const,
  interestQuestions: ['recommendation', 'interest-questions'] as const,
  valueQuestions: ['recommendation', 'value-questions'] as const,
  result: ['recommendation', 'result'] as const,
  sharedResult: ['recommendation', 'shared-result'] as const,
};

export const RECOMMENDATION_TEST_STEPS = ['전공', '흥미', '가치관'] as const;

export const RECOMMENDATION_MAJOR_MOBILE_ROWS = [
  ['humanities-social', 'language', 'business', 'economics'],
  ['media-communication', 'natural-science'],
  ['math-stats', 'engineering', 'computer-science'],
  ['art-design', 'other'],
  ['any'],
] as const;

export const INTEREST_LIKERT_OPTIONS = [
  { value: 1, tone: 'agree', size: 44 },
  { value: 2, tone: 'agree', size: 36 },
  { value: 3, tone: 'agree', size: 30 },
  { value: 4, tone: 'disagree', size: 30 },
  { value: 5, tone: 'disagree', size: 36 },
  { value: 6, tone: 'disagree', size: 44 },
] as const;

export type InterestLikertValue =
  (typeof INTEREST_LIKERT_OPTIONS)[number]['value'];

export const HOLLAND_AXIS_ORDER: readonly HollandCode[] = [
  'R',
  'I',
  'A',
  'S',
  'E',
  'C',
];

export const HOLLAND_TYPES: HollandTypeResult[] = [
  {
    code: 'R',
    name: '현장형 (R)',
    description:
      '분명하고, 체계적인 것을 좋아하고, 도구나 기계를 조작하는 활동이나 기술에 흥미가 있어요.',
  },
  {
    code: 'I',
    name: '탐구형 (I)',
    description:
      '관찰적, 체계적이며 물리적, 생물학적, 문화적 현상의 창조적인 탐구를 수반하는 활동에 흥미가 있어요.',
  },
  {
    code: 'A',
    name: '창작형 (A)',
    description:
      '예술적 창조와 표현, 변화와 다양성을 선호하고 틀에 박힌 것을 싫어하며 모호하고, 자유롭고, 상징적인 활동에 흥미가 있어요.',
  },
  {
    code: 'S',
    name: '공감형 (S)',
    description:
      '타인의 문제를 듣고, 이해하고, 도와주고, 함께하는 활동에 흥미가 있어요.',
  },
  {
    code: 'E',
    name: '추진형 (E)',
    description:
      '조직의 목적과 경제적인 이익을 얻기 위해 타인을 지도, 계획, 통제, 관리하는 일과 그 결과로 얻어지는 명예, 인정, 권위에 흥미가 있어요.',
  },
  {
    code: 'C',
    name: '체계형 (C)',
    description:
      '정해진 원칙과 계획에 따라 자료를 기록, 정리, 조직하는 일을 좋아하고 체계적인 작업환경에서 사무적, 계산적 능력을 발휘하는 활동에 흥미가 있어요.',
  },
];

export const RECOMMENDATION_WHITE_BUTTON_HOVER =
  'transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:bg-sub-hover';

export const RECOMMENDATION_SUB_BUTTON_CLASS =
  'bg-sub1 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-sub-hover [@media(hover:hover)_and_(pointer:fine)]:transition-colors';
