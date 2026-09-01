type LikertTone = 'agree' | 'disagree';

interface InterestLikertIconProps {
  tone: LikertTone;
  selected?: boolean;
  size: number;
}

const TONE_COLOR: Record<LikertTone, string> = {
  agree: '#00A000',
  disagree: '#DC0000',
};

const CHECK_CIRCLE_PATH =
  'M15.48 21.24L11.61 17.37C11.28 17.04 10.86 16.875 10.35 16.875C9.84 16.875 9.42 17.04 9.09 17.37C8.76 17.7 8.595 18.12 8.595 18.63C8.595 19.14 8.76 19.56 9.09 19.89L14.22 25.02C14.58 25.38 15 25.56 15.48 25.56C15.96 25.56 16.38 25.38 16.74 25.02L26.91 14.85C27.24 14.52 27.405 14.1 27.405 13.59C27.405 13.08 27.24 12.66 26.91 12.33C26.58 12 26.16 11.835 25.65 11.835C25.14 11.835 24.72 12 24.39 12.33L15.48 21.24ZM18 36C15.51 36 13.17 35.5272 10.98 34.5816C8.79 33.636 6.885 32.3538 5.265 30.735C3.645 29.1162 2.3628 27.2112 1.4184 25.02C0.474002 22.8288 0.00120228 20.4888 2.27848e-06 18C-0.00119772 15.5112 0.471602 13.1712 1.4184 10.98C2.3652 8.7888 3.6474 6.8838 5.265 5.265C6.8826 3.6462 8.7876 2.364 10.98 1.4184C13.1724 0.4728 15.5124 0 18 0C20.4876 0 22.8276 0.4728 25.02 1.4184C27.2124 2.364 29.1174 3.6462 30.735 5.265C32.3526 6.8838 33.6354 8.7888 34.5834 10.98C35.5314 13.1712 36.0036 15.5112 36 18C35.9964 20.4888 35.5236 22.8288 34.5816 25.02C33.6396 27.2112 32.3574 29.1162 30.735 30.735C29.1126 32.3538 27.2076 33.6366 25.02 34.5834C22.8324 35.5302 20.4924 36.0024 18 36Z';

export function InterestLikertIcon({
  tone,
  selected = false,
  size,
}: InterestLikertIconProps) {
  const color = TONE_COLOR[tone];

  if (selected) {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        height={size}
        viewBox='0 0 36 36'
        fill='none'
        aria-hidden
      >
        <circle
          cx='18'
          cy='18'
          r='17.25'
          stroke={color}
          strokeWidth='1.5'
          opacity='0.3'
        />
        <path d={CHECK_CIRCLE_PATH} fill={color} opacity='0.4' />
      </svg>
    );
  }

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 44 44'
      fill='none'
      aria-hidden
    >
      <circle cx='22' cy='22' r='22' fill='white' />
      <circle
        cx='22'
        cy='22'
        r='21.25'
        fill='white'
        stroke={color}
        strokeWidth='1.5'
        opacity='0.3'
      />
    </svg>
  );
}
