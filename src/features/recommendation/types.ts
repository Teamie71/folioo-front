import type { ValueComparisonOptionResDTOValueKind } from '@/api/models';

export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export type HollandScores = Record<HollandCode, number>;
export type ValueChoice = 'left' | 'right';
export type ValueKind = ValueComparisonOptionResDTOValueKind;

export type InterestQuestion = {
  id: string;
  text: string;
};

export type ValueBalanceOption = {
  valueKind: ValueKind;
  label: string;
  card: string;
};

export type ValueBalanceQuestion = {
  sequence: number;
  left: ValueBalanceOption;
  right: ValueBalanceOption;
};

export type ValueBalanceHistoryItem = ValueBalanceQuestion & {
  chosen: ValueKind;
};

export type RecommendationMajorOption = {
  id: string;
  label: string;
};

export type HollandTypeResult = {
  code: HollandCode;
  name: string;
  description: string;
};

export type WorkConditionRank = {
  rank: 1 | 2 | 3;
  label: string;
};

export type RecommendedJob = {
  id: string;
  name: string;
  fitPercent: string;
  intro: string;
  skills: string[];
  activities: string[];
};

export type RecommendedCompany = {
  id: string;
  name: string;
  features: string;
  tip: string;
};

export type RecommendationResultData = {
  userName: string;
  headline: readonly [string, string];
  major: string;
  locked?: boolean;
  holland: {
    scores: HollandScores;
    types: HollandTypeResult[];
  };
  workConditions: WorkConditionRank[];
  jobs: RecommendedJob[];
  companies: RecommendedCompany[];
};
