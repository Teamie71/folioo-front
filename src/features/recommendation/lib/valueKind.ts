import { ValueComparisonOptionResDTOValueKind as ValueKind } from '@/api/models';

export const VALUE_KIND_LABELS: Record<string, string> = {
  [ValueKind.REWARD]: '보상',
  [ValueKind.STABILITY]: '안정',
  [ValueKind.NAME_VALUE]: '네임밸류',
  [ValueKind.GROWTH]: '성장',
  [ValueKind.WORK_LIFE_BALANCE]: '워라밸',
};

export function getValueKindLabel(kind: string): string {
  return VALUE_KIND_LABELS[kind] ?? kind;
}
