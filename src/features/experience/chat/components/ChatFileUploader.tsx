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
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    const validFiles = selectedFiles.filter((file) =>
      allowedTypes.includes(file.type),
    );
    if (validFiles.length > 0) {
      onFileSelect?.(validFiles);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='mr-[2rem] flex items-center justify-center'>
      <button type='button' onClick={handleClick} className='cursor-pointer'>
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
