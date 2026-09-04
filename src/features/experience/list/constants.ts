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

/**
 * 미분류 그룹의 표시 이름.
 * 서버는 이 그룹을 kind(GROUP_UNCATEGORIZED)로만 구분하고 content는 null로 내려주므로,
 * 라벨은 클라이언트가 정한다.
 */
export const UNCLASSIFIED_NAME = '미분류';

export const DEFAULT_BLOCK_PLACEHOLDER = '내용을 입력해 주세요.';

/** 1단계(그룹) · 2단계(활동) 블록의 placeholder. (템플릿 문서 §0) */
export const GROUP_NAME_PLACEHOLDER = '그룹명을 입력해 주세요.';
export const EXPERIENCE_NAME_PLACEHOLDER = '활동명을 입력해 주세요.';

export const PROBLEM_EPISODE_PLACEHOLDER =
  '문제해결 에피소드를 한 줄로 요약해 주세요.';

export const DUTY_EPISODE_PLACEHOLDER =
  '담당한 주요 업무 또는 역할을 적어주세요.';

export const LEARNING_PLACEHOLDER =
  '이 활동을 통해 새롭게 배우거나 성장한 점은 무엇이며, 향후 어떻게 활용할 계획인가요?';

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

export const FREE_BLOCK_OPTION = { key: 'free', label: '자유 블록' } as const;

/** GET /templates 응답이 오기 전에 쓰는 기본 목록. */
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
  FREE_BLOCK_OPTION,
];

/** GET /templates 응답이 오기 전에 쓰는 기본 목록. */
export const DUTY_TEMPLATE_OPTIONS: Array<{
  key: DutyTemplateKey;
  label: string;
}> = [{ key: 'basic', label: '기본' }, FREE_BLOCK_OPTION];
