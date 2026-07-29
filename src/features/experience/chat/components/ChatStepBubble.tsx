import Image from 'next/image';

interface ChatBubbleProps {
  /* 말풍선 안에 표시할 문구 */
  children: React.ReactNode;
}

export const ChatStepBubble = ({ children }: ChatBubbleProps) => {
  return (
    <div className='relative inline-block w-[430px] translate-x-[-1.65rem] translate-y-[3rem]'>
      <Image
        src='/ChatBubble.svg'
        alt='chat-bubble'
        width={430}
        height={110}
        className='block h-auto w-full'
      />
      <div className='absolute inset-x-0 top-0 flex justify-center px-[2rem] pt-[1.75rem] text-center text-[1rem] leading-[150%] text-[#1A1A1A]'>
        {children}
      </div>
    </div>
  );
};
