export type ChatMessage = {
  role: 'ai' | 'user';
  content: string;
};

interface ChatMessageSectionProps {
  messages: ChatMessage[];
  onAIMessageClick?: () => void;
  onUserMessageClick?: () => void;
}

export function ChatMessageSection({
  messages,
  onAIMessageClick,
  onUserMessageClick,
}: ChatMessageSectionProps) {
  return (
    <div className='relative flex min-h-0 flex-1 flex-col'>
      {/* 위쪽 페이드 */}
      <div
        className='pointer-events-none absolute top-0 right-0 left-0 z-[5] h-[2.5rem] shrink-0'
        style={{
          background:
            'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
        }}
        aria-hidden
      />
      {/* 스크롤 영역 */}
      <div className='scrollbar-hide flex min-h-0 flex-1 flex-col gap-[3.75rem] overflow-y-auto'>
        <div className='flex flex-col gap-[3.75rem] pb-[10rem]'>
          {messages.map((msg, index) =>
            msg.role === 'ai' ? (
              <button
                key={`ai-${index}`}
                type='button'
                className='flex w-full cursor-pointer gap-[1.5rem] text-left'
                onClick={onAIMessageClick}
              >
                <div className='h-[3rem] w-[3rem] flex-shrink-0 bg-[#D9D9D9]' />
                <div className='font-regular whitespace-pre-wrap rounded-tl-[0.25rem] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2.25rem] py-[1.75rem] text-[1rem] text-[#1A1A1A] shadow-[0px_4px_8px_0px_#00000033]'>
                  {msg.content}
                </div>
              </button>
            ) : (
              <button
                key={`user-${index}`}
                type='button'
                className='flex w-full cursor-pointer justify-end text-left'
                onClick={onUserMessageClick}
              >
                <div className='font-regular mr-[0.5rem] max-w-[53.75rem] whitespace-pre-wrap rounded-tl-[2rem] rounded-tr-[0.25rem] rounded-br-[2rem] rounded-bl-[2rem] border border-none bg-[#F6F5FF] px-[2.25rem] py-[1.75rem] text-[1rem] text-[#1A1A1A] shadow-[0px_4px_8px_0px_#00000033]'>
                  {msg.content}
                </div>
              </button>
            ),
          )}
        </div>
      </div>
      {/* 아래쪽 페이드 */}
      <div
        className='pointer-events-none absolute right-0 bottom-0 left-0 z-[5] h-[2.5rem] shrink-0'
        style={{
          background:
            'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.4) 70%, transparent 100%)',
        }}
        aria-hidden
      />
    </div>
  );
}
