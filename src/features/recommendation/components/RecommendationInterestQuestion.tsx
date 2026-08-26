import { type InterestLikertValue } from '@/features/recommendation/constants';
import { RecommendationInterestScale } from '@/features/recommendation/components/RecommendationInterestScale';

interface RecommendationInterestQuestionProps {
  index: number;
  question: string;
  value?: InterestLikertValue;
  onChange: (value: InterestLikertValue) => void;
}

export function RecommendationInterestQuestion({
  index,
  question,
  value,
  onChange,
}: RecommendationInterestQuestionProps) {
  const number = index + 1;

  return (
    <div className='flex flex-col gap-[1rem]'>
      <p className='typo-b2 text-gray9'>
        {number}. {question}
      </p>
      <RecommendationInterestScale
        name={`흥미 문항 ${number}`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
