import { CreateAssessmentReqDTOMajorField } from '@/api/models';
import type { CreateAssessmentReqDTOMajorField as MajorField } from '@/api/models';

const MAJOR_ID_TO_FIELD: Record<string, MajorField> = {
  'humanities-social': CreateAssessmentReqDTOMajorField.HUMANITIES_SOCIAL,
  'natural-science': CreateAssessmentReqDTOMajorField.NATURAL_SCIENCE,
  language: CreateAssessmentReqDTOMajorField.LANGUAGE,
  business: CreateAssessmentReqDTOMajorField.BUSINESS,
  economics: CreateAssessmentReqDTOMajorField.ECONOMICS,
  'media-communication': CreateAssessmentReqDTOMajorField.MEDIA_COMMUNICATION,
  'math-stats': CreateAssessmentReqDTOMajorField.MATH_STATISTICS,
  'computer-science': CreateAssessmentReqDTOMajorField.COMPUTER_SCIENCE,
  engineering: CreateAssessmentReqDTOMajorField.ENGINEERING,
  'art-design': CreateAssessmentReqDTOMajorField.ART_DESIGN,
};

const MAJOR_FIELD_LABELS: Record<
  Exclude<MajorField, null>,
  string
> = {
  HUMANITIES_SOCIAL: '인문·사회',
  NATURAL_SCIENCE: '자연과학',
  LANGUAGE: '어문',
  BUSINESS: '경영',
  ECONOMICS: '경제',
  MEDIA_COMMUNICATION: '미디어커뮤니케이션',
  MATH_STATISTICS: '수리·통계',
  COMPUTER_SCIENCE: '컴퓨터공학',
  ENGINEERING: '공학계열',
  ART_DESIGN: '예술·디자인',
};

export function toAssessmentMajorField(majorId: string): MajorField {
  if (!majorId || majorId === 'any' || majorId === 'other') return null;
  return MAJOR_ID_TO_FIELD[majorId] ?? null;
}

export function getMajorFieldLabel(majorField: MajorField | undefined): string {
  if (!majorField) return '전공과 관계없이 찾기';
  return MAJOR_FIELD_LABELS[majorField] ?? '전공과 관계없이 찾기';
}
