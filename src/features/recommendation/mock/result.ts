import { HOLLAND_TYPES } from '@/features/recommendation/constants';
import type { RecommendationResultData } from '@/features/recommendation/types';

const JOB_DETAIL_PLACEHOLDER =
  '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용';

const COMPANY_DETAIL_PLACEHOLDER =
  '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용';

const COMPANY_TIP_PLACEHOLDER =
  '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용';

export const MOCK_RECOMMENDATION_RESULT: RecommendationResultData = {
  userName: 'OOO',
  headline: ['일과 삶의 균형을 중시하는', '체계형 인재'],
  major: '인문·사회',
  holland: {
    scores: {
      R: 0.52,
      I: 0.5,
      A: 0.42,
      S: 0.32,
      E: 0.38,
      C: 1,
    },
    types: [
      {
        code: 'C',
        name: '체계형(C)',
        description:
          HOLLAND_TYPES.find((type) => type.code === 'C')?.description ?? '',
      },
    ],
  },
  workConditions: [
    { rank: 1, label: '워라밸' },
    { rank: 2, label: '보상' },
    { rank: 3, label: '안정' },
  ],
  jobs: [
    {
      id: 'job-brand-marketing',
      name: '브랜드 마케팅',
      fitPercent: 'NN',
      intro: JOB_DETAIL_PLACEHOLDER,
      skills: ['내용내용내용', '내용내용내용', '내용내용내용'],
      activities: ['내용내용내용', '내용내용내용', '내용내용내용'],
    },
    {
      id: 'job-security-infra',
      name: '정보보안/네트워크인프라',
      fitPercent: 'NN',
      intro: JOB_DETAIL_PLACEHOLDER,
      skills: ['내용내용내용', '내용내용내용', '내용내용내용'],
      activities: ['내용내용내용', '내용내용내용', '내용내용내용'],
    },
    {
      id: 'job-scm',
      name: '구매/SCM',
      fitPercent: 'NN',
      intro: JOB_DETAIL_PLACEHOLDER,
      skills: ['내용내용내용', '내용내용내용', '내용내용내용'],
      activities: ['내용내용내용', '내용내용내용', '내용내용내용'],
    },
  ],
  companies: [
    {
      id: 'company-foreign',
      name: '외국계',
      features: COMPANY_DETAIL_PLACEHOLDER,
      tip: COMPANY_TIP_PLACEHOLDER,
    },
  ],
};
