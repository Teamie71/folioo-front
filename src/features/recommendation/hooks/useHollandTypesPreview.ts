'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { buildMockHollandTypes } from '@/features/recommendation/mock/hollandTypes';
import type { HollandTypeResult } from '@/features/recommendation/types';

export function useHollandTypesPreview(
  types: HollandTypeResult[],
): HollandTypeResult[] {
  const searchParams = useSearchParams();
  const typesParam = searchParams.get('types');

  return useMemo(() => {
    if (typesParam === '2') return buildMockHollandTypes(2);
    if (typesParam === '3') return buildMockHollandTypes(3);
    return types;
  }, [types, typesParam]);
}
