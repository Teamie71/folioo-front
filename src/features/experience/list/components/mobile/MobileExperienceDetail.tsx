'use client';

import { useEffect, useState } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { type MenuItem } from '@/features/experience/list/components/ExperienceListMenu';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { EmptyExperienceState } from '@/features/experience/list/components/ExperienceListEmptyStates';
import { MobileExperienceBlockTree } from '@/features/experience/list/components/mobile/MobileExperienceBlockTree';
import { MobileExperienceContentSkeleton } from '@/features/experience/list/components/mobile/MobileExperienceContentSkeleton';
import { MobileExperienceAgentSheet } from '@/features/experience/list/components/mobile/MobileExperienceAgentSheet';
import { MobileExperienceListDetailHeader } from '@/features/experience/list/components/mobile/MobileExperienceListDetailHeader';
import { MobileAgentFab } from '@/features/experience/list/components/mobile/MobileAgentFab';

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

  const [agentOpen, setAgentOpen] = useState(false);

  const experience = experiences.find((e) => e.id === experienceId);
  const group = experience
    ? groups.find((g) => g.id === experience.groupId)
    : undefined;

  useEffect(() => {
    if (!experience) onBack();
  }, [experience, onBack]);

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
      key: 'delete',
      label: '삭제',
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

      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pb-[96px]'>
        <div className='flex flex-col'>
          <p className='typo-c1 text-gray6'>{group?.name ?? ''} &gt;</p>
          <EditableLabel
            as='h3'
            value={experience.name}
            editable
            onCommit={(next) => renameExperience(experience.id, next)}
            className='typo-b2-sb text-gray9'
            inputClassName='typo-b2-sb text-gray9'
          />
        </div>

        {/* 맵 뷰는 데스크톱 전용이다. proxy에서도 모바일의 ?view=map 을 list로 정규화한다. */}
        <div className='mt-[24px] flex flex-1 flex-col'>
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
      </div>

      {!agentOpen && <MobileAgentFab onClick={() => setAgentOpen(true)} />}

      <MobileExperienceAgentSheet
        open={agentOpen}
        onOpenChange={setAgentOpen}
      />
    </div>
  );
}
