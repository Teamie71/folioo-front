'use client';

/**
 * 랜딩 섹션용 비디오. width/height로 크기를 직접 지정할 수 있음.
 * 미지정 시 기본 18.75rem × 31.25rem. 원본 화질 유지를 위해
 * mp4는 표시 해상도 이상(권장: 가로 1000px 이상)으로 인코딩하면 선명합니다.
 * public 폴더 기준 경로 사용 (예: /landing/log-intro.mp4).
 */
export function LandingVideo({
  src,
  width,
  height,
  className = '',
  poster,
  playsInline = true,
  muted = true,
  loop = true,
  autoPlay = true,
}: {
  src: string;
  /** CSS 값 (예: '31.25rem', '66rem', '100%') */
  width?: string;
  /** CSS 값 (예: '18.75rem', '37.125rem') */
  height?: string;
  className?: string;
  poster?: string;
  playsInline?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
}) {
  const style = {
    width: width ?? '31.25rem',
    height: height ?? '18.75rem',
  };

  return (
    <div
      className={`overflow-hidden bg-[#D9D9D9] ${className}`}
      style={style}
    >
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
