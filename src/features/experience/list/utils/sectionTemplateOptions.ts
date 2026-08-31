import {
  FIXED_SECTION_KINDS,
  SECTION_TEMPLATE_OPTIONS,
} from '@/features/experience/list/constants';
import type { Block } from '@/features/experience/list/types';

/**
 * 3단계 템플릿 드롭다운(5-2-2 / 3-2-1)에 띄울 목록.
 *
 * - 아직 보유하지 않은 기본 카테고리
 * - 자유 블록 — 이미 갖고 있어도 개수 제한 없이 계속 추가할 수 있어 항상 포함한다.
 *
 * 그래서 카테고리 5종을 모두 보유해도 목록이 비지 않는다.
 * (자유 블록 하나만 담긴 드롭다운이 뜬다)
 */
export function getAvailableSectionTemplateOptions(
  blocks: Block[],
): typeof SECTION_TEMPLATE_OPTIONS {
  const ownedFixed = new Set(
    blocks.map((b) => b.kind).filter((kind) => kind !== 'free'),
  );
  const missing = new Set<string>(
    FIXED_SECTION_KINDS.filter((kind) => !ownedFixed.has(kind)),
  );

  return SECTION_TEMPLATE_OPTIONS.filter(
    (opt) => opt.key === 'free' || missing.has(opt.key),
  );
}
