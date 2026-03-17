'use client';

import { CorrectionDropOverlay } from './CorrectionDropOverlay';

interface CorrectionLayoutProps {
  layoutKey?: string;
  layoutClassName: string;
  onDragEnter?: (e: React.DragEvent) => void;
  pdfDropOverlay: {
    active: boolean;
    onDrop: (file: File) => void;
    onClose: () => void;
  };
  header: React.ReactNode;
  progressOrDivider: React.ReactNode;
  children: React.ReactNode;
}

export function CorrectionLayout({
  layoutKey,
  layoutClassName,
  onDragEnter,
  pdfDropOverlay,
  header,
  progressOrDivider,
  children,
}: CorrectionLayoutProps) {
  return (
    <div
      key={layoutKey}
      className={layoutClassName}
      onDragEnter={onDragEnter}
    >
      <CorrectionDropOverlay
        active={pdfDropOverlay.active}
        onDrop={pdfDropOverlay.onDrop}
        onClose={pdfDropOverlay.onClose}
      />
      <div className='flex flex-col gap-[0.75rem]'>
        {header}
        {progressOrDivider}
      </div>
      {children}
    </div>
  );
}
