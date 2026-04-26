'use client';

import { useCallback, useMemo, useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import {
  DISCOVERY_OPTIONS,
  FEEDBACK_MAX_LENGTH,
  PRIORITY_OPTIONS,
  SENTIMENT_OPTIONS,
  type DiscoveryId,
  type FeedbackFormErrors,
  type FeedbackFormValues,
  type PriorityId,
  type SentimentId,
  createEmptyDiscoverySelection,
  validateFeedbackForm,
} from '../constants';
import {
  CheckboxChoiceRow,
  CheckboxOtherInlineRow,
  LongFormTextField,
  QuestionSection,
  SubQuestionSection,
  feedbackFormClassNames,
} from './FeedbackFormPrimitives';
import { FeedbackRewardDistributedModal } from './FeedbackRewardDistributedModal';
import { FeedbackSubmittedModal } from './FeedbackSubmittedModal';

const FEEDBACK_REWARD_RECEIVED_STORAGE_KEY = 'folioo_feedback_reward_received';

export function FeedbackForm() {
  const [discovery, setDiscovery] = useState(createEmptyDiscoverySelection);
  const [discoveryOther, setDiscoveryOther] = useState('');
  const [sentiment, setSentiment] = useState<SentimentId | null>(null);
  const [sentimentReason, setSentimentReason] = useState('');
  const [priority, setPriority] = useState<PriorityId | null>(null);
  const [priorityOther, setPriorityOther] = useState('');
  const [priorityDetail, setPriorityDetail] = useState('');
  const [errors, setErrors] = useState<FeedbackFormErrors>({});
  const [rewardDistributedModalOpen, setRewardDistributedModalOpen] =
    useState(false);
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);

  const clearFieldError = useCallback((field: keyof FeedbackFormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  }, []);

  const formValues: FeedbackFormValues = useMemo(
    () => ({
      discovery,
      discoveryOther,
      sentiment,
      sentimentReason,
      priority,
      priorityOther,
      priorityDetail,
    }),
    [
      discovery,
      discoveryOther,
      sentiment,
      sentimentReason,
      priority,
      priorityOther,
      priorityDetail,
    ],
  );

  const toggleDiscovery = useCallback((id: DiscoveryId, checked: boolean) => {
    if (!checked) return;
    setDiscovery(() => ({
      word_of_mouth: id === 'word_of_mouth',
      instagram: id === 'instagram',
      search: id === 'search',
      community: id === 'community',
      ai_recommend: id === 'ai_recommend',
      other: id === 'other',
    }));
    clearFieldError('discovery');
  }, [clearFieldError]);

  const handleSentimentCheck = useCallback(
    (id: SentimentId, checked: boolean) => {
      if (!checked) return;
      setSentiment(id);
      clearFieldError('sentiment');
    },
    [clearFieldError],
  );

  const handlePriorityCheck = useCallback(
    (id: PriorityId, checked: boolean) => {
      if (!checked) return;
      setPriority(id);
      clearFieldError('priority');
    },
    [clearFieldError],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateFeedbackForm(formValues);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (typeof window !== 'undefined') {
      const hasRewardHistory =
        localStorage.getItem(FEEDBACK_REWARD_RECEIVED_STORAGE_KEY) === 'true';
      if (!hasRewardHistory) {
        localStorage.setItem(FEEDBACK_REWARD_RECEIVED_STORAGE_KEY, 'true');
        setRewardDistributedModalOpen(true);
        return;
      }
    }

    setSubmittedModalOpen(true);
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
        <QuestionSection
          required
          title={<>1. Folioo를 어떻게 처음 알게 되셨나요?</>}
          error={errors.discovery}
        >
          <div className={feedbackFormClassNames.answerStack}>
            {DISCOVERY_OPTIONS.map((option) =>
              option.id === 'other' ? (
                <CheckboxOtherInlineRow
                  key={option.id}
                  checked={discovery.other}
                  label={option.label}
                  value={discoveryOther}
                  onChange={(value) => {
                    setDiscoveryOther(value);
                    if (value.trim().length > 0) clearFieldError('discovery');
                  }}
                  maxLength={FEEDBACK_MAX_LENGTH.other}
                  active={discovery.other}
                  onFocusInput={() => toggleDiscovery('other', true)}
                  onCheckedChange={(checked) =>
                    toggleDiscovery('other', checked)
                  }
                />
              ) : (
                <CheckboxChoiceRow
                  key={option.id}
                  checked={discovery[option.id]}
                  label={option.label}
                  onCheckedChange={(checked) =>
                    toggleDiscovery(option.id, checked)
                  }
                />
              ),
            )}
          </div>
        </QuestionSection>

        <QuestionSection
          required
          title={
            <>
              2. 만약 오늘부터 Folioo를 더 이상 사용할 수 없게 된다면, 기분이
              어떠시겠습니까?
            </>
          }
          error={errors.sentiment}
        >
          <div className={feedbackFormClassNames.answerStack}>
            {SENTIMENT_OPTIONS.map((option) => (
              <CheckboxChoiceRow
                key={option.id}
                checked={sentiment === option.id}
                label={option.label}
                onCheckedChange={(checked) =>
                  handleSentimentCheck(option.id, checked)
                }
              />
            ))}
          </div>

          <SubQuestionSection title='2-1. 그렇게 답변하신 주된 이유는 무엇인가요?'>
            <LongFormTextField
              value={sentimentReason}
              onChange={setSentimentReason}
              maxLength={FEEDBACK_MAX_LENGTH.detail}
            />
          </SubQuestionSection>
        </QuestionSection>

        <QuestionSection
          required
          title={
            <>
              3. 우리 서비스가 귀하에게 더 완벽해지기 위해, 가장 시급하게
              해결해야 할 1순위는 무엇인가요?
            </>
          }
          error={errors.priority}
        >
          <div className={feedbackFormClassNames.answerStack}>
            {PRIORITY_OPTIONS.map((option) =>
              option.id === 'other' ? (
                <CheckboxOtherInlineRow
                  key={option.id}
                  checked={priority === 'other'}
                  label={option.label}
                  value={priorityOther}
                  onChange={(value) => {
                    setPriorityOther(value);
                    if (value.trim().length > 0) clearFieldError('priority');
                  }}
                  maxLength={FEEDBACK_MAX_LENGTH.other}
                  active={priority === 'other'}
                  onFocusInput={() => handlePriorityCheck('other', true)}
                  onCheckedChange={(checked) =>
                    handlePriorityCheck('other', checked)
                  }
                />
              ) : (
                <CheckboxChoiceRow
                  key={option.id}
                  checked={priority === option.id}
                  label={option.label}
                  onCheckedChange={(checked) =>
                    handlePriorityCheck(option.id, checked)
                  }
                />
              ),
            )}
          </div>

          <SubQuestionSection title='3-1. 위에서 선택한 내용에 대해 조금만 더 자세히 설명해 주세요.'>
            <LongFormTextField
              value={priorityDetail}
              onChange={setPriorityDetail}
              maxLength={FEEDBACK_MAX_LENGTH.detail}
            />
          </SubQuestionSection>
        </QuestionSection>

        <div className='flex justify-center pb-4'>
          <CommonButton
            type='submit'
            variantType='Primary'
            px='2.25rem'
            py='0.875rem'
          >
            제출하기
          </CommonButton>
        </div>
      </form>
    </>
  );
}
