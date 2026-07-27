import {
  DEFAULT_BLOCK_PLACEHOLDER,
  FIXED_SECTION_KINDS,
  PROBLEM_EPISODE_PLACEHOLDER,
  SECTION_TITLE,
} from '@/features/experience/list/constants';
import type {
  Block,
  ProblemTemplateKey,
  SectionKind,
  SectionTemplateKey,
} from '@/features/experience/list/types';

const SECTION_TEMPLATE_CHILDREN: Record<
  Exclude<SectionKind, 'free'>,
  Array<{ placeholder: string; children?: string[] }>
> = {
  detail: [{ placeholder: DEFAULT_BLOCK_PLACEHOLDER }],
  achievement: [{ placeholder: DEFAULT_BLOCK_PLACEHOLDER }],
  duty: [{ placeholder: '담당한 주요 업무 또는 역할을 적어주세요.' }],
  problem: [
    {
      placeholder: PROBLEM_EPISODE_PLACEHOLDER,
      children: [
        '어떤 문제가 발생했으며, 이를 해결해야 했던 이유는 무엇인가요?',
      ],
    },
    {
      placeholder: PROBLEM_EPISODE_PLACEHOLDER,
      children: [
        '문제의 원인은 무엇이었고, 어떤 방식으로 원인을 파악했나요?',
      ],
    },
    {
      placeholder: PROBLEM_EPISODE_PLACEHOLDER,
      children: [
        '해결책을 도출한 과정과 구체적인 실행 방법은 무엇인가요?',
      ],
    },
    {
      placeholder: PROBLEM_EPISODE_PLACEHOLDER,
      children: [
        '해결책 적용 후 나타난 결과와 그 검증 방법, 그리고 이 과정을 통해 배운 점은 무엇인가요?',
      ],
    },
  ],
  learning: [
    {
      placeholder:
        '이 경험을 통해 새롭게 배우거나 성장한 점은 무엇이며, 향후 어떻게 활용할 계획인가요?',
    },
  ],
};

const PROBLEM_TEMPLATE_LEVEL5: Record<
  Exclude<ProblemTemplateKey, 'free'>,
  string[]
> = {
  basic: [
    '어떤 문제가 발생했으며, 이를 해결해야 했던 이유는 무엇인가요?',
    '문제의 원인은 무엇이었고, 어떤 방식으로 원인을 파악했나요?',
    '해결책을 도출한 과정과 구체적인 실행 방법은 무엇인가요?',
    '해결책 적용 후 나타난 결과와 그 검증 방법, 그리고 이 과정을 통해 배운 점은 무엇인가요?',
  ],
  interpersonal: [
    '누구와 어떤 상황에서 의견 차이나 문제가 발생했나요?',
    '문제를 해결하기 위해 상대방과 어떻게 소통하고 어떤 행동을 취했나요?',
    '본인의 대응으로 인해 상대방의 반응이나 상황은 어떻게 변화하고 마무리되었나요?',
    '이 과정을 통해 배운 점은 무엇이며, 향후 유사한 상황에 어떻게 적용할 계획인가요?',
  ],
  improvement: [
    '문제가 된 성과 지표는 무엇이며, 목표치와 실제 상태의 차이는 어느 정도였나요?',
    '목표에 도달하지 못한 근본적인 원인을 무엇으로 분석했나요?',
    '개선을 위해 기존 방식을 어떻게 변경하고 어떤 새로운 시도를 했나요?',
    '실행 후 지표는 어떻게 달라졌으며, 개선 효과를 어떻게 검증했나요?',
  ],
  troubleshooting: [
    '어떤 문제가 발생했으며, 그 문제가 미친 구체적인 영향 범위는 어디까지였나요?',
    '문제의 원인은 무엇이었으며, 이를 파악하기 위해 어떤 검증 과정을 거쳤나요?',
    '어떤 해결책을 선택하여 적용했으며, 여러 방법 중 그 방법을 채택한 이유는 무엇인가요?',
    '해결 여부를 어떻게 검증했으며, 재발 방지를 위해 어떤 대책을 수립했나요?',
  ],
  feedback: [
    '어떤 요청이나 불편 사항, 피드백이 반복적으로 접수되었나요?',
    '표면적인 의견 뒤에 있는 실제 니즈나 근본적인 문제점은 무엇으로 파악했나요?',
    '이를 해결하기 위해 구체적으로 어떤 대응책이나 개선안을 실행했나요?',
    '조치 이후 피드백을 준 대상의 반응이나 상황은 어떻게 달라졌나요?',
  ],
  recovery: [
    '아쉬웠던 결과, 구체적인 실수, 혹은 직면했던 한계는 무엇이었나요?',
    '이러한 결과나 실수가 발생하게 된 핵심적인 원인은 무엇이라고 판단했나요?',
    '이를 극복하고 보완하기 위해 구체적으로 어떤 노력을 했나요?',
    '이전과 비교하여 결과가 어떻게 변화했나요?',
  ],
};

let uidCounter = 0;
export function uid(prefix = 'b'): string {
  uidCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${uidCounter}`;
}

function freeBlock(text = '', placeholder?: string): Block {
  return {
    id: uid(),
    kind: 'free',
    text,
    editable: true,
    ...(placeholder ? { placeholder } : {}),
    children: [],
  };
}

function placeholderBlock(
  placeholder: string,
  children: Block[] = [],
  kind: SectionKind = 'free',
): Block {
  return {
    id: uid(),
    kind,
    text: '',
    editable: true,
    placeholder,
    children,
  };
}

function sectionBlockPlaceholders(kind: SectionKind): string[] {
  if (kind === 'free' || kind === 'problem') return [];
  return SECTION_TEMPLATE_CHILDREN[kind].map((n) => n.placeholder);
}

export function sectionBlockPlaceholderAt(
  kind: SectionKind,
  index: number,
): string | undefined {
  return sectionBlockPlaceholders(kind)[index];
}

export function buildSectionChildren(
  kind: Exclude<SectionKind, 'free'>,
): Block[] {
  return SECTION_TEMPLATE_CHILDREN[kind].map((node) =>
    placeholderBlock(
      node.placeholder,
      (node.children ?? []).map((p) => placeholderBlock(p)),
      kind === 'problem' ? 'problem' : 'free',
    ),
  );
}

function sectionBlock(kind: SectionKind, children: Block[] = []): Block {
  return {
    id: uid(),
    kind,
    text: SECTION_TITLE[kind],
    editable: kind === 'free',
    children,
  };
}

export function createSectionFromTemplate(key: SectionTemplateKey): Block {
  if (key === 'free') return freeBlock();
  return sectionBlock(key, []);
}

export function createProblemChildFromTemplate(key: ProblemTemplateKey): Block {
  if (key === 'free') return freeBlock();

  const level5 = PROBLEM_TEMPLATE_LEVEL5[key];
  return placeholderBlock(
    PROBLEM_EPISODE_PLACEHOLDER,
    level5.map((p) => placeholderBlock(p)),
    'problem',
  );
}

export function createExperienceTemplateBlocks(): Block[] {
  return FIXED_SECTION_KINDS.map((kind) => sectionBlock(kind, []));
}

export function createFreeBlock(text = '', placeholder?: string): Block {
  return freeBlock(text, placeholder);
}

export function createSectionBlock(
  kind: SectionKind,
  children: Block[] = [],
): Block {
  return sectionBlock(kind, children);
}
