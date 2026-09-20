'use client';

import { useEffect, useRef, useState } from 'react';

const ILLUSTRATION_VIDEO_SRC = '/recommendation/landing.mp4';
const ILLUSTRATION_GIF_SRC = '/recommendation/landing.gif';
const ILLUSTRATION_CLASS = 'h-[15.75rem] w-[14.5rem] shrink-0 object-contain';

export function RecommendationLandingIllustration() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useGif, setUseGif] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const markBlocked = () => {
      if (!cancelled) setUseGif(true);
    };

    video.play().catch(markBlocked);
    video.addEventListener('error', markBlocked);

    return () => {
      cancelled = true;
      video.removeEventListener('error', markBlocked);
    };
  }, []);

  if (useGif) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={ILLUSTRATION_GIF_SRC}
        alt=''
        className={ILLUSTRATION_CLASS}
        width={232}
        height={260}
        decoding='async'
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={ILLUSTRATION_VIDEO_SRC}
      className={`${ILLUSTRATION_CLASS} outline-none [&::-webkit-media-controls]:!hidden [&::-webkit-media-controls-enclosure]:!hidden`}
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
