export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export type HollandScores = Record<HollandCode, number>;
export type ValueChoice = 'left' | 'right';

export type InterestQuestion = {
  id: string;
  text: string;
};

export type ValueQuestion = {
  id: string;
  left: string;
  right: string;
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
  holland: {
    scores: HollandScores;
    types: HollandTypeResult[];
  };
  workConditions: WorkConditionRank[];
  jobs: RecommendedJob[];
  companies: RecommendedCompany[];
};
