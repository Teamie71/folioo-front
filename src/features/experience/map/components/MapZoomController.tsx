'use client';

import { useEffect, useRef, useState } from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import { MapZoomInIcon } from '@/components/icons/MapZoomInIcon';
import { MapZoomOutIcon } from '@/components/icons/MapZoomOutIcon';
import {
  percentForZoom,
  zoomForPercent,
} from '@/features/experience/map/model/mapZoom';

const STOPS = [25, 50, 100, 200] as const;
const MIN = STOPS[0];
const MAX = STOPS[STOPS.length - 1];

function clampPercent(value: number) {
  return Math.min(MAX, Math.max(MIN, value));
}

/** 네 기준점이 바의 0, 1/3, 2/3, 1 위치에 오도록 배치한다. */
function percentToPosition(value: number) {
  const percent = clampPercent(value);
  for (let index = 0; index < STOPS.length - 1; index += 1) {
    const start = STOPS[index];
    const end = STOPS[index + 1];
    if (percent <= end)
      return ((index + (percent - start) / (end - start)) / 3) * 100;
  }
  return 100;
}

function positionToPercent(position: number) {
  const scaled = (Math.min(100, Math.max(0, position)) / 100) * 3;
  const index = Math.min(2, Math.floor(scaled));
  return STOPS[index] + (STOPS[index + 1] - STOPS[index]) * (scaled - index);
}

export function MapZoomController() {
  const { zoom } = useViewport();
  const { zoomTo } = useReactFlow();
  // 경계 직전 값(49.9%, 99.9%)이 다음 단계의 숫자로 보이지 않게 한다.
  const zoomPercent = percentForZoom(zoom);
  const percent = clampPercent(Math.floor(zoomPercent + 1e-9));
  const position = percentToPosition(zoomPercent);
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(percent));

  useEffect(() => {
    if (!editing) setDraft(String(percent));
  }, [editing, percent]);

  const apply = (value: number, duration = 0) => {
    void zoomTo(zoomForPercent(clampPercent(value)), { duration });
  };

  const updateFromPointer = (clientY: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    apply(positionToPercent(((rect.bottom - clientY) / rect.height) * 100));
  };

  const step = (direction: -1 | 1) => {
    const next =
      direction === 1
        ? STOPS.find((value) => value > zoomPercent + 0.01)
        : [...STOPS].reverse().find((value) => value < zoomPercent - 0.01);
    apply(next ?? (direction === 1 ? MAX : MIN), 250);
  };

  const commitInput = () => {
    const value = Number(draft.trim());
    if (draft.trim() && Number.isFinite(value)) apply(value, 300);
    else setDraft(String(percent));
    setEditing(false);
    inputRef.current?.blur();
  };

  return (
    <div className='nodrag nopan nowheel pointer-events-auto absolute right-[20px] bottom-[24px] z-20 flex items-end gap-[16px]'>
      <input
        ref={inputRef}
        aria-label='맵 확대 비율'
        className='typo-c1 text-gray9 border-gray4 mb-[4px] h-[28px] w-[54px] rounded-[4px] border bg-white text-center outline-none'
        inputMode='numeric'
        value={`${draft}%`}
        onFocus={(event) => {
          setEditing(true);
          setDraft(String(percent));
          event.currentTarget.setSelectionRange(0, String(percent).length);
        }}
        onChange={(event) => setDraft(event.target.value.replace(/%/g, ''))}
        onBlur={() => {
          setEditing(false);
          setDraft(String(percent));
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commitInput();
          if (event.key === 'Escape') event.currentTarget.blur();
        }}
      />
      <div className='shadow-dropdown flex h-[228px] w-[38px] flex-col items-center gap-[6px] rounded-[30px] bg-white py-[11px]'>
        <button
          type='button'
          aria-label='맵 확대'
          className='size-[22px] cursor-pointer'
          onClick={() => step(1)}
        >
          <MapZoomInIcon />
        </button>
        <div
          ref={trackRef}
          role='slider'
          aria-label='맵 확대 비율 조절'
          aria-orientation='vertical'
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={percent}
          tabIndex={0}
          className='bg-gray3 relative h-[150px] w-[8px] cursor-pointer touch-none rounded-[100px] outline-none'
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromPointer(event.clientY);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              updateFromPointer(event.clientY);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
              event.preventDefault();
              step(1);
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
              event.preventDefault();
              step(-1);
            }
            if (event.key === 'Home') {
              event.preventDefault();
              apply(MIN, 250);
            }
            if (event.key === 'End') {
              event.preventDefault();
              apply(MAX, 250);
            }
          }}
        >
          <div
            className='gradient-sub2 absolute inset-x-0 bottom-0 rounded-[100px]'
            style={{ height: `${position}%` }}
          />
          {[1, 2, 3].map((stop) => (
            <span
              key={stop}
              aria-hidden
              className={`pointer-events-none absolute left-1/2 size-[6px] -translate-x-1/2 translate-y-1/2 rounded-full ${position >= (stop / 3) * 100 ? 'bg-white' : 'bg-gray5'}`}
              style={{ bottom: `${(stop / 3) * 100}%` }}
            />
          ))}
          <span
            aria-hidden
            className='border-gray6 pointer-events-none absolute left-1/2 h-[10px] w-[18px] -translate-x-1/2 translate-y-1/2 rounded-[12px] border-[1.5px] bg-white'
            style={{ bottom: `${position}%` }}
          />
        </div>
        <button
          type='button'
          aria-label='맵 축소'
          className='size-[22px] cursor-pointer'
          onClick={() => step(-1)}
        >
          <MapZoomOutIcon />
        </button>
      </div>
    </div>
  );
}
