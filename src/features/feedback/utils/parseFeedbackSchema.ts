export type FeedbackQuestionType = 'CHOICE' | 'TEXT';

export type FeedbackOption = {
  id: string;
  label: string;
};

export type FeedbackQuestion = {
  id: string;
  text: string;
  type: FeedbackQuestionType;
  required: boolean;
  options: FeedbackOption[];
  hasOther: boolean;
  placeholder?: string;
  otherPlaceholder?: string;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

export function questionNumberLabel(id: string, fallbackIndex: number): string {
  const matched = /^q(\d+(?:-\d+)?)$/i.exec(id);
  return matched ? matched[1] : String(fallbackIndex + 1);
}

export function questionTitle(question: FeedbackQuestion, index: number): string {
  if (/^\d+(?:-\d+)?\.\s*/.test(question.text)) {
    return question.text;
  }
  return `${questionNumberLabel(question.id, index)}. ${question.text}`;
}

export function parseQuestion(
  item: unknown,
  index: number,
): FeedbackQuestion | null {
  if (!isRecord(item)) return null;
  const id =
    typeof item.id === 'string' && item.id.trim() ? item.id : `q${index + 1}`;
  const text = typeof item.text === 'string' ? item.text : '';
  const type =
    item.type === 'CHOICE' || item.type === 'TEXT' ? item.type : null;
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
    placeholder:
      typeof item.placeholder === 'string' ? item.placeholder : undefined,
    otherPlaceholder:
      typeof item.otherPlaceholder === 'string'
        ? item.otherPlaceholder
        : undefined,
  };
}

export function parseFeedbackSchema(schema: unknown[]): FeedbackQuestion[] {
  return schema
    .map((item, index) => parseQuestion(item, index))
    .filter((question): question is FeedbackQuestion => question !== null);
}

export function isChoiceAnswer(
  value: unknown,
): value is { optionId: string | null; otherText: string } {
  return (
    isRecord(value) &&
    (value.optionId === null || typeof value.optionId === 'string') &&
    typeof value.otherText === 'string'
  );
}
