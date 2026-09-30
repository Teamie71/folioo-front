'use client';

import { useEffect } from 'react';
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
  'flex min-h-0 flex-1 flex-col overflow-y-auto px-[60px] pt-[44px]';

/*
 * 활동 상세 콘텐츠 래퍼는 flex-1/min-h-0로 늘리지 않는다.
 * overflow-y-auto flex 컨테이너 안에서 flex-1 자식이 넘치면 자식이 눌리면서
 * 스크롤 영역이 실제 콘텐츠보다 짧게 잡혀 하단 여백(padding-bottom)이 잘린다.
 * 자연 높이를 갖는 일반 블록으로 두고 pb를 직접 줘야 하단 60px가 스크롤에 포함된다.
 */
const CONTENT_CLS =
  'mx-auto flex w-full max-w-[1100px] shrink-0 flex-col gap-[28px] pb-[60px]';

export function ExperienceListView() {
  const selection = useExperienceListStore((s) => s.selection);
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const isContentLoading = useExperienceListStore((s) => s.isContentLoading);
  const isDeletingExperience = useExperienceListStore(
    (s) => Object.keys(s.pendingExperienceDeletes).length > 0,
  );
  const selectExperience = useExperienceListStore((s) => s.selectExperience);
  const selectGroup = useExperienceListStore((s) => s.selectGroup);
  const renameExperience = useExperienceListStore((s) => s.renameExperience);

  const selectedExperience =
    selection?.kind === 'experience'
      ? experiences.find((e) => e.id === selection.id)
      : undefined;
  const firstExperience = groups
    .map((group) => experiences.find((item) => item.groupId === group.id))
    .find((item) => item !== undefined);
  const experience =
    selectedExperience ??
    (selection?.kind === 'group' ? undefined : firstExperience);

  useEffect(() => {
    if (
      isContentLoading ||
      isDeletingExperience ||
      selection?.kind === 'group' ||
      selectedExperience
    )
      return;
    if (firstExperience) selectExperience(firstExperience.id);
    else if (groups[0]) selectGroup(groups[0].id);
  }, [
    firstExperience,
    groups,
    isContentLoading,
    isDeletingExperience,
    selectedExperience,
    selection,
    selectExperience,
    selectGroup,
  ]);

  if (isContentLoading || isDeletingExperience) {
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
    if (groups[0]) {
      return (
        <div className={MAIN_SCROLL_CLS}>
          <EmptyGroupState groupId={groups[0].id} />
        </div>
      );
    }
    return (
      <div className='px-[60px] pt-[44px]'>
        <p className='typo-b2 text-gray6'>활동을 선택해 주세요.</p>
      </div>
    );
  }

  if (experience.blocks.length === 0) {
    return (
      <div className={MAIN_SCROLL_CLS}>
        <EmptyExperienceState experienceId={experience.id} />
      </div>
    );
  }

  return (
    <div className={MAIN_SCROLL_CLS}>
      <div className={CONTENT_CLS}>
        <EditableLabel
          as='h1'
          value={experience.name}
          placeholder={EXPERIENCE_NAME_PLACEHOLDER}
          editable
          maxLength={20}
          onCommit={(next) => renameExperience(experience.id, next)}
          className='typo-h5 text-gray9 shrink-0'
          inputClassName='typo-h5 text-gray9'
        />
        <ExperienceListBlockTree
          experienceId={experience.id}
          blocks={experience.blocks}
        />
      </div>
    </div>
  );
}
