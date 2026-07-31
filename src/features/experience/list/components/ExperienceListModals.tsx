'use client';

import { CommonModal } from '@/components/CommonModal';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  MAX_EXPERIENCE_COUNT,
  MAX_GROUP_COUNT,
} from '@/features/experience/list/constants';

const MODAL_CLS =
  'box-border w-[min(500px,calc(100vw-2rem))] max-w-[min(500px,calc(100vw-2rem))] gap-[28px] overflow-hidden px-[60px] py-[60px] [&>button:last-child]:top-[12px] [&>button:last-child]:right-[12px]';

export function ExperienceListModals() {
  const modal = useExperienceListStore((s) => s.modal);
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const closeModal = useExperienceListStore((s) => s.closeModal);
  const deleteGroup = useExperienceListStore((s) => s.deleteGroup);
  const deleteExperience = useExperienceListStore((s) => s.deleteExperience);

  const groupName =
    modal?.type === 'group-delete'
      ? (groups.find((g) => g.id === modal.groupId)?.name ?? '그룹')
      : '';
  const experienceName =
    modal?.type === 'experience-delete'
      ? (experiences.find((e) => e.id === modal.experienceId)?.name ?? '경험')
      : '';

  return (
    <>
      <CommonModal
        open={modal?.type === 'group-delete'}
        onOpenChange={(open) => !open && closeModal()}
        title={
          <span className='typo-h5 text-gray9 flex w-full min-w-0 flex-wrap justify-center gap-x-[0.25em] text-center'>
            <span className='break-all'>{groupName}</span>
            <span className='whitespace-nowrap'>
              그룹을 정말 삭제하시겠습니까?
            </span>
          </span>
        }
        description={
          <span className='typo-c1 text-gray6 whitespace-nowrap'>
            이 그룹 아래의 경험은 미분류 그룹으로 이동해요.
          </span>
        }
        className={MODAL_CLS}
        cancelBtnText='취소'
        secondaryBtnText='삭제'
        onSecondaryClick={() => {
          if (modal?.type === 'group-delete') deleteGroup(modal.groupId);
          closeModal();
        }}
        onCancelClick={closeModal}
      />

      <CommonModal
        open={modal?.type === 'experience-delete'}
        onOpenChange={(open) => !open && closeModal()}
        title={
          <span className='typo-h5 text-gray9 flex w-full min-w-0 flex-wrap justify-center gap-x-[0.25em] text-center'>
            <span className='break-all'>{experienceName}</span>
            <span className='whitespace-nowrap'>
              경험을 정말 삭제하시겠습니까?
            </span>
          </span>
        }
        description={
          <span className='typo-c1 text-gray6 whitespace-nowrap'>
            이 경험의 모든 하위 블록이 함께 삭제돼요.
          </span>
        }
        className={MODAL_CLS}
        cancelBtnText='취소'
        secondaryBtnText='삭제'
        onSecondaryClick={() => {
          if (modal?.type === 'experience-delete')
            deleteExperience(modal.experienceId);
          closeModal();
        }}
        onCancelClick={closeModal}
      />

      <CommonModal
        open={modal?.type === 'group-limit'}
        onOpenChange={(open) => !open && closeModal()}
        closeButtonOnly
        className={MODAL_CLS}
        title={
          <span className='typo-h5 text-gray9'>
            그룹은 최대 {MAX_GROUP_COUNT}개까지만 저장할 수 있어요.
            <br />
            기존 그룹을 삭제한 후, 새로운 그룹을 추가해주세요.
          </span>
        }
      />

      <CommonModal
        open={modal?.type === 'experience-limit'}
        onOpenChange={(open) => !open && closeModal()}
        closeButtonOnly
        className={MODAL_CLS}
        title={
          <span className='typo-h5 text-gray9'>
            경험은 최대 {MAX_EXPERIENCE_COUNT}개까지만 저장할 수 있어요.
            <br />
            기존 경험을 삭제한 후, 새로운 경험을 정리해주세요.
          </span>
        }
      />
    </>
  );
}
