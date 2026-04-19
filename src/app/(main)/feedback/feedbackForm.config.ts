/** Feedback page: options, validation, request body shape */

export const FEEDBACK_REQUIRED_ERROR = '답변을 선택해주세요.' as const;

export const DISCOVERY_OPTIONS = [
  { id: 'word_of_mouth', label: '지인 추천/ 입소문' },
  { id: 'instagram', label: '인스타그램' },
  { id: 'search', label: '검색 (네이버, 구글 등)' },
  { id: 'community', label: '커뮤니티 (에브리타임, 링크드인 등)' },
  { id: 'ai_recommend', label: 'AI (ChatGPT, Gemini, Claude 등) 추천' },
  { id: 'other', label: '기타:', hasUnderline: true },
] as const;

export const SENTIMENT_OPTIONS = [
  { id: 'very_sad', label: '매우 아쉬울 것이다' },
  { id: 'a_bit_sad', label: '조금 아쉬울 것이다' },
  { id: 'not_much', label: '별로 아쉽지 않을 것이다' },
  { id: 'not_at_all', label: '전혀 아쉽지 않을 것이다' },
] as const;

export const PRIORITY_OPTIONS = [
  {
    id: 'critical_bug',
    label: '작동하지 않거나 멈추는 등 치명적인 오류 수정',
  },
  { id: 'speed', label: '서비스 이용 속도의 향상' },
  { id: 'missing_feature', label: '꼭 필요하지만 현재 없는 기능 추가' },
  { id: 'ui_ux', label: 'UI/UX가 불편하거나 이용법이 어려움' },
  { id: 'pricing', label: '요금제나 이용 조건의 조정' },
  { id: 'other', label: '기타:', hasUnderline: true },
] as const;

export type DiscoveryId = (typeof DISCOVERY_OPTIONS)[number]['id'];
export type SentimentId = (typeof SENTIMENT_OPTIONS)[number]['id'];
export type PriorityId = (typeof PRIORITY_OPTIONS)[number]['id'];

export type FeedbackFieldErrorKey = 'discovery' | 'sentiment' | 'priority';

export type FeedbackFormErrors = Partial<Record<FeedbackFieldErrorKey, string>>;

export type DiscoverySelection = Record<DiscoveryId, boolean>;

export function createEmptyDiscoverySelection(): DiscoverySelection {
  return {
    word_of_mouth: false,
    instagram: false,
    search: false,
    community: false,
    ai_recommend: false,
    other: false,
  };
}

export interface FeedbackFormValues {
  discovery: DiscoverySelection;
  discoveryOther: string;
  sentiment: SentimentId | null;
  sentimentReason: string;
  priority: PriorityId | null;
  priorityOther: string;
  priorityDetail: string;
}

export function validateFeedbackForm(
  values: FeedbackFormValues,
): FeedbackFormErrors {
  const errors: FeedbackFormErrors = {};

  const anyDiscovery = Object.values(values.discovery).some(Boolean);
  if (!anyDiscovery) {
    errors.discovery = FEEDBACK_REQUIRED_ERROR;
  }

  if (values.sentiment == null) {
    errors.sentiment = FEEDBACK_REQUIRED_ERROR;
  }

  if (values.priority == null) {
    errors.priority = FEEDBACK_REQUIRED_ERROR;
  }

  return errors;
}

export function serializeFeedbackForm(values: FeedbackFormValues) {
  const discoverySelected = (
    Object.entries(values.discovery) as [DiscoveryId, boolean][]
  )
    .filter(([, checked]) => checked)
    .map(([id]) => id);

  return {
    discovery: {
      selectedIds: discoverySelected,
      otherText: values.discoveryOther.trim() || undefined,
    },
    sentiment: values.sentiment,
    sentimentReason: values.sentimentReason.trim() || undefined,
    priority: values.priority,
    priorityOtherText: values.priorityOther.trim() || undefined,
    priorityDetail: values.priorityDetail.trim() || undefined,
  };
}
