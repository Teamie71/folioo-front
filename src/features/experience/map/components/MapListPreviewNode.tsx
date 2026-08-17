'use client';

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { useActivityPreview } from '@/features/experience/map/hooks/useActivityPreview';

export type MapListPreviewNodeData = { experienceId: string };

/** '리스트로 확인하기' 버튼 (6). 클릭 시 활동 미리보기 모달(6-1)을 연다. */
function MapListPreviewNodeComponent({ data }: NodeProps) {
  const { experienceId } = data as unknown as MapListPreviewNodeData;
  const { open } = useActivityPreview();

  return (
    <button
      type='button'
      className='border-gray4 hover:bg-gray2 nodrag nopan cursor-pointer rounded-[6px] border bg-white px-[12px] py-[6px] transition-colors'
      onClick={(event) => {
        event.stopPropagation();
        open(experienceId);
      }}
    >
      <span className='typo-b2 text-gray9'>리스트로 확인하기</span>
    </button>
  );
}

export const MapListPreviewNode = memo(MapListPreviewNodeComponent);
