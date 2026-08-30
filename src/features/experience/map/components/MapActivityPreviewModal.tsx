'use client';

import { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/utils';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { MapPreviewArrowIcon } from '@/components/icons/MapPreviewArrowIcon';
import { useActivityPreview } from '@/features/experience/map/hooks/useActivityPreview';
import { getOrderedExperienceIds } from '@/features/experience/map/model/mapOrder';
import { MapActivityPreviewContent } from '@/features/experience/map/components/MapActivityPreviewContent';

const MODAL_WIDTH = 1068;
const MODAL_HEIGHT = 700;
/** 스크롤바가 모달 우측 가장자리에서 이만큼 떨어져 보이도록 예약해 두는 여백 */
const SCROLLBAR_INSET = 18;

type Props = {
  /** 모달이 닫힐 때, 화살표로 마지막까지 보고 있던 활동 id를 알려준다. */
  onClose: (lastExperienceId: string) => void;
};

/**
 * 활동 미리보기 모달 (6-1 / 6-2).
 *
 * 화면설계서는 "모달"이라 부르지만, 사용자가 좌우 화살표만으로 활동을
 * 빠르게 넘겨보길 원해서(인스타그램 검색 결과 넘기듯) 대상 활동 id를
 * URL에 싣는다 — 딥링크 가능, 뒤로가기로 어지럽히지 않도록 replaceState만 쓴다.
 *
 * 편집 영역 밖(사이드바 · 툴바 · 에이전트 탭)은 모달과 무관하게 계속 동작해야
 * 하므로 document.body로 포털하지 않고, 맵 캔버스 컨테이너 내부에 그대로
 * 그려서 딤 처리 범위를 그 컨테이너로 제한한다.
 */
export function MapActivityPreviewModal({ onClose }: Props) {
  const { previewId, open, close } = useActivityPreview();
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);

  const orderedIds = useMemo(
    () => getOrderedExperienceIds(groups, experiences),
    [groups, experiences],
  );

  const currentIndex = previewId ? orderedIds.indexOf(previewId) : -1;
  const experience = previewId
    ? experiences.find((e) => e.id === previewId)
    : undefined;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < orderedIds.length - 1;

  const goPrev = () => {
    if (hasPrev) open(orderedIds[currentIndex - 1]);
  };
  const goNext = () => {
    if (hasNext) open(orderedIds[currentIndex + 1]);
  };
  const handleClose = () => {
    if (experience) onClose(experience.id);
    close();
  };

  useEffect(() => {
    if (!previewId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
      else if (event.key === 'ArrowLeft') goPrev();
      else if (event.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewId, currentIndex, orderedIds]);

  if (!previewId || !experience) return null;

  return (
    <div
      className='absolute inset-0 z-20 flex items-center justify-center bg-black/40'
      onClick={handleClose}
    >
      <div
        className='relative'
        style={{ width: MODAL_WIDTH, height: MODAL_HEIGHT }}
      >
        <button
          type='button'
          aria-label='이전 활동'
          disabled={!hasPrev}
          className={cn(
            'absolute top-1/2 right-[calc(100%+12px)] -translate-y-1/2 cursor-pointer [&>svg]:size-[48px]',
            !hasPrev && 'pointer-events-none opacity-0',
          )}
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
        >
          <span className='inline-flex scale-x-[-1]'>
            <MapPreviewArrowIcon />
          </span>
        </button>

        <div
          className='shadow-modal relative flex size-full flex-col overflow-hidden rounded-[16px] bg-white'
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type='button'
            aria-label='닫기'
            className='absolute top-[16px] right-[16px] flex size-[24px] shrink-0 cursor-pointer items-center justify-center'
            onClick={handleClose}
          >
            <X className='text-gray6 size-[20px]' />
          </button>

          <div className='shrink-0 px-[32px] pt-[32px]'>
            <h2 className='typo-b2-sb text-gray9 truncate'>
              {experience.name}
            </h2>
          </div>

          {/*
            스크롤바를 모달 우측 가장자리에서 18px 안쪽에 두기 위해,
            바깥쪽에 오른쪽 여백을 예약해 두고 그 안에서 실제 스크롤 컨테이너가 찬다
            (padding으로는 스크롤바 위치 자체를 옮길 수 없어 래퍼로 폭을 줄인다).
          */}
          <div
            className='min-h-0 flex-1'
            style={{ paddingRight: SCROLLBAR_INSET }}
          >
            <div className='map-preview-scroll h-full overflow-y-auto px-[32px] pt-[16px] pb-[32px]'>
              <MapActivityPreviewContent blocks={experience.blocks} />
            </div>
          </div>
        </div>

        <button
          type='button'
          aria-label='다음 활동'
          disabled={!hasNext}
          className={cn(
            'absolute top-1/2 left-[calc(100%+12px)] -translate-y-1/2 cursor-pointer [&>svg]:size-[48px]',
            !hasNext && 'pointer-events-none opacity-0',
          )}
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
        >
          <MapPreviewArrowIcon />
        </button>
      </div>
    </div>
  );
}
