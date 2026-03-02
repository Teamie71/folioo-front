'use client';

import { useParams } from 'next/navigation';
import { CorrectionProgressBar } from '@/components/CorrectionProgressBar';
import { FeedbackFloatingButton } from '@/components/FeedbackFloatingButton';
import { CorrectionAnalyzingView } from '@/features/correction/components/CorrectionAnalyzingView';
import { CorrectionAnalysisStep } from '@/features/correction/components/CorrectionAnalysisStep';
import { CorrectionInformationStep } from '@/features/correction/components/CorrectionInformationStep';
import { CorrectionLayout } from '@/features/correction/components/CorrectionLayout';
import { CorrectionPageHeader } from '@/features/correction/components/CorrectionPageHeader';
import { CorrectionPortfolioStep } from '@/features/correction/components/CorrectionPortfolioStep';
import { CorrectionResultStep } from '@/features/correction/components/CorrectionResultStep';
import {
  useCorrectionState,
  type UseCorrectionStateReturn,
} from '@/features/correction/hooks/useCorrectionState';

export default function CorrectionSettingsPage() {
  const params = useParams();
  const correctionId =
    params?.id == null
      ? undefined
      : Array.isArray(params.id)
        ? params.id[0]
        : params.id;
  const s: UseCorrectionStateReturn = useCorrectionState(correctionId);

  return (
    <CorrectionLayout
      layoutKey={s.layoutKey}
      layoutClassName={s.layoutClassName}
      onDragEnter={
        s.step === 'information' && s.jdMode === 'image'
          ? (e) => {
              if (e.dataTransfer.types.includes('Files'))
                s.setIsJdDropOverlayActive(true);
            }
          : s.step === 'portfolio' && s.selectedPortfolioType === 'pdf'
            ? (e) => {
                if (e.dataTransfer.types.includes('Files'))
                  s.setIsPdfDropOverlayActive(true);
              }
            : undefined
      }
      jdDropOverlay={{
        active:
          s.step === 'information' &&
          s.jdMode === 'image' &&
          s.isJdDropOverlayActive,
        onDrop: s.handleJdImageFile,
        onClose: () => s.setIsJdDropOverlayActive(false),
      }}
      pdfDropOverlay={{
        active:
          s.step === 'portfolio' &&
          s.selectedPortfolioType === 'pdf' &&
          s.isPdfDropOverlayActive,
        onDrop: s.handlePdfFile,
        onClose: () => s.setIsPdfDropOverlayActive(false),
      }}
      header={
        <CorrectionPageHeader
          step={s.step}
          onBackClick={() => {
            if (s.step === 'information') {
              s.setIsQuitModalOpen(true);
            } else {
              s.router.replace('/correction');
            }
          }}
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
              if (s.fileDeleteConfirmTarget === null) return;
              if (s.fileDeleteConfirmTarget.type === 'jd') {
                s.removeJdFileAt(s.fileDeleteConfirmTarget.index);
              } else {
                s.setPdfUploadedFile(null);
                s.setPdfUploadError(null);
              }
              s.setFileDeleteConfirmTarget(null);
            },
          }}
          activityDeleteModal={{
            targetId: s.activityDeleteTargetId,
            onOpenChange: (open) => !open && s.setActivityDeleteTargetId(null),
            onConfirm: s.handleDeletePdfActivity,
          }}
          titleEdit={{
            title: '새로운 포트폴리오 첨삭',
            isEditing: s.isEditingTitle,
            editable: s.step !== 'information',
            onEdit: () => s.setIsEditingTitle(true),
            onSave: () => s.setIsEditingTitle(false),
          }}
          showDeleteButton={s.step !== 'information'}
          deleteModal={{
            open: s.isDeleteModalOpen,
            onOpenChange: s.setIsDeleteModalOpen,
            onConfirm: () => {
              s.setIsDeleteModalOpen(false);
              s.router.replace('/correction');
            },
          }}
          startCorrectionModal={{
            open: s.isStartCorrectionModalOpen,
            onOpenChange: s.setIsStartCorrectionModalOpen,
            onConfirm: s.handleStartCorrectionConfirm,
          }}
          pdfExtractModal={{
            open: s.isPdfExtractConfirmModalOpen,
            onOpenChange: s.setIsPdfExtractConfirmModalOpen,
            onConfirm: s.handlePdfExtractConfirm,
          }}
          jdViewer={{
            previewUrl:
              s.jdViewerFileIndex != null &&
              s.jdUploadedFiles[s.jdViewerFileIndex]
                ? s.jdUploadedFiles[s.jdViewerFileIndex].previewUrl
                : null,
            onClose: () => s.setJdViewerFileIndex(null),
          }}
        />
      }
      progressOrDivider={
        s.step === 'result' ? (
          <div className='flex flex-col gap-[0.75rem] pb-[6.25rem]'>
            <div className='h-[1px] w-full bg-[#9EA4A9]' />
          </div>
        ) : (
          <CorrectionProgressBar step={s.step} status={s.status} />
        )
      }
    >
      <div className='flex flex-col gap-[3.75rem]'>
        {s.status === 'ANALYZING' ? (
          <CorrectionAnalyzingView
            onLeaveClick={() => s.router.replace('/correction')}
          />
        ) : s.step === 'information' ? (
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
                s.setInformationErrors((prev) => ({
                  ...prev,
                  jobTitle: false,
                }));
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
            onJdModeChange={(value) => {
              s.setJdMode(value);
              if (value === 'image') {
                s.setJdImageError(null);
                s.setJdViewerFileIndex(null);
                s.setJdUploadedFiles((prev) => {
                  prev.forEach((f) => {
                    if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
                  });
                  return [];
                });
              }
            }}
            informationErrors={s.informationErrors}
            jdImageError={s.jdImageError}
            jdShakeKey={s.jdShakeKey}
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
        ) : s.step === 'portfolio' ? (
          <CorrectionPortfolioStep
            selectedPortfolioType={s.selectedPortfolioType}
            onPortfolioSelect={s.handlePortfolioSelect}
            showTextPortfolioWarning={s.showTextPortfolioWarning}
            textPortfolios={s.textPortfolios}
            selectedTextPortfolioIds={s.selectedTextPortfolioIds}
            onTextPortfolioToggle={(portfolioId) => {
              s.setShowTextPortfolioWarning(false);
              s.setSelectedTextPortfolioIds((prev) =>
                prev.includes(portfolioId)
                  ? prev.filter((id) => id !== portfolioId)
                  : [...prev, portfolioId],
              );
            }}
            pdfUploadedFile={s.pdfUploadedFile}
            pdfUploadError={s.pdfUploadError}
            pdfFileInputRef={s.pdfFileInputRef}
            onPdfFileSelect={s.handlePdfFile}
            onRequestPdfFileDelete={() =>
              s.setFileDeleteConfirmTarget({ type: 'pdf' })
            }
            onRequestPdfExtract={() => s.setIsPdfExtractConfirmModalOpen(true)}
            isPdfTextExtracted={s.isPdfTextExtracted}
            isPdfTextExtracting={s.isPdfTextExtracting}
            pdfActivities={s.pdfActivities}
            setPdfActivities={s.setPdfActivities}
            onAddActivity={s.handleAddPdfActivity}
            onActivityChange={s.handlePdfActivityChange}
            selectedActivityId={s.selectedActivityId}
            onActivitySelect={s.setSelectedActivityId}
            selectedTab={s.selectedTab}
            onTabSelect={s.setSelectedTab}
            bulletTextareaRefs={s.bulletTextareaRefs}
            lastBulletEnterAt={s.lastBulletEnterAt}
            onRequestActivityDelete={s.setActivityDeleteTargetId}
            pdfActivityHoverId={s.pdfActivityHoverId}
            setPdfActivityHoverId={s.setPdfActivityHoverId}
            handleNextStep={s.handleNextStep}
            pdfCategoryOverLimit={s.pdfCategoryOverLimit}
          />
        ) : s.step === 'analysis' ? (
          <CorrectionAnalysisStep
            analysisInfoValue={s.analysisInfoValue}
            onAnalysisInfoChange={(value) => {
              s.setAnalysisInfoValue(value);
              s.setShowAnalysisInfoWarning(false);
            }}
            showAnalysisInfoWarning={s.showAnalysisInfoWarning}
            emphasisPointsValue={s.emphasisPointsValue}
            onEmphasisPointsChange={s.setEmphasisPointsValue}
            limitAllowedInput={s.limitAllowedInput}
            onNextStep={s.handleNextStep}
          />
        ) : (
          <CorrectionResultStep
            status={s.status}
            resultTab={s.resultTab}
            onResultTabChange={s.setResultTab}
            detailInfoButton={s.detailInfoButton}
            setDetailInfoButton={s.setDetailInfoButton}
            responsibilityButton={s.responsibilityButton}
            setResponsibilityButton={s.setResponsibilityButton}
            problemSolvingButton={s.problemSolvingButton}
            setProblemSolvingButton={s.setProblemSolvingButton}
            lessonsButton={s.lessonsButton}
            setLessonsButton={s.setLessonsButton}
            onStartNewExperience={s.handleStartNewExperience}
          />
        )}
      </div>

      {s.step === 'result' && <FeedbackFloatingButton />}
    </CorrectionLayout>
  );
}
