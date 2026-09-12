import Image from 'next/image';

const WIDTH = 232;
const HEIGHT = 252;

export function RecommendationLandingIllustration() {
  return (
    <Image
      src='/recommendation/landing-illustration.svg'
      alt=''
      width={WIDTH}
      height={HEIGHT}
      className='h-[252px] w-[232px] shrink-0'
      priority
      aria-hidden
    />
  );
}
