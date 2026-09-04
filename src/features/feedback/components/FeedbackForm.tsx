'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { useAuthStore } from '@/store/useAuthStore';
import {
  isChoiceAnswer,
  parseFeedbackSchema,
  questionTitle,
  type FeedbackQuestion,
} from '../utils/parseFeedbackSchema';
import { useFeedbackSubmission } from '../hooks/useFeedbackSubmission';
import {
  CheckboxChoiceRow,
  CheckboxOtherInlineRow,
  LongFormTextField,
  QuestionSection,
  feedbackFormClassNames,
} from './FeedbackFormPrimitives';
import { FeedbackSubmittedModal } from './FeedbackSubmittedModal';

type ChoiceAnswer = {
  optionId: string | null;
  otherText: string;
};

const EMPTY_CHOICE: ChoiceAnswer = { optionId: null, otherText: '' };

export function FeedbackForm() {
  const [answers, setAnswers] = useState<Record<string, ChoiceAnswer | string>>(
    {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);
  const {
    submitFeedback,
    isSubmitting,
    canSubmit,
    isFeedbackFormLoading,
    schema,
  } = useFeedbackSubmission();

  const questions = useMemo(() => parseFeedbackSchema(schema), [schema]);

  const hasAnyAnswer = useMemo(
    () =>
      questions.some((question) => {
        const answer = answers[question.id];
        if (question.type === 'TEXT') {
          return typeof answer === 'string' && answer.trim().length > 0;
        }
        return isChoiceAnswer(answer) && typeof answer.optionId === 'string';
      }),
    [answers, questions],
  );

  const clearError = (questionId: string) => {
    setErrors((prev) => {
      if (!prev[questionId]) return prev;
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const setChoiceAnswer = (questionId: string, next: ChoiceAnswer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: next }));
  };

  const handleSubmit = async () => {
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

      if (!isChoiceAnswer(answer) || typeof answer.optionId !== 'string') {
        nextErrors[question.id] = '답변을 선택해주세요.';
        continue;
      }

      if (
        question.hasOther &&
        answer.optionId === '__other__' &&
        answer.otherText.trim().length === 0
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
        payloadAnswers[question.id] =
          typeof answer === 'string' ? answer.trim() : '';
        continue;
      }
      if (!isChoiceAnswer(answer) || typeof answer.optionId !== 'string') {
        continue;
      }
      payloadAnswers[question.id] =
        answer.optionId === '__other__'
          ? answer.otherText.trim()
          : answer.optionId;
    }

    try {
      await submitFeedback(payloadAnswers);
      setSubmittedModalOpen(true);
    } catch {
      return;
    }
  };

  return (
    <>
      <FeedbackSubmittedModal
        open={submittedModalOpen}
        onOpenChange={setSubmittedModalOpen}
      />
      <div className='flex flex-col gap-[6.25rem]'>
        {questions.map((question, index) => (
          <QuestionBlock
            key={question.id}
            question={question}
            index={index}
            answer={answers[question.id]}
            error={errors[question.id]}
            onClearError={() => clearError(question.id)}
            onTextChange={(value) => {
              setAnswers((prev) => ({ ...prev, [question.id]: value }));
              if (value.trim().length > 0) clearError(question.id);
            }}
            onChoiceChange={(next) => {
              setChoiceAnswer(question.id, next);
              const otherText = next.otherText ?? '';
              if (
                next.optionId &&
                !(next.optionId === '__other__' && otherText.trim().length === 0)
              ) {
                clearError(question.id);
              }
            }}
          />
        ))}

        <div className='flex justify-center'>
          <CommonButton
            type='button'
            variantType='Primary'
            px='2.25rem'
            py='0.75rem'
            disabled={
              isSubmitting ||
              isFeedbackFormLoading ||
              !canSubmit ||
              !hasAnyAnswer
            }
            onClick={() => {
              void handleSubmit();
            }}
          >
            제출하기
          </CommonButton>
        </div>
      </div>
    </>
  );
}

function QuestionBlock({
  question,
  index,
  answer,
  error,
  onClearError,
  onTextChange,
  onChoiceChange,
}: {
  question: FeedbackQuestion;
  index: number;
  answer: ChoiceAnswer | string | undefined;
  error?: string;
  onClearError: () => void;
  onTextChange: (value: string) => void;
  onChoiceChange: (next: ChoiceAnswer) => void;
}) {
  const choiceAnswer: ChoiceAnswer = isChoiceAnswer(answer)
    ? answer
    : EMPTY_CHOICE;

  return (
    <QuestionSection
      required={question.required}
      title={questionTitle(question, index)}
      error={error}
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
                onChoiceChange({
                  optionId: option.id,
                  otherText: choiceAnswer.otherText,
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
                onChoiceChange({ optionId: '__other__', otherText: value });
                if (value.trim().length > 0) onClearError();
              }}
              maxLength={200}
              active={choiceAnswer.optionId === '__other__'}
              onFocusInput={() =>
                onChoiceChange({
                  optionId: '__other__',
                  otherText: choiceAnswer.otherText,
                })
              }
              onCheckedChange={(checked) => {
                if (!checked) return;
                onChoiceChange({
                  optionId: '__other__',
                  otherText: choiceAnswer.otherText,
                });
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
          onChange={onTextChange}
          maxLength={500}
          placeholder={question.placeholder}
        />
      )}
    </QuestionSection>
  );
}
