const ILLUSTRATION_GIF_SRC = '/recommendation/landing.gif';

export function RecommendationLandingIllustration() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- animated GIF for iOS Low Power Mode
    <img
      src={ILLUSTRATION_GIF_SRC}
      alt=''
      className='h-[15.75rem] w-[14.5rem] shrink-0 object-contain'
      width={232}
      height={260}
      decoding='async'
      aria-hidden
    />
  );
}
