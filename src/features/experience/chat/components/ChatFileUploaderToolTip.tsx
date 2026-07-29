import React from 'react';

interface ChatFileUploaderToolTipProps {
  currentTotalSize?: number;
}

export const ChatFileUploaderToolTip = ({
  currentTotalSize = 0,
}: ChatFileUploaderToolTipProps) => {
  const formattedSize = (currentTotalSize / (1024 * 1024)).toFixed(1);

  return (
    <div
      className='relative flex flex-col items-center'
      style={{
        width: '467px',
        height: '146px',
        backgroundImage: "url('/FileUploaderBubble.svg')",
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='flex flex-col items-center justify-center pt-[2rem] text-center'>
        <p className='typo-b2 text-gray9'>
          PDF, PNG, JPG 형식으로 총 10MB까지 첨부 가능해요.
          <br />({formattedSize} / 10.0 MB)
        </p>
      </div>
    </div>
  );
};
