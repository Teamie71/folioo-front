'use client';

import { useExperienceListStore } from '@/store/useExperienceListStore';
import { EmptyGroupState } from '@/features/experience/list/components/ExperienceListEmptyStates';
import { MobileExperienceListDetailHeader } from '@/features/experience/list/components/mobile/MobileExperienceListDetailHeader';
import type { MenuItem } from '@/features/experience/list/components/ExperienceListMenu';

type Props = {
  groupId: string;
  onBack: () => void;
  onOpenExperience: (experienceId: string) => void;
};

export function MobileGroupDetail({
  groupId,
  onBack,
  onOpenExperience,
}: Props) {
  const groups = useExperienceListStore((s) => s.groups);
  const openModal = useExperienceListStore((s) => s.openModal);

  const group = groups.find((g) => g.id === groupId);
  if (!group) return null;

  const groupMenu: MenuItem[] = group.isUnclassified
    ? []
    : [
        {
          key: 'delete',
          label: '삭제',
          onSelect: () =>
            openModal({ type: 'group-delete', groupId: group.id }),
        },
      ];

  return (
    <div className='fixed inset-0 z-[60] flex flex-col bg-white'>
      <MobileExperienceListDetailHeader
        onBack={onBack}
        menuItems={groupMenu}
        menuAriaLabel='그룹 메뉴'
      />

      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pb-[16px]'>
        <p className='typo-c1 text-gray6'>{group.name} &gt;</p>

        <EmptyGroupState
          groupId={group.id}
          className='flex-1'
          onAdded={onOpenExperience}
          variant='mobile'
        />
      </div>

      {/* FO-130 그룹 상세의 에이전트 버튼과 시트를 일시적으로 숨긴다.
      {!agentOpen && <MobileAgentFab onClick={() => setAgentOpen(true)} />}

      <MobileExperienceAgentSheet
        open={agentOpen}
        onOpenChange={setAgentOpen}
      />
      */}
    </div>
  );
}
