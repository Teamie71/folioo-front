'use client';

import { CorrectionProgressBar } from '@/components/CorrectionProgressBar';
import { OBTTicketModal } from '@/components/OBT/OBTTicketModal';
import { CorrectionLimitModal } from '@/components/CorrectionLimitModal';
import { CorrectionLayout } from '@/features/correction/components/CorrectionLayout';
import { CorrectionPageHeader } from '@/features/correction/components/CorrectionPageHeader';
import { CorrectionInformationStep } from '@/features/correction/components/CorrectionInformationStep';
import {
  useNewCorrectionForm,
  type UseNewCorrectionFormReturn,
} from '@/features/correction/hooks/useNewCorrectionForm';

export default function NewCorrectionPage() {
  const s: UseNewCorrectionFormReturn = useNewCorrectionForm();

  return (
    <CorrectionLayout
      layoutKey={s.layoutKey}
      layoutClassName={s.layoutClassName}
      onDragEnter={
        s.jdMode === 'image'
          ? (event) => {
              if (event.dataTransfer?.types.includes('Files')) {
                s.setIsJdDropOverlayActive(true);
              }
            }
          : undefined
      }
      jdDropOverlay={{
        active: s.jdMode === 'image' && s.isJdDropOverlayActive,
        onDrop: s.handleJdImageFile,
        onClose: () => s.setIsJdDropOverlayActive(false),
      }}
      pdfDropOverlay={{ active: false, onDrop: () => {}, onClose: () => {} }}
      header={
        <CorrectionPageHeader
          step='information'
          onBackClick={() => s.setIsQuitModalOpen(true)}
          quitModal={{
            open: s.isQuitModalOpen,
            onOpenChange: s.setIsQuitModalOpen,
            onConfirm: () => {
              s.setIsQuitModalOpen(false);
              s.router.replace('/correction');
            },
          }}
          fileDeleteModal={{
            target: s.fileDeleteConfirmTarget,
            onOpenChange: (open) => !open && s.setFileDeleteConfirmTarget(null),
            onConfirm: () => {
              if (s.fileDeleteConfirmTarget?.type === 'jd') {
                s.removeJdFileAt(s.fileDeleteConfirmTarget.index);
              }
              s.setFileDeleteConfirmTarget(null);
            },
          }}
          activityDeleteModal={{
            targetId: null,
            onOpenChange: () => {},
            onConfirm: () => {},
          }}
          titleEdit={{
            title: '새로운 포트폴리오 첨삭',
            isEditing: false,
            editable: false,
            onEdit: () => {},
            onSave: () => {},
          }}
          showDeleteButton={false}
          deleteModal={{
            open: false,
            onOpenChange: () => {},
            onConfirm: () => {},
          }}
          startCorrectionModal={{
            open: s.isStartCorrectionModalOpen,
            onOpenChange: s.setIsStartCorrectionModalOpen,
            onConfirm: s.handleStartCorrectionConfirm,
          }}
          pdfExtractModal={{
            open: false,
            onOpenChange: () => {},
            onConfirm: () => {},
          }}
          jdViewer={{
            previewUrl:
              s.jdViewerFileIndex == null
                ? null
                : (s.jdUploadedFiles[s.jdViewerFileIndex]?.previewUrl ?? null),
            onClose: () => s.setJdViewerFileIndex(null),
          }}
        />
      }
      progressOrDivider={
        <CorrectionProgressBar step='information' status='DRAFT' />
      }
    >
      <div className='flex flex-col gap-[3.75rem]'>
        <CorrectionInformationStep
          companyName={s.companyName}
          onCompanyNameChange={(next) => {
            s.setCompanyName(next);
            if (s.informationErrors.companyName)
              s.setInformationErrors((prev) => ({
                ...prev,
                companyName: false,
              }));
          }}
          jobTitle={s.jobTitle}
          onJobTitleChange={(next) => {
            s.setJobTitle(next);
            if (s.informationErrors.jobTitle)
              s.setInformationErrors((prev) => ({ ...prev, jobTitle: false }));
          }}
          jobDescription={s.jobDescription}
          onJobDescriptionChange={(next) => {
            s.setJobDescription(next);
            if (s.informationErrors.jobDescription)
              s.setInformationErrors((prev) => ({
                ...prev,
                jobDescription: false,
              }));
          }}
          jdMode={s.jdMode}
          onJdModeChange={s.handleJdModeChange}
          informationErrors={s.informationErrors}
          jdImageError={s.jdImageError}
          jdUploadedFiles={s.jdUploadedFiles}
          limitAllowedInput={s.limitAllowedInput}
          onStartCorrectionClick={s.handleStartCorrectionClick}
          jdFileInputRef={s.jdFileInputRef}
          onRequestFileDelete={(index) =>
            s.setFileDeleteConfirmTarget({ type: 'jd', index })
          }
          onRequestJdViewer={s.setJdViewerFileIndex}
          onJdImageFile={s.handleJdImageFile}
          onPasteJdImage={s.handlePasteJdImageFromClipboard}
        />
      </div>

      {/* 포트폴리오 첨삭 이용권 소진 시 */}
      <OBTTicketModal
        open={s.isTicketExhaustedModalOpen}
        onOpenChange={s.setIsTicketExhaustedModalOpen}
      />
      {/* 첨삭 15개 초과 시 (API 에러) */}
      <CorrectionLimitModal
        open={s.isCorrectionLimitModalOpen}
        onOpenChange={s.setIsCorrectionLimitModalOpen}
      />
    </CorrectionLayout>
  );
}
