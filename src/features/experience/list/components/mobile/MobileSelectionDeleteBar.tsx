'use client';

import { useExperienceListStore } from '@/store/useExperienceListStore';

/**
 * '선택한 {N}개의 블록 삭제' 플로팅 버튼 (3-3, 모바일).
 *
 * 맵 뷰에서 블록 선택 삭제 중일 때 화면 하단 40px 위 중앙에 항상 떠 있는다.
 * 데스크톱은 툴바에 자리가 있지만 모바일은 없어서 플로팅으로 둔다.
 */
export function MobileSelectionDeleteBar() {
  const openModal = useExperienceListStore((s) => s.openModal);
  const selectedCount = useExperienceListStore(
    (s) => Object.keys(s.selectedBlockIds).length,
  );
  // 그룹이 포함되면 '미분류로 이동' 안내가 붙은 모달(3-6)을 띄워야 한다.
  const hasSelectedGroup = useExperienceListStore((s) =>
    Object.keys(s.selectedBlockIds).some((id) => id.startsWith('g:')),
  );

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-[40px] z-[70] flex justify-center px-[16px]'>
      <button
        type='button'
        disabled={selectedCount === 0}
        onClick={() =>
          openModal({
            type: hasSelectedGroup
              ? 'selection-delete-with-group'
              : 'selection-delete',
          })
        }
        className='bg-error-sub border-gray4 pointer-events-auto flex h-[44px] cursor-pointer items-center rounded-[8px] border px-[20px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] transition-opacity disabled:pointer-events-none disabled:opacity-50'
      >
        <span className='typo-b2 text-gray9 text-center whitespace-nowrap'>
          선택한 {selectedCount}개의 블록 삭제
        </span>
      </button>
    </div>
  );
}
