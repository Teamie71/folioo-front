'use client';

import { useRef } from 'react';
import { FileUploaderIcon } from '@/components/icons/FileUploaderIcon';

interface ChatFileUploaderProps {
  onFileSelect?: (files: File[]) => void;
}

export const ChatFileUploader = ({ onFileSelect }: ChatFileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onFileSelect?.(selectedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='mr-[2rem] flex items-center justify-center'>
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
  );
};
