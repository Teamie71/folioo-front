'use client';

import { useEffect, useState } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { type MenuItem } from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { EXPERIENCE_NAME_PLACEHOLDER } from '@/features/experience/list/constants';
import { ExperienceListViewSwitchToggle } from '@/features/experience/list/components/ExperienceListViewSwitchToggle';
import { MobileExperienceMapView } from '@/features/experience/list/components/mobile/MobileExperienceMapView';
import type { WorkspaceView } from '@/features/experience/workspace/model/workspaceView';
import { EmptyExperienceState } from '@/features/experience/list/components/ExperienceListEmptyStates';
import { MobileExperienceBlockTree } from '@/features/experience/list/components/mobile/MobileExperienceBlockTree';
import { MobileExperienceContentSkeleton } from '@/features/experience/list/components/mobile/MobileExperienceContentSkeleton';
import { MobileExperienceAgentSheet } from '@/features/experience/list/components/mobile/MobileExperienceAgentSheet';
import { MobileExperienceListDetailHeader } from '@/features/experience/list/components/mobile/MobileExperienceListDetailHeader';
import { MobileAgentFab } from '@/features/experience/list/components/mobile/MobileAgentFab';
import { MobileSelectionDeleteBar } from '@/features/experience/list/components/mobile/MobileSelectionDeleteBar';

type Props = {
  experienceId: string;
  onBack: () => void;
};

export function MobileExperienceDetail({ experienceId, onBack }: Props) {
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const renameExperience = useExperienceListStore((s) => s.renameExperience);
  const moveExperienceToGroup = useExperienceListStore(
    (s) => s.moveExperienceToGroup,
  );
  const openModal = useExperienceListStore((s) => s.openModal);
  const isContentLoading = useExperienceListStore((s) => s.isContentLoading);
  const blockSelectionMode = useExperienceListStore(
    (s) => s.blockSelectionMode,
  );
  const startBlockSelection = useExperienceListStore(
    (s) => s.startBlockSelection,
  );
  const cancelBlockSelection = useExperienceListStore(
    (s) => s.cancelBlockSelection,
  );

  const [agentOpen, setAgentOpen] = useState(false);
  const [mobileView, setMobileView] = useState<WorkspaceView>('list');

  const experience = experiences.find((e) => e.id === experienceId);
  const group = experience
    ? groups.find((g) => g.id === experience.groupId)
    : undefined;

  useEffect(() => {
    if (!experience) onBack();
  }, [experience, onBack]);

  // 선택 삭제는 맵 뷰 안에서만 유지한다.
  // 리스트로 돌아가거나 상세를 닫으면 선택을 풀어 다른 화면에 모드가 새지 않게 한다.
  useEffect(() => {
    if (mobileView !== 'map') cancelBlockSelection();
  }, [mobileView, cancelBlockSelection]);

  useEffect(() => cancelBlockSelection, [cancelBlockSelection]);

  if (!experience) return null;

  const experienceMenu: MenuItem[] = [
    {
      key: 'move',
      label: '그룹 이동',
      submenu: groups
        .filter((g) => g.id !== experience.groupId)
        .map((g) => ({
          key: g.id,
          label: g.name,
          onSelect: () => moveExperienceToGroup(experience.id, g.id),
        })),
    },
    {
      key: 'select-delete',
      label: '블록 선택 삭제',
      onSelect: () => {
        // 선택 삭제는 맵 뷰에서만 쓰는 동작이라 뷰를 함께 전환한다.
        setMobileView('map');
        startBlockSelection();
      },
    },
    {
      key: 'delete',
      label: '활동 삭제',
      onSelect: () =>
        openModal({
          type: 'experience-delete',
          experienceId: experience.id,
        }),
    },
  ];

  return (
    <div className='fixed inset-0 z-[60] flex flex-col bg-white'>
      <MobileExperienceListDetailHeader
        onBack={onBack}
        menuItems={experienceMenu}
        menuAriaLabel='활동 메뉴'
      />

      <div className='flex flex-col px-[16px] pt-[4px]'>
        <p className='typo-c1 text-gray6'>{group?.name ?? ''} &gt;</p>
        <EditableLabel
          as='h3'
          value={experience.name}
          placeholder={EXPERIENCE_NAME_PLACEHOLDER}
          editable
          maxLength={20}
          onCommit={(next) => renameExperience(experience.id, next)}
          className='typo-b2-sb text-gray9'
          inputClassName='typo-b2-sb text-gray9'
        />
        {/* 활동명 아래 20px: 맵뷰 / 리스트뷰 전환 토글 */}
        <div className='mt-[20px] flex items-center justify-between gap-[8px]'>
          <ExperienceListViewSwitchToggle
            value={mobileView}
            onValueChange={setMobileView}
          />

          {/* 삭제 취소 (3-4) — 선택 삭제 중에만 토글 오른쪽에 나타난다 */}
          {blockSelectionMode && (
            <button
              type='button'
              onClick={cancelBlockSelection}
              className='border-gray4 hover:bg-gray2 typo-c1-b text-gray9 flex h-[29px] shrink-0 cursor-pointer items-center rounded-[6px] border bg-white px-[12px] whitespace-nowrap transition-colors'
            >
              삭제 취소
            </button>
          )}
        </div>
      </div>

      {mobileView === 'map' ? (
        <div className='mt-[16px] flex min-h-0 flex-1 flex-col'>
          <MobileExperienceMapView focusExperienceId={experience.id} />
        </div>
      ) : (
        <div className='mt-[16px] flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pb-[96px]'>
          {isContentLoading ? (
            <MobileExperienceContentSkeleton />
          ) : experience.blocks.length === 0 ? (
            <EmptyExperienceState experienceId={experience.id} />
          ) : (
            <MobileExperienceBlockTree
              experienceId={experience.id}
              blocks={experience.blocks}
            />
          )}
        </div>
      )}

      {/* 선택한 {N}개의 블록 삭제 (3-3) — 화면 하단 40px 위 중앙 고정 */}
      {blockSelectionMode && mobileView === 'map' && (
        <MobileSelectionDeleteBar />
      )}

      {!agentOpen && <MobileAgentFab onClick={() => setAgentOpen(true)} />}

      <MobileExperienceAgentSheet
        open={agentOpen}
        onOpenChange={setAgentOpen}
      />
    </div>
  );
}
