'use client';

import { CorrectionProgressBar } from '@/components/CorrectionProgressBar';
import { CorrectionLimitModal } from '@/components/CorrectionLimitModal';
import { CorrectionInformationStep } from '@/features/correction/components/CorrectionInformationStep';
import { CorrectionLayout } from '@/features/correction/components/CorrectionLayout';
import { CorrectionLoadingSpinner } from '@/features/correction/components/CorrectionLoadingSpinner';
import { CorrectionPageHeader } from '@/features/correction/components/CorrectionPageHeader';
import {
  useNewCorrectionForm,
  type UseNewCorrectionFormReturn,
} from '@/features/correction/hooks/useNewCorrectionForm';

interface NewCorrectionPageClientProps {
  shouldResumePortfolio: boolean;
}

export function NewCorrectionPageClient({
  shouldResumePortfolio,
}: NewCorrectionPageClientProps) {
  const s: UseNewCorrectionFormReturn = useNewCorrectionForm({
    shouldResumePortfolio,
  });

  if (shouldResumePortfolio) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <CorrectionLoadingSpinner />
      </div>
    );
  }

  return (
    <CorrectionLayout
      layoutKey={s.layoutKey}
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
            target: null,
            onOpenChange: () => {},
            onConfirm: () => {},
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
          informationErrors={s.informationErrors}
          limitAllowedInput={s.limitAllowedInput}
          onStartCorrectionClick={s.handleStartCorrectionClick}
        />
      </div>
      <CorrectionLimitModal
        open={s.isCorrectionLimitModalOpen}
        onOpenChange={s.setIsCorrectionLimitModalOpen}
      />
    </CorrectionLayout>
  );
}
