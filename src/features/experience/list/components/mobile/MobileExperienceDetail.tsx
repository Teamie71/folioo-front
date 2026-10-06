'use client';

import { useEffect, useState } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { type MenuItem } from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { EXPERIENCE_NAME_PLACEHOLDER } from '@/features/experience/list/constants';
import { EmptyExperienceState } from '@/features/experience/list/components/ExperienceListEmptyStates';
import { MobileExperienceBlockTree } from '@/features/experience/list/components/mobile/MobileExperienceBlockTree';
import { MobileExperienceContentSkeleton } from '@/features/experience/list/components/mobile/MobileExperienceContentSkeleton';
import { MobileExperienceAgentSheet } from '@/features/experience/list/components/mobile/MobileExperienceAgentSheet';
import { MobileExperienceListDetailHeader } from '@/features/experience/list/components/mobile/MobileExperienceListDetailHeader';
import { MobileAgentFab } from '@/features/experience/list/components/mobile/MobileAgentFab';
import { MobileExperienceMapView } from '@/features/experience/list/components/mobile/MobileExperienceMapView';
import { MobileSelectionDeleteBar } from '@/features/experience/list/components/mobile/MobileSelectionDeleteBar';
import { ExperienceListViewSwitchToggle } from '@/features/experience/list/components/ExperienceListViewSwitchToggle';
import type { WorkspaceView } from '@/features/experience/workspace/model/workspaceView';

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
  const isCreatingExperience = useExperienceListStore((s) =>
    Boolean(s.pendingExperienceCreates[experienceId]),
  );
  const cancelBlockSelection = useExperienceListStore(
    (s) => s.cancelBlockSelection,
  );
  const startBlockSelection = useExperienceListStore(
    (s) => s.startBlockSelection,
  );
  const blockSelectionMode = useExperienceListStore(
    (s) => s.blockSelectionMode,
  );

  const [agentOpen, setAgentOpen] = useState(false);
  const [view, setView] = useState<WorkspaceView>('list');

  const experience = experiences.find((e) => e.id === experienceId);
  const group = experience
    ? groups.find((g) => g.id === experience.groupId)
    : undefined;

  useEffect(() => {
    if (!experience) onBack();
  }, [experience, onBack]);

  useEffect(() => {
    cancelBlockSelection();
    return cancelBlockSelection;
  }, [cancelBlockSelection, experienceId]);

  const changeView = (nextView: WorkspaceView) => {
    if (nextView === 'list') cancelBlockSelection();
    setView(nextView);
  };

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
    ...(view === 'map' && !blockSelectionMode
      ? [
          {
            key: 'selection-delete',
            label: '블록 선택 삭제',
            onSelect: startBlockSelection,
          },
        ]
      : []),
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
        <div className='relative mt-[20px] flex h-[29px] items-center'>
          <ExperienceListViewSwitchToggle
            value={view}
            onValueChange={changeView}
          />
          {view === 'map' && blockSelectionMode && (
            <button
              type='button'
              onClick={cancelBlockSelection}
              className='border-gray4 text-gray9 typo-b2 absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer rounded-[6px] border bg-white px-[12px] py-[6px]'
            >
              삭제 취소
            </button>
          )}
        </div>
      </div>

      {view === 'map' ? (
        <div className='mt-[16px] flex min-h-0 flex-1 flex-col'>
          <MobileExperienceMapView focusExperienceId={experience.id} />
        </div>
      ) : (
        <div className='mt-[16px] flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pb-[96px]'>
          {isContentLoading || isCreatingExperience ? (
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

      {view === 'map' && blockSelectionMode && <MobileSelectionDeleteBar />}

      {!agentOpen && <MobileAgentFab onClick={() => setAgentOpen(true)} />}

      <MobileExperienceAgentSheet
        open={agentOpen}
        onOpenChange={setAgentOpen}
        experienceId={experience.id}
        view={view}
      />
    </div>
  );
}
