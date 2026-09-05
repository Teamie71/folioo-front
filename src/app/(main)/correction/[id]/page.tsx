'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { CorrectionProgressBar } from '@/components/CorrectionProgressBar';
import { FeedbackFloatingButton } from '@/components/FeedbackFloatingButton';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { CorrectionAnalyzingView } from '@/features/correction/components/CorrectionAnalyzingView';
import { CorrectionAnalysisStep } from '@/features/correction/components/CorrectionAnalysisStep';
import { CorrectionLayout } from '@/features/correction/components/CorrectionLayout';
import { CorrectionPageHeader } from '@/features/correction/components/CorrectionPageHeader';
import { CorrectionPortfolioStep } from '@/features/correction/components/CorrectionPortfolioStep';
import { CorrectionResultStep } from '@/features/correction/components/CorrectionResultStep';
import {
  useCorrectionState,
  type UseCorrectionStateReturn,
} from '@/features/correction/hooks/useCorrectionState';
import {
  portfolioCorrectionControllerUpdateCorrectionTitle,
  portfolioCorrectionControllerDeleteCorrection,
} from '@/api/endpoints/portfolio-correction/portfolio-correction';

export default function CorrectionSettingsPage() {
  const params = useParams();
  const correctionId =
    params?.id == null
      ? undefined
      : Array.isArray(params.id)
        ? params.id[0]
        : params.id;

  const s: UseCorrectionStateReturn = useCorrectionState(correctionId);

  useEffect(() => {
    document.title = `${s.title} - Folioo`;
  }, [s.title]);

  if (!correctionId) {
    redirect('/correction');
  }

  if (s.isInitializing) {
    return null; // 또는 로딩 스피너
  }

  const isPdfExtractionWaiting =
    s.step === 'portfolio' && s.isPdfTextExtracting;

  return (
    <CorrectionLayout
      layoutKey={s.layoutKey}
      layoutClassName={s.layoutClassName}
      onDragEnter={
        s.step === 'portfolio'
          ? (e) => {
              if (e.dataTransfer?.types.includes('Files'))
                s.setIsPdfDropOverlayActive(true);
            }
          : undefined
      }
      pdfDropOverlay={{
        active: s.step === 'portfolio' && s.isPdfDropOverlayActive,
        onDrop: s.handlePdfFile,
        onClose: () => s.setIsPdfDropOverlayActive(false),
      }}
      header={
        isPdfExtractionWaiting ? null : (
          <CorrectionPageHeader
            step={s.step}
            onBackClick={() => s.router.replace('/correction')}
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
              onOpenChange: (open) =>
                !open && s.setFileDeleteConfirmTarget(null),
              onConfirm: () => {
                if (s.fileDeleteConfirmTarget === null) return;
                s.handlePdfFileDelete();
                s.setFileDeleteConfirmTarget(null);
              },
            }}
            activityDeleteModal={{
              targetId: s.activityDeleteTargetId,
              onOpenChange: (open) =>
                !open && s.setActivityDeleteTargetId(null),
              onConfirm: s.handleDeletePdfActivity,
            }}
            titleEdit={{
              title: s.title,
              isEditing: s.isEditingTitle,
              editable: true,
              onEdit: () => s.setIsEditingTitle(true),
              onSave: async (newTitle: string) => {
                const id = correctionId ? Number(correctionId) : NaN;
                if (!newTitle.trim() || Number.isNaN(id)) {
                  s.setIsEditingTitle(false);
                  return;
                }
                const safeTitle = newTitle.trim().slice(0, 20);
                try {
                  await portfolioCorrectionControllerUpdateCorrectionTitle(id, {
                    title: safeTitle,
                  });
                  s.setTitle(safeTitle);
                } catch {
                  // 실패 시 제목은 그대로 두고 편집만 종료
                } finally {
                  s.setIsEditingTitle(false);
                }
              },
            }}
            showDeleteButton
            deleteModal={{
              open: s.isDeleteModalOpen,
              onOpenChange: s.setIsDeleteModalOpen,
              onConfirm: async () => {
                const id = correctionId ? Number(correctionId) : NaN;
                s.setIsDeleteModalOpen(false);
                if (Number.isNaN(id)) {
                  s.router.replace('/correction');
                  return;
                }
                try {
                  await portfolioCorrectionControllerDeleteCorrection(id);
                } catch {
                  // 삭제 실패 시에도 목록으로 이동
                } finally {
                  s.router.replace('/correction');
                }
              },
            }}
            pdfExtractModal={{
              open: s.isPdfExtractConfirmModalOpen,
              onOpenChange: s.setIsPdfExtractConfirmModalOpen,
              onConfirm: s.handlePdfExtractConfirm,
            }}
          />
        )
      }
      progressOrDivider={
        isPdfExtractionWaiting ? null : s.step === 'result' &&
          s.status !== 'ANALYZING' &&
          s.status !== 'ANALYZING_FAILED' ? (
          <div className='flex flex-col gap-[0.75rem] pb-[3.75rem]'>
            <div className='h-[1px] w-full bg-[#9EA4A9]' />
          </div>
        ) : (
          <CorrectionProgressBar step={s.step} status={s.status} />
        )
      }
    >
      <div className='flex flex-col gap-[3.75rem]'>
        {s.status === 'ANALYZING' || s.status === 'ANALYZING_FAILED' ? (
          <CorrectionAnalyzingView
            onLeaveClick={() => s.router.replace('/correction')}
            isError={s.status === 'ANALYZING_FAILED'}
            onRetry={s.handleRetryAnalyzing}
          />
        ) : s.step === 'portfolio' ? (
          <CorrectionPortfolioStep
            pdfUploadedFile={s.pdfUploadedFile}
            pdfUploadError={s.pdfUploadError}
            pdfFileInputRef={s.pdfFileInputRef}
            onPdfFileSelect={s.handlePdfFile}
            onRequestPdfFileDelete={() =>
              s.setFileDeleteConfirmTarget({ type: 'pdf' })
            }
            onRequestPdfExtract={s.handleRequestPdfExtract}
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
            correctionNumericId={
              correctionId && !Number.isNaN(Number(correctionId))
                ? Number(correctionId)
                : null
            }
            pdfExtractNonce={s.pdfExtractNonce}
            onPdfPortfoliosHydratedFromQuery={
              s.handlePdfPortfoliosHydratedFromQuery
            }
            onRetryPdfExtract={s.handleRetryPdfExtract}
            isPdfExtractFailed={s.isPdfExtractFailed}
            onPdfExtractFailureChange={s.setIsPdfExtractFailed}
            onRequestActivityDelete={s.setActivityDeleteTargetId}
            pdfActivityHoverId={s.pdfActivityHoverId}
            setPdfActivityHoverId={s.setPdfActivityHoverId}
            handleNextStep={s.handleNextStep}
            pdfCategoryOverLimit={s.pdfCategoryOverLimit}
          />
        ) : s.step === 'analysis' ? (
          <CorrectionAnalysisStep
            correctionId={correctionId}
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
            onRetryCompanyInsight={s.handleRetryCompanyInsight}
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
            correctionId={correctionId}
          />
        )}
      </div>

      {s.step === 'result' && s.status === 'DONE' && <FeedbackFloatingButton />}
      <LoginRequiredModal
        open={s.isPdfLoginRequiredModalOpen}
        onOpenChange={() => {}}
      />
    </CorrectionLayout>
  );
}
