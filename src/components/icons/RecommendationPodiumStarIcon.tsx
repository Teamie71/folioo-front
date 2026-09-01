import { useId } from 'react';

export function RecommendationPodiumStarIcon({
  className,
}: {
  className?: string;
}) {
  const gradientId = useId();

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      width='27'
      height='25'
      viewBox='0 0 27 25'
      fill='none'
      aria-hidden
    >
      <path
        opacity='0.5'
        d='M11.2532 1.09131C11.9955 -0.363197 14.0738 -0.363197 14.8161 1.09131L17.3685 6.09276C17.6591 6.6622 18.2044 7.0584 18.8358 7.15881L24.3812 8.04076C25.9939 8.29725 26.6361 10.2738 25.4822 11.4292L21.5143 15.4023C21.0625 15.8546 20.8542 16.4957 20.9538 17.1272L21.8286 22.6737C22.0831 24.2867 20.4017 25.5083 18.9462 24.7679L13.9415 22.2219C13.3717 21.932 12.6976 21.932 12.1278 22.2219L7.12311 24.7679C5.66765 25.5083 3.98627 24.2867 4.24069 22.6737L5.11553 17.1272C5.21513 16.4957 5.00684 15.8546 4.55507 15.4023L0.587143 11.4292C-0.566793 10.2738 0.0754364 8.29725 1.68813 8.04076L7.23353 7.15881C7.8649 7.0584 8.41022 6.6622 8.70083 6.09276L11.2532 1.09131Z'
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1='13.0347'
          y1='-2.39941'
          x2='13.0347'
          y2='29.6006'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#93B3F4' />
          <stop offset='1' stopColor='#5060C5' />
        </linearGradient>
      </defs>
    </svg>
  );
}
