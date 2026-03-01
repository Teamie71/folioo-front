'use client';

import { useRef, useState } from 'react';
// import { useEffect } from 'react';
// import { createPortal } from 'react-dom';
import { FileUploaderIcon } from '@/components/icons/FileUploaderIcon';
import { OBTRedirectModal } from '@/components/OBT/OBTRedirectModal';

// const BUBBLE_GAP_PX = 10;

interface ChatFileUploaderProps {
  onFileSelect?: (files: File[]) => void;
}

export const ChatFileUploader = ({ onFileSelect }: ChatFileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const triggerRef = useRef<HTMLDivElement>(null);
  const [redirectModalOpen, setRedirectModalOpen] = useState(false);
  // hover 시 svg 표시 (주석 처리)
  // const [isHovered, setIsHovered] = useState(false);
  // const [bubbleStyle, setBubbleStyle] = useState<{
  //   top: number;
  //   left: number;
  // } | null>(null);

  // useEffect(() => {
  //   if (!isHovered || !triggerRef.current || typeof document === 'undefined')
  //     return;
  //   const el = triggerRef.current;
  //   const rect = el.getBoundingClientRect();
  //   setBubbleStyle({
  //     top: rect.top - BUBBLE_GAP_PX,
  //     left: rect.left + rect.width / 2,
  //   });
  // }, [isHovered]);

  const handleClick = () => {
    setRedirectModalOpen(true);
    // fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onFileSelect?.(selectedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // hover 시 svg 표시 (주석 처리)
  // const bubblePortal =
  //   isHovered &&
  //   bubbleStyle &&
  //   typeof document !== 'undefined' &&
  //   createPortal(
  //     <div
  //       className='fixed z-[9999] flex justify-center'
  //       style={{
  //         top: bubbleStyle.top,
  //         left: bubbleStyle.left,
  //         transform: 'translate(-50%, -100%)',
  //       }}
  //     >
  //       <img src='/FileHoveredBubble.svg' alt='' width={432} height={110} />
  //     </div>,
  //     document.body,
  //   );

  return (
    <>
      <div
        // ref={triggerRef}
        className='mr-[2rem] flex items-center justify-center'
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => {
        //   setIsHovered(false);
        //   setBubbleStyle(null);
        // }}
      >
        <button
          type='button'
          onClick={handleClick}
          className='cursor-pointer text-[#9EA4A9] transition-colors hover:text-[#000000]'
        >
          <FileUploaderIcon />
        </button>
        <input
          ref={fileInputRef}
          type='file'
          accept='.pdf,.png,.jpg,.jpeg'
          multiple
          className='hidden'
          onChange={handleFileChange}
        />
      </div>
      <OBTRedirectModal
        open={redirectModalOpen}
        onOpenChange={setRedirectModalOpen}
      />
      {/* {bubblePortal} */}
    </>
  );
};
