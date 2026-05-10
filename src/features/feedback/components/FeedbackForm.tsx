'use client';

import { useMemo, useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { useFeedbackSubmission } from '../hooks/useFeedbackSubmission';
import {
  CheckboxChoiceRow,
  CheckboxOtherInlineRow,
  LongFormTextField,
  QuestionSection,
  feedbackFormClassNames,
} from './FeedbackFormPrimitives';
import { FeedbackRewardDistributedModal } from './FeedbackRewardDistributedModal';
import { FeedbackSubmittedModal } from './FeedbackSubmittedModal';

type UnknownRecord = Record<string, unknown>;
type FeedbackQuestionType = 'CHOICE' | 'TEXT';

type FeedbackOption = {
  id: string;
  label: string;
};

type FeedbackQuestion = {
  id: string;
  text: string;
  type: FeedbackQuestionType;
  required: boolean;
  options: FeedbackOption[];
  hasOther: boolean;
  placeholder?: string;
  otherPlaceholder?: string;
};

type ChoiceAnswer = {
  optionId: string | null;
  otherText: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function parseQuestion(item: unknown, index: number): FeedbackQuestion | null {
  if (!isRecord(item)) return null;
  const id = typeof item.id === 'string' && item.id.trim() ? item.id : `q${index + 1}`;
  const text = typeof item.text === 'string' ? item.text : '';
  const type = item.type === 'CHOICE' || item.type === 'TEXT' ? item.type : null;
  if (!type || !text.trim()) return null;

  const options: FeedbackOption[] = Array.isArray(item.options)
    ? item.options
        .map((option, optionIndex) => {
          if (!isRecord(option)) return null;
          const optionId =
            typeof option.id === 'string' && option.id.trim()
              ? option.id
              : `opt${optionIndex + 1}`;
          const label = typeof option.label === 'string' ? option.label : '';
          if (!label.trim()) return null;
          return { id: optionId, label };
        })
        .filter((option): option is FeedbackOption => option !== null)
    : [];

  return {
    id,
    text,
    type,
    required: item.required === true,
    options,
    hasOther: item.hasOther === true,
    placeholder: typeof item.placeholder === 'string' ? item.placeholder : undefined,
    otherPlaceholder:
      typeof item.otherPlaceholder === 'string'
        ? item.otherPlaceholder
        : undefined,
  };
}

export function FeedbackForm() {
  const [answers, setAnswers] = useState<Record<string, ChoiceAnswer | string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rewardDistributedModalOpen, setRewardDistributedModalOpen] =
    useState(false);
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);
  const { submitFeedback, isSubmitting, canSubmit, isFeedbackFormLoading, schema } =
    useFeedbackSubmission();

  const questions = useMemo(
    () =>
      schema
        .map((item, index) => parseQuestion(item, index))
        .filter((question): question is FeedbackQuestion => question !== null),
    [schema],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    for (const question of questions) {
      if (!question.required) continue;
      const answer = answers[question.id];

      if (question.type === 'TEXT') {
        if (typeof answer !== 'string' || answer.trim().length === 0) {
          nextErrors[question.id] = '답변을 입력해주세요.';
        }
        continue;
      }

      if (!isRecord(answer) || typeof answer.optionId !== 'string') {
        nextErrors[question.id] = '답변을 선택해주세요.';
        continue;
      }

      if (
        question.hasOther &&
        answer.optionId === '__other__' &&
        (typeof answer.otherText !== 'string' || answer.otherText.trim().length === 0)
      ) {
        nextErrors[question.id] = '기타 의견을 입력해주세요.';
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payloadAnswers: Record<string, unknown> = {};
    for (const question of questions) {
      const answer = answers[question.id];
      if (question.type === 'TEXT') {
        payloadAnswers[question.id] = typeof answer === 'string' ? answer.trim() : '';
        continue;
      }
      if (!isRecord(answer) || typeof answer.optionId !== 'string') continue;
      payloadAnswers[question.id] =
        answer.optionId === '__other__'
          ? String(answer.otherText ?? '').trim()
          : answer.optionId;
    }

    try {
      const { rewardGranted } = await submitFeedback(payloadAnswers);
      if (rewardGranted) {
        setRewardDistributedModalOpen(true);
        return;
      }
      setSubmittedModalOpen(true);
    } catch {
      return;
    }
  };

  return (
    <>
      <FeedbackRewardDistributedModal
        open={rewardDistributedModalOpen}
        onOpenChange={setRewardDistributedModalOpen}
      />
      <FeedbackSubmittedModal
        open={submittedModalOpen}
        onOpenChange={setSubmittedModalOpen}
      />
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-[6.25rem]'
        noValidate
      >
        {questions.map((question, index) => {
          const answer = answers[question.id];
          const choiceAnswer: ChoiceAnswer =
            isRecord(answer) &&
            (answer.optionId === null || typeof answer.optionId === 'string') &&
            typeof answer.otherText === 'string'
              ? { optionId: answer.optionId, otherText: answer.otherText }
              : { optionId: null, otherText: '' };

          return (
            <QuestionSection
              key={question.id}
              required={question.required}
              title={`${index + 1}. ${question.text}`}
              error={errors[question.id]}
            >
              {question.type === 'CHOICE' ? (
                <div className={feedbackFormClassNames.answerStack}>
                  {question.options.map((option) => (
                    <CheckboxChoiceRow
                      key={`${question.id}-${option.id}`}
                      checked={choiceAnswer.optionId === option.id}
                      label={option.label}
                      onCheckedChange={(checked) => {
                        if (!checked) return;
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: { optionId: option.id, otherText: '' },
                        }));
                        setErrors((prev) => {
                          if (!prev[question.id]) return prev;
                          const next = { ...prev };
                          delete next[question.id];
                          return next;
                        });
                      }}
                    />
                  ))}
                  {question.hasOther ? (
                    <CheckboxOtherInlineRow
                      checked={choiceAnswer.optionId === '__other__'}
                      label='기타:'
                      value={choiceAnswer.otherText}
                      onChange={(value) => {
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: { optionId: '__other__', otherText: value },
                        }));
                        if (value.trim().length === 0) return;
                        setErrors((prev) => {
                          if (!prev[question.id]) return prev;
                          const next = { ...prev };
                          delete next[question.id];
                          return next;
                        });
                      }}
                      maxLength={200}
                      active={choiceAnswer.optionId === '__other__'}
                      onFocusInput={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: {
                            optionId: '__other__',
                            otherText: choiceAnswer.otherText,
                          },
                        }))
                      }
                      onCheckedChange={(checked) => {
                        if (!checked) return;
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: {
                            optionId: '__other__',
                            otherText: choiceAnswer.otherText,
                          },
                        }));
                      }}
                      placeholder={
                        question.otherPlaceholder ?? '기타 의견을 입력해주세요.'
                      }
                    />
                  ) : null}
                </div>
              ) : (
                <LongFormTextField
                  value={typeof answer === 'string' ? answer : ''}
                  onChange={(value) => {
                    setAnswers((prev) => ({ ...prev, [question.id]: value }));
                    if (value.trim().length === 0) return;
                    setErrors((prev) => {
                      if (!prev[question.id]) return prev;
                      const next = { ...prev };
                      delete next[question.id];
                      return next;
                    });
                  }}
                  maxLength={500}
                />
              )}
            </QuestionSection>
          );
        })}

        <div className='flex justify-center pb-4'>
          <CommonButton
            type='submit'
            variantType='Primary'
            px='2.25rem'
            py='0.875rem'
            disabled={isSubmitting || isFeedbackFormLoading || !canSubmit}
          >
            제출하기
          </CommonButton>
        </div>
      </form>
    </>
  );
}
