'use client';

import { KakaoLogo } from '@/components/icons/KakaoLogo';
import { CommonModal } from '@/components/CommonModal';

type KakaoMoveModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountConnectionRequired?: boolean;
  onPrimaryClick?: () => void;
  pending?: boolean;
  error?: string;
};

export function KakaoMoveModal({
  open,
  onOpenChange,
  accountConnectionRequired = false,
  onPrimaryClick,
  pending = false,
  error,
}: KakaoMoveModalProps) {
  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      closeButtonOnly
      className='w-[482px] gap-0 rounded-[28px] bg-white px-[28px] py-[60px] sm:rounded-[28px] [&>button:last-child]:top-[20px] [&>button:last-child]:right-[20px] [&>button:last-child]:opacity-100'
      title={
        <span className='text-gray9 text-h5 block font-bold tracking-normal break-keep'>
          카카오톡에서 더 편하게 경험을 정리해 보세요.
        </span>
      }
      description={
        <span className='text-gray9 text-body2 mt-[16px] block font-normal tracking-normal break-keep'>
          {accountConnectionRequired
            ? '카카오 계정을 연결해서 Folioo 채널로 경험 내용을 보내주시면,'
            : 'Folioo 채널로 경험 내용을 보내주시면,'}
          <br className='hidden sm:block' />
          {' AI 에이전트가 분석하여 정리해 드려요.'}
        </span>
      }
    >
      <div className='flex w-full flex-col items-center text-center'>
        <button
          type='button'
          onClick={onPrimaryClick}
          disabled={!onPrimaryClick || pending}
          className='mt-[20px] flex h-[40px] w-[304px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] bg-[#FEE500] px-[16px] text-[16px] leading-[20px] font-semibold text-black/85 disabled:opacity-100'
        >
          <KakaoLogo />
          {pending ? '연결 확인 중...' : '카카오톡에서 정리하기'}
        </button>
        {error && (
          <p role='alert' className='mt-[12px] text-[14px] text-red-600'>
            {error}
          </p>
        )}
        <button
          type='button'
          onClick={() => onOpenChange(false)}
          className='text-gray6 mt-[20px] cursor-pointer text-[16px] leading-[24px] underline underline-offset-[3px]'
        >
          나중에 하기
        </button>
      </div>
    </CommonModal>
  );
}
