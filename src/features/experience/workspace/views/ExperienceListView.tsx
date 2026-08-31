'use client';

import { useExperienceListStore } from '@/store/useExperienceListStore';
import { EditableLabel } from '@/features/experience/list/components/EditableLabel';
import { EXPERIENCE_NAME_PLACEHOLDER } from '@/features/experience/list/constants';
import { ExperienceListBlockTree } from '@/features/experience/list/components/ExperienceListBlockTree';
import { ExperienceListContentSkeleton } from '@/features/experience/list/components/ExperienceListContentSkeleton';
import {
  EmptyExperienceState,
  EmptyGroupState,
} from '@/features/experience/list/components/ExperienceListEmptyStates';

const MAIN_SCROLL_CLS =
  'flex min-h-0 flex-1 flex-col overflow-y-auto px-[60px] pt-[44px] pb-[48px]';

export function ExperienceListView() {
  const selection = useExperienceListStore((s) => s.selection);
  const experiences = useExperienceListStore((s) => s.experiences);
  const isContentLoading = useExperienceListStore((s) => s.isContentLoading);
  const renameExperience = useExperienceListStore((s) => s.renameExperience);

  const experience =
    selection?.kind === 'experience'
      ? experiences.find((e) => e.id === selection.id)
      : undefined;

  if (isContentLoading) {
    return (
      <div className={MAIN_SCROLL_CLS}>
        <ExperienceListContentSkeleton />
      </div>
    );
  }

  if (selection?.kind === 'group') {
    return (
      <div className={MAIN_SCROLL_CLS}>
        <EmptyGroupState groupId={selection.id} />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className='px-[60px] pt-[44px]'>
        <p className='typo-b2 text-gray6'>활동을 선택해 주세요.</p>
      </div>
    );
  }

  return (
    <div className={MAIN_SCROLL_CLS}>
      <div className='mx-auto flex min-h-0 w-full max-w-[1100px] flex-1 flex-col gap-[28px]'>
        <EditableLabel
          as='h1'
          value={experience.name}
          placeholder={EXPERIENCE_NAME_PLACEHOLDER}
          editable
          onCommit={(next) => renameExperience(experience.id, next)}
          className='typo-h5 text-gray9 shrink-0'
          inputClassName='typo-h5 text-gray9'
        />
        {experience.blocks.length === 0 ? (
          <EmptyExperienceState experienceId={experience.id} />
        ) : (
          <ExperienceListBlockTree
            experienceId={experience.id}
            blocks={experience.blocks}
          />
        )}
      </div>
    </div>
  );
}
