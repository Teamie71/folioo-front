import { CommonButton } from '@/components/CommonButton';
import Image from 'next/image';

interface ChatCompleteBubbleProps {
  children: React.ReactNode;
}

export const ChatCompleteBubble = () => {
  return (
    <div className='relative inline-block justify-center'>
      <Image
        src='/ChatCompleteBubble.svg'
        alt='ChatCompleteBubble'
        width={430}
        height={160}
        className='block h-auto w-full'
      />
      <div className='absolute inset-x-0 top-[2rem] flex flex-col gap-[0.75rem]'>
        <p className='justify-center text-center text-[1rem] leading-[150%] text-[#1A1A1A]'>
          대화의 모든 대화가 완료되었어요!
          <br />더 풍부한 경험 정리를 위해 대화를 더 진행할 수 있어요.
        </p>
      </div>
      <CommonButton
        variantType='Outline'
        px='1.5rem'
        py='0.375rem'
        className='absolute bottom-[4rem] translate-x-1/2 rounded-[0.375rem] hover:bg-[#E8EBFF]'
      >
        지금 포트폴리오 생성하기 →
      </CommonButton>
    </div>
  );
};

export default ChatCompleteBubble;
