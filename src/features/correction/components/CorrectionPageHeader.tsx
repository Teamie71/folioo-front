'use client';

import { BackButton } from '@/components/BackButton';
import { CommonModal } from '@/components/CommonModal';
import { DeleteButton } from '@/components/DeleteButton';
import { InlineEdit } from '@/components/InlineEdit';
import type { Step } from '@/types/correction';

export type FileDeleteConfirmTarget =
  | { type: 'jd'; index: number }
  | { type: 'pdf' }
  | null;

interface CorrectionPageHeaderProps {
  step: Step;
  onBackClick: () => void;
  quitModal: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  };
  fileDeleteModal: {
    target: FileDeleteConfirmTarget;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  };
  activityDeleteModal: {
    targetId: string | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  };
  titleEdit: {
    title: string;
    isEditing: boolean;
    editable: boolean;
    onEdit: () => void;
    onSave: (newTitle: string) => void;
  };
  showDeleteButton: boolean;
  deleteModal: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  };
  startCorrectionModal: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  };
  pdfExtractModal: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  };
  jdViewer: {
    previewUrl: string | null;
    onClose: () => void;
  };
}

export function CorrectionPageHeader({
  step,
  onBackClick,
  quitModal,
  fileDeleteModal,
  activityDeleteModal,
  titleEdit,
  showDeleteButton,
  deleteModal,
  startCorrectionModal,
  pdfExtractModal,
  jdViewer,
}: CorrectionPageHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-[0.75rem]'>
        <BackButton onClick={onBackClick} />
        <CommonModal
          open={quitModal.open}
          onOpenChange={quitModal.onOpenChange}
          title='이 첨삭을 정말 그만두시겠습니까?'
          description='지금 돌아가면, 작성하신 내용이 저장되지 않아요.'
          cancelBtnText='취소'
          secondaryBtnText='그만두기'
          onSecondaryClick={quitModal.onConfirm}
        />
        <CommonModal
          open={fileDeleteModal.target !== null}
          onOpenChange={(open) => !open && fileDeleteModal.onOpenChange(false)}
          title='이 파일을 정말 삭제하시겠습니까?'
          cancelBtnText='취소'
          secondaryBtnText='삭제'
          onSecondaryClick={fileDeleteModal.onConfirm}
        />
        <CommonModal
          open={activityDeleteModal.targetId !== null}
          onOpenChange={(open) => !open && activityDeleteModal.onOpenChange(false)}
          title='이 활동을 정말 삭제하시겠습니까?'
          cancelBtnText='취소'
          secondaryBtnText='삭제'
          onSecondaryClick={activityDeleteModal.onConfirm}
        />
        <InlineEdit
          title={titleEdit.title}
          isEditing={titleEdit.isEditing}
          editable={titleEdit.editable}
          onEdit={titleEdit.onEdit}
          onSave={titleEdit.onSave}
        />
      </div>
      {showDeleteButton && (
        <DeleteButton onClick={() => deleteModal.onOpenChange(true)} />
      )}
      <CommonModal
        open={deleteModal.open}
        onOpenChange={deleteModal.onOpenChange}
        title='이 첨삭을 정말 삭제하시겠습니까?'
        cancelBtnText='취소'
        secondaryBtnText='삭제'
        onSecondaryClick={deleteModal.onConfirm}
      />
      <CommonModal
        open={startCorrectionModal.open}
        onOpenChange={startCorrectionModal.onOpenChange}
        title={
          <>
            포트폴리오 첨삭 1회권을 사용하여
            <br />
            진행하시겠습니까?
          </>
        }
        cancelBtnText='취소'
        primaryBtnText='진행'
        onPrimaryClick={startCorrectionModal.onConfirm}
        className='max-w-[24.75rem] items-center px-[5rem] py-[3.75rem] text-center'
      />
      <CommonModal
        open={pdfExtractModal.open}
        onOpenChange={pdfExtractModal.onOpenChange}
        title='이 파일의 텍스트를 추출하시겠습니까?'
        description='추출 시작 후 파일을 변경할 수 없어요.'
        cancelBtnText='취소'
        primaryBtnText='추출'
        onPrimaryClick={pdfExtractModal.onConfirm}
      />
      {jdViewer.previewUrl && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'
          role='dialog'
          aria-modal='true'
          aria-label='JD 이미지 전체보기'
          onClick={jdViewer.onClose}
        >
          <div
            className='flex max-h-full max-w-full items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={jdViewer.previewUrl}
              alt='JD 미리보기 전체'
              className='max-h-[90vh] max-w-full object-contain'
            />
          </div>
        </div>
      )}
    </div>
  );
}
