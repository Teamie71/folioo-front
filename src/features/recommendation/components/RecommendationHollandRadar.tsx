import { useId } from 'react';
import { cn } from '@/utils/utils';
import { HOLLAND_AXIS_ORDER, HOLLAND_TYPES } from '@/features/recommendation/constants';
import type { HollandScores } from '@/features/recommendation/types';

const CX = 110;
const CY = 109;
const MAX_RADIUS = 100;
const GRID_COLOR = '#CDD0D5';
const STROKE_COLOR = '#5060C5';

const LABEL_CLASS: Record<(typeof HOLLAND_AXIS_ORDER)[number], string> = {
  R: 'left-1/2 top-0 -translate-x-1/2',
  I: 'top-[66px] right-0',
  A: 'top-[176px] right-0',
  S: 'bottom-0 left-1/2 -translate-x-1/2',
  E: 'top-[176px] left-0',
  C: 'top-[66px] left-0',
};

function hexPoint(radius: number, index: number) {
  const angle = -Math.PI / 2 + (index * Math.PI) / 3;
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  };
}

function toPoints(radius: number) {
  return Array.from({ length: 6 }, (_, index) => hexPoint(radius, index))
    .map((point) => `${point.x},${point.y}`)
    .join(' ');
}

interface RecommendationHollandRadarProps {
  scores: HollandScores;
}

export function RecommendationHollandRadar({
  scores,
}: RecommendationHollandRadarProps) {
  const gradientId = useId();
  const dataPoints = HOLLAND_AXIS_ORDER.map((code, index) => {
    const ratio = Math.min(1, Math.max(0, scores[code]));
    return hexPoint(MAX_RADIUS * ratio, index);
  });
  const dataPolygon = dataPoints
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  return (
    <div className='relative h-[258px] w-[311px] shrink-0'>
      {HOLLAND_TYPES.map((type) => (
        <span
          key={type.code}
          className={cn(
            'typo-c2 text-gray9 absolute whitespace-nowrap',
            LABEL_CLASS[type.code],
          )}
        >
          {type.name}
        </span>
      ))}
      <svg
        className='absolute top-[20px] left-[47px]'
        width='220'
        height='218'
        viewBox='0 0 220 218'
        fill='none'
        aria-hidden
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1='0'
            y1='0'
            x2='0'
            y2='1'
          >
            <stop offset='0' stopColor='#93B3F4' />
            <stop offset='1' stopColor='#5060C5' />
          </linearGradient>
        </defs>
        <polygon
          points={toPoints(MAX_RADIUS)}
          stroke={GRID_COLOR}
          strokeWidth='1'
        />
        <polygon
          points={toPoints(MAX_RADIUS * 0.5)}
          stroke={GRID_COLOR}
          strokeWidth='1'
        />
        {Array.from({ length: 3 }, (_, index) => {
          const start = hexPoint(MAX_RADIUS, index);
          const end = hexPoint(MAX_RADIUS, index + 3);
          return (
            <line
              key={index}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={GRID_COLOR}
              strokeWidth='1'
            />
          );
        })}
        <polygon
          points={dataPolygon}
          fill={`url(#${gradientId})`}
          fillOpacity='0.5'
          stroke={STROKE_COLOR}
        />
        {dataPoints.map((point, index) => (
          <circle
            key={HOLLAND_AXIS_ORDER[index]}
            cx={point.x}
            cy={point.y}
            r='3'
            fill={STROKE_COLOR}
          />
        ))}
      </svg>
    </div>
  );
}

