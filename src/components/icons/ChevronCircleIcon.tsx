type ChevronCircleIconProps = {
  /** true면 흰 원/테두리/그림자 없이 화살표만 표시 (모바일 버튼 등) */
  minimal?: boolean;
};

export const ChevronCircleIcon = ({ minimal }: ChevronCircleIconProps) => {
  if (minimal) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" fill="none" className="size-full">
        <path
          d="M24 34.6211L32 23.6211L24 12.6211"
          stroke="#5060C5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
      <g filter="url(#filter0_d_3608_2786)">
        <rect x="48" y="2" width="44" height="44" rx="22" transform="rotate(90 48 2)" fill="white" fillOpacity="0.6" shapeRendering="crispEdges"/>
        <rect x="47.5" y="2.5" width="43" height="43" rx="21.5" transform="rotate(90 47.5 2.5)" stroke="url(#paint0_linear_3608_2786)" shapeRendering="crispEdges"/>
        <path d="M24 34.6211L32 23.6211L24 12.6211" stroke="#5060C5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <filter id="filter0_d_3608_2786" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="2"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3608_2786"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3608_2786" result="shape"/>
        </filter>
        <linearGradient id="paint0_linear_3608_2786" x1="51.0345" y1="13" x2="90.8621" y2="34.2414" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="#F2F2F2"/>
        </linearGradient>
      </defs>
    </svg>
  );
};