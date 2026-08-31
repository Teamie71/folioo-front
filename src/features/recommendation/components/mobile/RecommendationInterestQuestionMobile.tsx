import { RecommendationInterestScaleMobile } from '@/features/recommendation/components/mobile/RecommendationInterestScaleMobile';
import type { InterestLikertValue } from '@/features/recommendation/constants';

interface RecommendationInterestQuestionMobileProps {
  number: number;
  text: string;
  name: string;
  value?: InterestLikertValue;
  onChange: (value: InterestLikertValue) => void;
}

export function RecommendationInterestQuestionMobile({
  number,
  text,
  name,
  value,
  onChange,
}: RecommendationInterestQuestionMobileProps) {
  return (
    <div className='flex w-full flex-col items-center gap-[0.5rem]'>
      <ol
        start={number}
        className='typo-c1 w-full min-w-full list-decimal break-words text-gray9'
      >
        <li className='ms-[1.3125rem] leading-[150%]'>{text}</li>
      </ol>

      <RecommendationInterestScaleMobile
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
