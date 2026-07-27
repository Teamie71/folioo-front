'use client';

import { useExperienceListStore } from '@/store/useExperienceListStore';
import { EditableLabel } from '@/features/experience/list/components/ui/EditableLabel';
import { ExperienceListBlockTree } from '@/features/experience/list/components/ExperienceListBlockTree';
import {
  EmptyExperienceState,
  EmptyGroupState,
} from '@/features/experience/list/components/ExperienceListEmptyStates';
import { ExperienceListToolbar } from '@/features/experience/list/components/ExperienceListToolbar';

export function ExperienceListMainPanel() {
  const selection = useExperienceListStore((s) => s.selection);
  const experiences = useExperienceListStore((s) => s.experiences);
  const renameExperience = useExperienceListStore((s) => s.renameExperience);

  const experience =
    selection?.kind === 'experience'
      ? experiences.find((e) => e.id === selection.id)
      : undefined;

  return (
    <section className='relative flex min-w-0 flex-1 flex-col overflow-hidden bg-white'>
      <ExperienceListToolbar experienceId={experience?.id} />

      {selection?.kind === 'group' ? (
        <div className='flex flex-1 flex-col overflow-y-auto px-[60px] pt-[44px] pb-[48px]'>
          <EmptyGroupState groupId={selection.id} />
        </div>
      ) : !experience ? (
        <div className='px-[60px] pt-[44px]'>
          <p className='typo-b2 text-gray6'>경험을 선택해 주세요.</p>
        </div>
      ) : experience.blocks.length === 0 ? (
        <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden'>
          <div className='mx-auto w-full max-w-[1100px] shrink-0 px-[60px] pt-[44px]'>
            <EditableLabel
              as='h1'
              value={experience.name}
              editable
              onCommit={(next) => renameExperience(experience.id, next)}
              className='typo-h5 text-gray9'
              inputClassName='typo-h5 text-gray9'
            />
          </div>
          <EmptyExperienceState experienceId={experience.id} />
        </div>
      ) : (
        <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-[60px] pt-[44px] pb-[48px]'>
          <div className='mx-auto flex w-full max-w-[1100px] flex-col gap-[28px]'>
            <EditableLabel
              as='h1'
              value={experience.name}
              editable
              onCommit={(next) => renameExperience(experience.id, next)}
              className='typo-h5 text-gray9'
              inputClassName='typo-h5 text-gray9'
            />
            <ExperienceListBlockTree
              experienceId={experience.id}
              blocks={experience.blocks}
            />
          </div>
        </div>
      )}
    </section>
  );
}
