import type {
  DutyTemplateKey,
  ProblemTemplateKey,
  SectionKind,
  SectionTemplateKey,
} from '@/features/experience/list/types';

export const MAX_GROUP_COUNT = 50;
export const MAX_EXPERIENCE_COUNT = 50;

export type AgentPanelMode = 'comingSoon' | 'chat';

export const AGENT_PANEL_MODE: AgentPanelMode =
  process.env.NEXT_PUBLIC_AGENT_RELEASED === 'true' ? 'chat' : 'comingSoon';

export const AGENT_COMING_SOON_COPY = {
  titleFirstLine: '경험 정리를 도와주는',
  titleSecondLine: 'AI 에이전트를 준비 중이에요.',
  feedbackLead: '경험 정리 과정에서 어렵거나 불편한 점이 있다면',
  feedbackLinkLabel: '피드백',
  feedbackTail: '을 통해 알려주세요.',
  feedbackClosing: '보내주신 의견을 바탕으로 더 나은 서비스를 만들겠습니다.',
} as const;

export const UNCLASSIFIED_ID = 'unclassified';

export const DEFAULT_BLOCK_PLACEHOLDER = '내용을 입력해 주세요.';

export const PROBLEM_EPISODE_PLACEHOLDER =
  '문제해결 에피소드를 한 줄로 요약해 주세요.';

export const DUTY_EPISODE_PLACEHOLDER =
  '담당한 주요 업무 또는 역할을 적어주세요.';

export const FIXED_SECTION_KINDS: Array<Exclude<SectionKind, 'free'>> = [
  'detail',
  'achievement',
  'duty',
  'problem',
  'learning',
];

export const SECTION_TITLE: Record<SectionKind, string> = {
  detail: '상세정보',
  achievement: '주요성과',
  duty: '담당업무',
  problem: '문제해결',
  learning: '배운 점',
  free: '자유 블록',
};

export const SECTION_TEMPLATE_OPTIONS: Array<{
  key: SectionTemplateKey;
  label: string;
}> = [
  { key: 'detail', label: '상세정보' },
  { key: 'achievement', label: '주요성과' },
  { key: 'duty', label: '담당업무' },
  { key: 'problem', label: '문제해결' },
  { key: 'learning', label: '배운 점' },
  { key: 'free', label: '자유 블록' },
];

export const PROBLEM_TEMPLATE_OPTIONS: Array<{
  key: ProblemTemplateKey;
  label: string;
}> = [
  { key: 'basic', label: '기본' },
  { key: 'interpersonal', label: '대인관계' },
  { key: 'improvement', label: '성과 부진 개선' },
  { key: 'troubleshooting', label: '기술 트러블슈팅' },
  { key: 'feedback', label: '피드백 대응' },
  { key: 'recovery', label: '실패 회복' },
  { key: 'free', label: '자유 블록' },
];

export const DUTY_TEMPLATE_OPTIONS: Array<{
  key: DutyTemplateKey;
  label: string;
}> = [
  { key: 'basic', label: '기본' },
  { key: 'free', label: '자유 블록' },
];
