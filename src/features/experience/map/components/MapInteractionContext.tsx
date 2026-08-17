'use client';

import { createContext, useContext } from 'react';
import type { MapDetailLevel } from '@/features/experience/map/model/mapZoom';
import type { MapLayoutNode } from '@/features/experience/map/utils/mapLayout';

export type MapInteraction = {
  detail: MapDetailLevel;
  /** 마지막으로 클릭한 블록. 개별 삭제 아이콘이 여기에 노출된다. */
  activeId: string | null;
  editingId: string | null;
  /** 최소화 · 중간 수준에서 블록을 클릭했을 때 표준 수준으로 확대한다. */
  onBlockClick: (node: MapLayoutNode) => void;
  onEditingChange: (id: string, editing: boolean) => void;
};

const MapInteractionContext = createContext<MapInteraction | null>(null);

export const MapInteractionProvider = MapInteractionContext.Provider;

export function useMapInteraction(): MapInteraction {
  const value = useContext(MapInteractionContext);
  if (!value) {
    throw new Error('useMapInteraction must be used inside MapInteractionProvider');
  }
  return value;
}
