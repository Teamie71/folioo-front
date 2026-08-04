import {
  FIXED_SECTION_KINDS,
  SECTION_TEMPLATE_OPTIONS,
} from '@/features/experience/list/constants';
import type { Block } from '@/features/experience/list/types';

export function getAvailableSectionTemplateOptions(
  blocks: Block[],
): typeof SECTION_TEMPLATE_OPTIONS {
  const ownedFixed = new Set(
    blocks.map((b) => b.kind).filter((kind) => kind !== 'free'),
  );
  const missingFixed = FIXED_SECTION_KINDS.filter(
    (kind) => !ownedFixed.has(kind),
  );
  if (missingFixed.length === 0) return [];

  const missing = new Set<string>(missingFixed);
  return SECTION_TEMPLATE_OPTIONS.filter(
    (opt) => opt.key === 'free' || missing.has(opt.key),
  );
}
