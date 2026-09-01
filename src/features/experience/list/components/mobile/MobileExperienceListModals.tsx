'use client';

import { CommonModal } from '@/components/CommonModal';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  MAX_EXPERIENCE_COUNT,
  MAX_GROUP_COUNT,
} from '@/features/experience/list/constants';
import {
  MOBILE_MODAL_CLS,
  MOBILE_MODAL_OVERLAY_CLS,
} from '@/features/experience/list/components/mobile/mobileModalStyles';

export function MobileExperienceListModals() {
  const modal = useExperienceListStore((s) => s.modal);
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const closeModal = useExperienceListStore((s) => s.closeModal);
  const deleteGroup = useExperienceListStore((s) => s.deleteGroup);
  const deleteExperience = useExperienceListStore((s) => s.deleteExperience);
  const deleteSelectedBlocks = useExperienceListStore(
    (s) => s.deleteSelectedBlocks,
  );

  const groupName =
    modal?.type === 'group-delete'
      ? (groups.find((g) => g.id === modal.groupId)?.name ?? '그룹')
      : '';
  const experienceName =
    modal?.type === 'experience-delete'
      ? (experiences.find((e) => e.id === modal.experienceId)?.name ?? '활동')
      : '';

  return (
    <>
      <CommonModal
        open={modal?.type === 'group-delete'}
        onOpenChange={(open) => !open && closeModal()}
        overlayClassName={MOBILE_MODAL_OVERLAY_CLS}
        title={
          <span className='typo-b2-sb text-gray9 block w-full text-center'>
            <span className='break-all'>{groupName}</span> 그룹을
            <br />
            정말 삭제하시겠습니까?
          </span>
        }
        description={
          <span className='typo-c1 text-gray6 block text-center'>
            이 그룹 아래의 활동은
            <br />
            미분류 그룹으로 이동해요.
          </span>
        }
        className={MOBILE_MODAL_CLS}
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
        overlayClassName={MOBILE_MODAL_OVERLAY_CLS}
        title={
          <span className='typo-b2-sb text-gray9 block w-full text-center'>
            <span className='break-all'>{experienceName}</span> 활동을
            <br />
            정말 삭제하시겠습니까?
          </span>
        }
        description={
          <span className='typo-c1 text-gray6 block text-center'>
            이 활동의 모든 하위 블록이
            <br />
            함께 삭제돼요.
          </span>
        }
        className={MOBILE_MODAL_CLS}
        cancelBtnText='취소'
        secondaryBtnText='삭제'
        onSecondaryClick={() => {
          if (modal?.type === 'experience-delete')
            deleteExperience(modal.experienceId);
          closeModal();
        }}
        onCancelClick={closeModal}
      />

      {/* 선택 삭제 확인 (3-5) */}
      <CommonModal
        open={modal?.type === 'selection-delete'}
        onOpenChange={(open) => !open && closeModal()}
        overlayClassName={MOBILE_MODAL_OVERLAY_CLS}
        className={MOBILE_MODAL_CLS}
        title={
          <span className='typo-b2-sb text-gray9 block w-full text-center'>
            선택한 모든 블록을
            <br />
            정말 삭제하시겠습니까?
          </span>
        }
        cancelBtnText='취소'
        secondaryBtnText='삭제'
        onSecondaryClick={deleteSelectedBlocks}
        onCancelClick={closeModal}
      />

      {/* 그룹 포함 선택 삭제 확인 (3-6) */}
      <CommonModal
        open={modal?.type === 'selection-delete-with-group'}
        onOpenChange={(open) => !open && closeModal()}
        overlayClassName={MOBILE_MODAL_OVERLAY_CLS}
        className={MOBILE_MODAL_CLS}
        title={
          <span className='typo-b2-sb text-gray9 block w-full text-center'>
            선택한 모든 블록을
            <br />
            정말 삭제하시겠습니까?
          </span>
        }
        description={
          <span className='typo-c1 text-gray6 block text-center'>
            선택한 그룹 아래의 활동은
            <br />
            미분류 그룹으로 이동해요.
          </span>
        }
        cancelBtnText='취소'
        secondaryBtnText='삭제'
        onSecondaryClick={deleteSelectedBlocks}
        onCancelClick={closeModal}
      />

      <CommonModal
        open={modal?.type === 'group-limit'}
        onOpenChange={(open) => !open && closeModal()}
        overlayClassName={MOBILE_MODAL_OVERLAY_CLS}
        className={MOBILE_MODAL_CLS}
        title={
          <span className='typo-b2-sb text-gray9 block text-center'>
            그룹은 최대 {MAX_GROUP_COUNT}개까지만
            <br />
            저장할 수 있어요.
          </span>
        }
        description={
          <span className='typo-c1 text-gray6 block text-center'>
            기존 그룹을 삭제한 후,
            <br />
            새로운 그룹을 추가해주세요.
          </span>
        }
      />

      <CommonModal
        open={modal?.type === 'experience-limit'}
        onOpenChange={(open) => !open && closeModal()}
        overlayClassName={MOBILE_MODAL_OVERLAY_CLS}
        className={MOBILE_MODAL_CLS}
        title={
          <span className='typo-b2-sb text-gray9 block text-center'>
            활동은 최대 {MAX_EXPERIENCE_COUNT}개까지만
            <br />
            저장할 수 있어요.
          </span>
        }
        description={
          <span className='typo-c1 text-gray6 block text-center'>
            기존 활동을 삭제한 후,
            <br />
            새로운 활동을 추가해주세요.
          </span>
        }
      />
    </>
  );
}
