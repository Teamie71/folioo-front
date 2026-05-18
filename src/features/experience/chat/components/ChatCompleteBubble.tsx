import { CommonButton } from '@/components/CommonButton';
import Image from 'next/image';

interface ChatCompleteBubbleProps {
  onComplete?: () => void;
}

export const ChatCompleteBubble = ({ onComplete }: ChatCompleteBubbleProps) => {
  return (
    <div className='relative inline-block w-[470px] translate-x-[-1.9375rem] translate-y-[-1rem]'>
      <Image
        src='/ChatCompleteBubble.svg'
        alt='ChatCompleteBubble'
        width={430}
        height={160}
        className='block h-auto w-full'
      />
      <div className='absolute inset-x-0 top-[2rem] flex flex-col'>
        <p className='justify-center text-center text-[1rem] leading-[150%] text-[#1A1A1A]'>
          대화의 모든 대화가 완료되었어요!
          <br />더 풍부한 경험 정리를 위해 대화를 더 진행할 수 있어요.
        </p>
      </div>
      <CommonButton
        variantType='Outline'
        px='1.5rem'
        py='0.375rem'
        className='absolute bottom-[4.25rem] left-1/2 -translate-x-1/2 rounded-[0.375rem] hover:bg-[#E8EBFF]'
        onClick={onComplete}
      >
        지금 포트폴리오 생성하기 →
      </CommonButton>
    </div>
  );
};

export default ChatCompleteBubble;
