import { CommonButton } from '@/components/CommonButton';

interface ChatErrorReloadMessageProps {
  onRetry?: () => void;
  message?: React.ReactNode;
}

export const ChatErrorReloadMessage = ({
  onRetry,
  message = (
    <>
      앗, 답변 생성 중 오류가 발생했어요.
      <br />
      아래 버튼을 눌러 다시 시도해주세요.
    </>
  ),
}: ChatErrorReloadMessageProps) => {
  return (
    <div className='flex flex-col gap-[1rem]'>
      <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>{message}</p>

      <CommonButton
        variantType='Outline'
        px='2.25rem'
        py='0.5rem'
        style={{ width: '10rem', height: '2.5rem' }}
        onClick={onRetry}
        className='z-[999] cursor-pointer'
      >
        다시 시도하기
      </CommonButton>
    </div>
  );
};
