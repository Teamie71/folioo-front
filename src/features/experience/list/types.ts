export type SectionKind =
  | 'detail'
  | 'achievement'
  | 'duty'
  | 'problem'
  | 'learning'
  | 'free';

export type Block = {
  id: string;
  kind: SectionKind;
  text: string;
  editable: boolean;
  placeholder?: string;
  children: Block[];
};

export type Experience = {
  id: string;
  groupId: string;
  name: string;
  blocks: Block[];
};

export type Group = {
  id: string;
  name: string;
  /** 미분류 그룹은 이름 수정·삭제·케밥 불가 */
  isUnclassified: boolean;
};

export type SectionTemplateKey = SectionKind;

/**
 * 담당업무·문제해결 하위 템플릿 키.
 *
 * GET /templates 가 내려주는 templateId를 그대로 쓴다. ('free'는 자유 블록 전용 값)
 * 카탈로그를 받기 전에는 constants의 기본 목록을 쓰므로 문자열 리터럴도 그대로 허용한다.
 */
export type TemplateKey = 'free' | (string & {});

export type ProblemTemplateKey = TemplateKey;

export type DutyTemplateKey = TemplateKey;
