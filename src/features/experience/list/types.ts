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

export type ProblemTemplateKey =
  | 'basic'
  | 'interpersonal'
  | 'improvement'
  | 'troubleshooting'
  | 'feedback'
  | 'recovery'
  | 'free';
