'use client';

interface CorrectionDropOverlayProps {
  active: boolean;
  onDrop: (file: File) => void;
  onClose: () => void;
}

export function CorrectionDropOverlay({
  active,
  onDrop,
  onClose,
}: CorrectionDropOverlayProps) {
  if (!active) return null;

  return (
    <div
      className='fixed inset-0 z-40'
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDragLeave={onClose}
      onDrop={(e) => {
        e.preventDefault();
        onClose();
        const file = e.dataTransfer.files?.[0];
        if (file) onDrop(file);
      }}
    />
  );
}
