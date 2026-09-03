import {
  DEFAULT_BLOCK_PLACEHOLDER,
  DUTY_EPISODE_PLACEHOLDER,
  FIXED_SECTION_KINDS,
  LEARNING_PLACEHOLDER,
  PROBLEM_EPISODE_PLACEHOLDER,
  SECTION_TITLE,
} from '@/features/experience/list/constants';
import type {
  Block,
  DutyTemplateKey,
  ProblemTemplateKey,
  SectionKind,
  SectionTemplateKey,
} from '@/features/experience/list/types';
import {
  catalogSlotPlaceholders,
  catalogSubTemplateOptions,
  catalogSubTemplateSlots,
} from '@/features/experience/list/api/templateCatalog';

/**
 * 3단계 템플릿 (placeholder 문서 §1 기본 제공 데이터 / §2 3단계 템플릿).
 *
 * 각 섹션 아래에 만들어지는 4단계 슬롯이다.
 * 담당업무·문제해결의 5단계는 아래 *_TEMPLATE_LEVEL5의 '기본' 템플릿에서 가져온다.
 * (담당업무: 4단계 하나에 5단계 4개 / 문제해결: 4단계 4개에 5단계 하나씩)
 */
const SECTION_SLOTS: Record<Exclude<SectionKind, 'free'>, string[]> = {
  detail: [
    '어떤 계기로 이 활동을 시작했으며, 최종적으로 달성하고자 한 목표는 무엇인가요?',
    '전체 진행 기간은 언제부터 언제까지였나요?',
    '본인의 역할은 무엇이었으며, 전체 인원과 역할 분담은 어떻게 구성되었나요?',
    '주요 타깃, 사용자, 혹은 고객은 누구였나요?',
    '진행 과정에서 본인이 직접 활용한 기술, 방법론, 혹은 툴은 무엇인가요?',
  ],
  achievement: [
    '수치로 증명할 수 있는 정량적인 성과는 무엇인가요?',
    '간접적인 지표로 확인할 수 있는 정성적인 성과는 무엇인가요?',
  ],
  duty: [DUTY_EPISODE_PLACEHOLDER],
  problem: [
    PROBLEM_EPISODE_PLACEHOLDER,
    PROBLEM_EPISODE_PLACEHOLDER,
    PROBLEM_EPISODE_PLACEHOLDER,
    PROBLEM_EPISODE_PLACEHOLDER,
  ],
  learning: [LEARNING_PLACEHOLDER],
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

const DUTY_TEMPLATE_LEVEL5: Record<
  Exclude<DutyTemplateKey, 'free'>,
  string[]
> = {
  basic: [
    '이 업무를 진행한 목적은 무엇이며, 구체적으로 어떤 목표를 달성하고자 했나요?',
    '원활한 업무 수행을 위해 조사한 정보나 추가로 학습한 내용은 무엇인가요?',
    '실제 작업은 어떤 방식으로, 어떤 과정을 거쳐서 진행했나요?',
    '업무 완료 후 나타난 결과는 무엇이며, 이 과정을 통해 배운 점은 무엇인가요?',
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
  if (kind === 'free') return [];
  return catalogSlotPlaceholders(kind) ?? SECTION_SLOTS[kind];
}

export function sectionBlockPlaceholderAt(
  kind: SectionKind,
  index: number,
): string | undefined {
  return sectionBlockPlaceholders(kind)[index];
}

/**
 * 섹션 아래에 붙일 4·5단계 블록을 만든다. (§1 기본 제공 데이터 / §2 3단계 템플릿)
 *
 * 담당업무는 4단계 하나 아래에 5단계 4개를 모두 넣고,
 * 문제해결은 4단계 4개에 5단계를 하나씩 나눠 넣는다.
 */
export function buildSectionChildren(
  kind: Exclude<SectionKind, 'free'>,
): Block[] {
  const slots = sectionBlockPlaceholders(kind);
  const childKind = kind === 'problem' || kind === 'duty' ? kind : 'free';

  if (kind === 'duty') {
    const level5 = defaultSubTemplateSlots('duty');
    return slots.map((placeholder, index) =>
      placeholderBlock(
        placeholder,
        index === 0 ? level5.map((p) => placeholderBlock(p)) : [],
        childKind,
      ),
    );
  }

  if (kind === 'problem') {
    const level5 = defaultSubTemplateSlots('problem');
    return slots.map((placeholder, index) =>
      placeholderBlock(
        placeholder,
        level5[index] ? [placeholderBlock(level5[index])] : [],
        childKind,
      ),
    );
  }

  return slots.map((placeholder) =>
    placeholderBlock(placeholder, [], childKind),
  );
}

function sectionBlock(kind: SectionKind, children: Block[] = []): Block {
  return {
    id: uid(),
    kind,
    text: SECTION_TITLE[kind],
    editable: false,
    children,
  };
}

export function createSectionFromTemplate(key: SectionTemplateKey): Block {
  if (key === 'free') return freeBlock();
  return sectionBlock(key, []);
}

/** 섹션의 기본(첫 번째) 하위 템플릿이 만드는 5단계 placeholder 목록. */
function defaultSubTemplateSlots(kind: 'duty' | 'problem'): string[] {
  const options = catalogSubTemplateOptions(kind);
  const first = options?.[0];
  if (first) return catalogSubTemplateSlots(kind, first.key) ?? [];
  return kind === 'duty'
    ? DUTY_TEMPLATE_LEVEL5.basic
    : PROBLEM_TEMPLATE_LEVEL5.basic;
}

/**
 * 서버가 CONTENT 블록에 일반 placeholder를 내려줄 때 기본 제공 5단계 슬롯을 복원한다.
 * 기본 템플릿의 순서는 화면설계서 및 GET /templates의 첫 번째 하위 템플릿과 같다.
 */
export function defaultSubTemplatePlaceholderAt(
  kind: 'duty' | 'problem',
  index: number,
): string | undefined {
  return defaultSubTemplateSlots(kind)[index];
}

/** 하위 템플릿의 level 5 placeholder. 서버 카탈로그를 우선 쓰고 없으면 기본 문구를 쓴다. */
function level5Placeholders(
  kind: 'duty' | 'problem',
  key: string,
): string[] | undefined {
  const fromCatalog = catalogSubTemplateSlots(kind, key);
  if (fromCatalog) return fromCatalog;

  const fallback =
    kind === 'duty'
      ? DUTY_TEMPLATE_LEVEL5[key as keyof typeof DUTY_TEMPLATE_LEVEL5]
      : PROBLEM_TEMPLATE_LEVEL5[key as keyof typeof PROBLEM_TEMPLATE_LEVEL5];
  return fallback;
}

/**
 * 담당업무·문제해결 템플릿으로 4단계 블록을 새로 만든다. (§3 · §4)
 *
 * 문서: "아래 표 내의 5단계 블록은 모두 해당 4단계 블록 아래에 생성한다."
 * 그래서 4단계 하나와 그 템플릿의 5단계 전부를 함께 만든다.
 * (이미 있는 4단계 아래에 5단계만 더하는 경우는 create*Level5FromTemplate가 맡는다)
 */
export function createProblemChildFromTemplate(key: ProblemTemplateKey): Block {
  // 자유 블록도 문제해결 아래 4단계이므로 §1의 placeholder를 그대로 쓴다. (§0)
  if (key === 'free') {
    return placeholderBlock(PROBLEM_EPISODE_PLACEHOLDER, [], 'problem');
  }

  const level5 = level5Placeholders('problem', key) ?? [];
  return placeholderBlock(
    PROBLEM_EPISODE_PLACEHOLDER,
    level5.map((p) => placeholderBlock(p)),
    'problem',
  );
}

export function createDutyChildFromTemplate(key: DutyTemplateKey): Block {
  if (key === 'free') {
    return placeholderBlock(DUTY_EPISODE_PLACEHOLDER, [], 'duty');
  }

  const level5 = level5Placeholders('duty', key) ?? [];
  return placeholderBlock(
    DUTY_EPISODE_PLACEHOLDER,
    level5.map((p) => placeholderBlock(p)),
    'duty',
  );
}

export function createDutyLevel5FromTemplate(key: DutyTemplateKey): Block[] {
  if (key === 'free') return [freeBlock()];
  const level5 = level5Placeholders('duty', key);
  return level5 ? level5.map((p) => placeholderBlock(p)) : [freeBlock()];
}

export function createProblemLevel5FromTemplate(
  key: ProblemTemplateKey,
): Block[] {
  if (key === 'free') return [freeBlock()];
  const level5 = level5Placeholders('problem', key);
  return level5 ? level5.map((p) => placeholderBlock(p)) : [freeBlock()];
}

/**
 * 활동 하나의 기본 제공 데이터. (§1)
 *
 * 섹션 5종과 그 아래 4·5단계 슬롯까지 모두 만든다. (섹션 포함 26블록)
 * 로그인 상태에서는 서버가 같은 구조를 만들어 주므로 비로그인 기본 데이터에 쓴다.
 */
export function createExperienceTemplateBlocks(): Block[] {
  return FIXED_SECTION_KINDS.map((kind) =>
    sectionBlock(kind, buildSectionChildren(kind)),
  );
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
