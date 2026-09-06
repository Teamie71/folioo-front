'use client';

/**
 * 랜딩 미디어 영역입니다. 영상이 준비되기 전에는 src 없이 사용해
 * 동일한 크기의 회색 스켈레톤을 보여줍니다.
 */
export function LandingVideo({
  src,
  width,
  height,
  className = '',
  poster,
  label = '영상 준비 중',
  playsInline = true,
  muted = true,
  loop = true,
  autoPlay = true,
}: {
  src?: string;
  /** CSS 값 (예: '31.25rem', '66rem', '100%') */
  width?: string;
  /** CSS 값 (예: '18.75rem', '37.125rem') */
  height?: string;
  className?: string;
  poster?: string;
  label?: string;
  playsInline?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
}) {
  const style = {
    width: width ?? '31.25rem',
    height: height ?? '18.75rem',
  };

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[1rem] bg-[#D9D9D9] text-[1.125rem] font-semibold text-[#9EA4A9] ${className}`}
        style={style}
        aria-label={label}
        role='img'
      >
        영상
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-[#D9D9D9] ${className}`} style={style}>
      <video
        className='h-full w-full object-cover outline-none [&::-webkit-media-controls]:!hidden [&::-webkit-media-controls-enclosure]:!hidden'
        src={src}
        poster={poster}
        playsInline={playsInline}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        preload='auto'
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        controlsList='nodownload nofullscreen noremoteplayback noplaybackrate'
      />
    </div>
  );
}
