'use client';

const ILLUSTRATION_VIDEO_SRC = '/recommendation/landing.mp4';

export function RecommendationLandingIllustration() {
  return (
    <video
      src={ILLUSTRATION_VIDEO_SRC}
      className='h-[15.75rem] w-[14.5rem] shrink-0 object-contain outline-none [&::-webkit-media-controls]:!hidden [&::-webkit-media-controls-enclosure]:!hidden'
      playsInline
      muted
      loop
      autoPlay
      preload='auto'
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      controlsList='nodownload nofullscreen noremoteplayback noplaybackrate'
      aria-hidden
    />
  );
}
