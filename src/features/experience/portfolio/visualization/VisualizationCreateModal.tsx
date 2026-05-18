import { useState, useEffect } from 'react';
import { CommonModal } from '@/components/CommonModal';
import { CommonButton } from '@/components/CommonButton';
import { cn } from '@/utils/utils';

interface VisualizationCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const VisualizationCreateModal = ({
  open,
  onOpenChange,
  onConfirm,
}: VisualizationCreateModalProps) => {
  const [selectedStyle, setSelectedStyle] = useState<number | null>(1);

  useEffect(() => {
    if (open) {
      setSelectedStyle(1);
    }
  }, [open]);

  const styles = [
    { id: 1, name: '스타일명1' },
    { id: 2, name: '스타일명2' },
    { id: 3, name: '스타일명3' },
    { id: 4, name: '스타일명4' },
  ];

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      className='flex h-[26.875rem] w-[39.375rem] flex-col items-start gap-[1.25rem] px-[2.5rem] pt-[2rem] pb-[1.75rem] text-left'
      title={
        <span className='text-[1.125rem] leading-[130%s] font-bold'>
          이 텍스트 포트폴리오를 시각화 하시겠습니까?
        </span>
      }
      closeButtonOnly
    >
      <div className='flex w-full flex-col gap-[0.75rem]'>
        <span className='text-gray8 font-regular text-[1rem]'>
          색상 스타일 선택
        </span>
        <div className='grid grid-cols-2 gap-[1rem]'>
          {styles.map((style) => (
            <div
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={cn(
                'flex h-[6.25rem] cursor-pointer flex-col justify-between rounded-[0.75rem] p-[1.25rem] transition-all ring-inset',
                selectedStyle === style.id
                  ? 'bg-sub1 ring-[0.125rem] ring-main'
                  : 'bg-white hover:bg-gray2 ring-[0.09375rem] ring-gray6 hover:ring-gray',
              )}
            >
              <span className='text-gray9 font-regular text-[1rem] leading-[90%]'>
                {style.name}
              </span>
              <div className='flex w-full justify-end'>
                <div className='flex -space-x-[0.25rem]'>
                  <div className='border-gray5 z-10 h-[2.5rem] w-[2.5rem] rounded-full border bg-white' />
                  <div className='border-gray5 z-20 h-[2.5rem] w-[2.5rem] rounded-full border bg-[#E2E4E7]' />
                  <div className='border-gray5 z-30 h-[2.5rem] w-[2.5rem] rounded-full border bg-[#8C939A]' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-[0.5rem] flex w-full justify-end'>
        <CommonButton
          variantType='Execute'
          px='2.5rem'
          py='0.5rem'
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
          disabled={selectedStyle === null}
        >
          시각화하기
        </CommonButton>
      </div>
    </CommonModal>
  );
};
