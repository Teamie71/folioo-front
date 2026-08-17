'use client';

import { memo } from 'react';
import { ListViewIcon } from '@/components/icons/ListViewIcon';
import {
  LIST_PREVIEW_BUTTON_HEIGHT,
  LIST_PREVIEW_BUTTON_WIDTH,
} from '@/features/experience/map/constants';

/**
 * '리스트로 확인하기' 버튼 (6).
 * 활동 미리보기 모달은 아직 연결하지 않는다.
 */
function MapListPreviewNodeComponent() {
  return (
    <button
      type='button'
      className='border-gray4 hover:bg-gray2 nodrag nopan flex cursor-pointer items-center justify-center gap-[4px] rounded-[6px] border bg-white transition-colors'
      style={{
        width: LIST_PREVIEW_BUTTON_WIDTH,
        height: LIST_PREVIEW_BUTTON_HEIGHT,
      }}
    >
      <ListViewIcon className='size-[16px]' />
      <span className='typo-c1 text-gray9'>리스트로 확인하기</span>
    </button>
  );
}

export const MapListPreviewNode = memo(MapListPreviewNodeComponent);
