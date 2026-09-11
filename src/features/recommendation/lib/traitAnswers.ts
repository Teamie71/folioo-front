import type { TraitAnswerReqDTO } from '@/api/models';
import type { InterestLikertValue } from '@/features/recommendation/constants';

export function toAssessmentTraitValue(uiValue: InterestLikertValue): number {
  return 7 - uiValue;
}

export function buildTraitAnswers(
  interestAnswers: Record<string, InterestLikertValue>,
): TraitAnswerReqDTO[] {
  const answers: TraitAnswerReqDTO[] = [];

  for (let questionNo = 1; questionNo <= 15; questionNo += 1) {
    const uiValue =
      interestAnswers[`interest-${questionNo}`] ??
      interestAnswers[String(questionNo)];

    if (uiValue == null) continue;

    answers.push({
      questionNo,
      value: toAssessmentTraitValue(uiValue),
    });
  }

  return answers;
}
