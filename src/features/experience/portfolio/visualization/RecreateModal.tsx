import { useState } from 'react';
import { CommonModal } from '@/components/CommonModal';
import TextField from '@/components/TextField';
import { CommonButton } from '@/components/CommonButton';

interface RecreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remainingCount: number;
}

export const RecreateModal = ({
  open,
  onOpenChange,
  remainingCount,
}: RecreateModalProps) => {
  const [text, setText] = useState('');
  const maxChars = 250;

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      className='flex h-[18.375rem] w-[39.375rem] flex-col items-start gap-[1.25rem] px-[2.5rem] py-[1.75rem] text-left'
      title={<span className='text-[1.125rem] font-bold'>슬라이드 재생성</span>}
      closeButtonOnly
    >
      <div className='flex w-full flex-col gap-[0.5rem]'>
        <span className='text-gray8 font-regular text-[1rem]'>
          수정 요청 사항
        </span>
        <div className='relative w-full'>
          <TextField
            placeholder='예: 동그라미 크기를 줄여줘.'
            maxLength={maxChars}
            value={text}
            onChange={(e) => setText(e.target.value)}
            height='6.375rem'
            className='rounded-[0.75rem]'
          />
          <div className='pointer-events-none absolute right-[0.5rem] bottom-[0.75rem] flex items-end justify-end'>
            <span className='text-gray6 text-[0.875rem]'>
              {text.length} / {maxChars}
            </span>
          </div>
        </div>
      </div>

      <div className='flex w-full items-center justify-between'>
        <span className='text-gray8 font-regular -translate-y-[1rem] text-[0.875rem]'>
          남은 재생성 횟수: {remainingCount}/10
        </span>
        <CommonButton
          className='-translate-y-[0.25rem]'
          variantType='Execute'
          px='2.5rem'
          py='0.5rem'
          onClick={() => {
            // Regeneration logic would go here
            onOpenChange(false);
          }}
          disabled={text.length === 0}
        >
          재생성하기
        </CommonButton>
      </div>
    </CommonModal>
  );
};
