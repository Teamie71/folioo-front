import { HOLLAND_TYPES } from '@/features/recommendation/constants';
import type { HollandTypeResult } from '@/features/recommendation/types';

const PREVIEW_TYPE_CODES = ['C', 'R', 'I'] as const;

function hollandTypeFromCode(code: string): HollandTypeResult {
  const found = HOLLAND_TYPES.find((type) => type.code === code);
  if (!found) {
    throw new Error(`Unknown Holland type code: ${code}`);
  }
  return found;
}

export function buildMockHollandTypes(count: 1 | 2 | 3): HollandTypeResult[] {
  return PREVIEW_TYPE_CODES.slice(0, count).map(hollandTypeFromCode);
}
