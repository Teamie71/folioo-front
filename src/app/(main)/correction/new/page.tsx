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
      layoutClassName={s.layoutClassName}
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
              s.setInformationErrors((prev) => ({ ...prev, companyName: false }));
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
              s.setInformationErrors((prev) => ({ ...prev, jobDescription: false }));
          }}
          informationErrors={s.informationErrors}
          limitAllowedInput={s.limitAllowedInput}
          onStartCorrectionClick={s.handleStartCorrectionClick}
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
