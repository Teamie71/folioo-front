'use client';

import { CommonButton } from '@/components/CommonButton';
import TextField from '@/components/TextField';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { CorrectionIcon } from '@/components/icons/CorrectionIcon';
import { CorrectionLoadingSpinner } from '@/features/correction/components/CorrectionLoadingSpinner';
import {
  usePortfolioCorrectionControllerGetCompanyInsight,
} from '@/api/endpoints/portfolio-correction/portfolio-correction';
import { useEffect, useState } from 'react';
import {
  ANALYSIS_INFO_MAX_LENGTH,
  EMPHASIS_POINTS_MAX_LENGTH,
} from '@/features/correction/constants';

interface CorrectionAnalysisStepProps {
  correctionId?: string;
  analysisInfoValue: string;
  onAnalysisInfoChange: (value: string) => void;
  showAnalysisInfoWarning: boolean;
  emphasisPointsValue: string;
  onEmphasisPointsChange: (value: string) => void;
  limitAllowedInput: (value: string, maxLength: number) => string;
  onNextStep: () => void;
}

export function CorrectionAnalysisStep({
  correctionId,
  analysisInfoValue,
  onAnalysisInfoChange,
  showAnalysisInfoWarning,
  emphasisPointsValue,
  onEmphasisPointsChange,
  limitAllowedInput,
  onNextStep,
}: CorrectionAnalysisStepProps) {
  const numId =
    correctionId != null && correctionId !== ''
      ? Number(correctionId)
      : 0;
  const enabled = numId > 0 && !Number.isNaN(numId);

  const { data, isLoading, isError, refetch } =
    usePortfolioCorrectionControllerGetCompanyInsight(numId, {
      query: {
        enabled,
        refetchInterval: (query) => {
          type WithGenerationStatus = { generationStatus?: 'PENDING' | 'COMPLETED' | 'FAILED' };
          const generationStatus = (query.state.data?.result as WithGenerationStatus)?.generationStatus;
          if (generationStatus === 'PENDING') return 3000;
          return false;
        },
      },
    });

  type WithGenerationStatus = { generationStatus?: 'PENDING' | 'COMPLETED' | 'FAILED' };
  const generationStatus = (data?.result as WithGenerationStatus)?.generationStatus;
  const isGenerating = isLoading || generationStatus === 'PENDING';

  const companyInsightRaw = data?.result?.companyInsight;
  const companyInsightText =
    companyInsightRaw == null
      ? ''
      : typeof companyInsightRaw === 'string'
        ? companyInsightRaw
        : String(companyInsightRaw);

  useEffect(() => {
    if (
      enabled &&
      !isGenerating &&
      !isError &&
      data?.isSuccess !== false &&
      generationStatus !== 'FAILED' &&
      companyInsightText &&
      analysisInfoValue === ''
    ) {
      onAnalysisInfoChange(
        limitAllowedInput(companyInsightText, ANALYSIS_INFO_MAX_LENGTH),
      );
    }
  }, [
    enabled,
    isGenerating,
    isError,
    data?.isSuccess,
    generationStatus,
    companyInsightText,
    analysisInfoValue,
    onAnalysisInfoChange,
    limitAllowedInput,
  ]);

  return (
    <>
      <div className='flex flex-col gap-[5rem]'>
        <div className='flex flex-col gap-[0.375rem]'>
          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
            <span>기업 분석 정보</span>
            <span className='text-[#DC0000]'>*</span>
          </div>
          <div className='flex flex-col'>
            <div
              className={`flex items-center justify-between ${
                showAnalysisInfoWarning ? 'mb-[0.5rem]' : 'mb-[1rem]'
              }`}
            >
              <div className='flex flex-col'>
                <span className='text-[0.875rem] text-[#74777D]'>
                  지원 정보를 바탕으로 AI 컨설턴트가 기업 분석 정보를
                  생성했어요.
                </span>
                <span className='text-[0.875rem] text-[#74777D]'>
                  추가하고 싶은 내용이 있으시면, 수정 후 첨삭을
                  의뢰해주세요.
                </span>
                {showAnalysisInfoWarning && (
                  <span className='mt-[0.5rem] text-[0.875rem] text-[#DC0000]'>
                    기업 분석 정보를 입력해주세요
                  </span>
                )}
              </div>
            </div>
            {enabled && isGenerating ? (
              <div className='flex min-h-[17.125rem] items-center justify-center rounded-[1.25rem] border border-[#74777D]'>
                <CorrectionLoadingSpinner />
              </div>
            ) : enabled && (isError || data?.isSuccess === false || generationStatus === 'FAILED') ? (
              <div className='flex min-h-[17.125rem] items-center justify-center rounded-[1.25rem] border border-[#74777D]'>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => refetch()}
                >
                  다시 시도하기
                </CommonButton>
              </div>
            ) : (
              <div className='relative'>
                <MarkdownEditor
                  className='rounded-[1.25rem]'
                  minHeight='17.125rem'
                  value={analysisInfoValue}
                  onChange={(val) => {
                    onAnalysisInfoChange(
                      limitAllowedInput(
                        val,
                        ANALYSIS_INFO_MAX_LENGTH,
                      ),
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-[0.375rem]'>
          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold leading-[1.3]'>
            <span>강조 포인트</span>
          </div>
          <div className='flex flex-col'>
            <span className='mb-[1rem] text-[0.875rem] text-[#74777D]'>
              기업 분석 정보를 바탕으로, 이번 서류에서 강조하고 싶은
              역량이나 기술 등이 있다면 작성해주세요.
            </span>
            <TextField
              variant='wide'
              height='10.625rem'
              className='rounded-[1.25rem]'
              value={emphasisPointsValue}
              maxLength={EMPHASIS_POINTS_MAX_LENGTH}
              onChange={(e) =>
                onEmphasisPointsChange(
                  limitAllowedInput(
                    e.target.value,
                    EMPHASIS_POINTS_MAX_LENGTH,
                  ),
                )
              }
            />
          </div>
        </div>
      </div>

      <div className='flex justify-center pt-[1.25rem] pb-[6.25rem]'>
        <CommonButton
          variantType='Primary'
          px='2.25rem'
          py='0.75rem'
          className='gap-[0.75rem] rounded-[3.75rem] [&_svg]:h-[1.5rem] [&_svg]:w-[1.5rem]'
          onClick={onNextStep}
        >
          <CorrectionIcon />
          첨삭 의뢰하기
        </CommonButton>
      </div>
    </>
  );
}
