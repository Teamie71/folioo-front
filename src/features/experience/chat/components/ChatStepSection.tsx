'use client';

import { ChatStepBubble } from './ChatStepBubble';
import { ChatInput, type ContentPart, type FileItem } from './ChatInput';

const FADE_DURATION_MS = 500;

interface ChatStepSectionProps {
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onSend?: (payload: {
    content: string;
    contentParts?: ContentPart[];
    files: FileItem[];
  }) => void;
  /* 스트리밍 중일 때 true면 전송 비활성화 */
  disabled?: boolean;
  /* 현재 단계 (0~4) */
  currentStep?: number;
  /* true일 때만 단계 툴팁 표시 (스트림으로 도달 시 true, 새로고침 후 복원 시 false) */
  showStepTooltip?: boolean;
}

export const ChatStepSection = ({
  inputValue = '',
  onInputChange,
  onSend,
  disabled = false,
  currentStep = 0,
  showStepTooltip = false,
}: ChatStepSectionProps) => {
  const gridCell =
    'h-[1.125rem] w-[1.125rem] border-[0.09375rem] border-[#74777D]';
  const gridCellGradient =
    'h-[1.125rem] w-[1.125rem] bg-gradient-to-br from-[#93B3F4] to-[#5060C5] border-transparent';

  return (
    <div className='relative z-30 flex min-h-[14rem] w-full flex-col'>
      {/* 툴팁: showStepTooltip일 때만 표시 (새로고침 시에는 그리드만 유지) */}
      <div className='relative min-h-[10rem] flex-1'>
        {/* 0단계 툴팁 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity: currentStep === 0 && showStepTooltip ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents: currentStep === 0 && showStepTooltip ? 'auto' : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 네 단계 중 첫 번째 단계를 진행 중이에요!
            <br />각 단계가 완료될때마다 알려드릴게요.
          </ChatStepBubble>
        </div>

        {/* 1단계 툴팁 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity: currentStep === 1 && showStepTooltip ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents: currentStep === 1 && showStepTooltip ? 'auto' : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 첫 단계가 완료되었어요!
            <br />네 단계를 모두 완료하면 포트폴리오 생성이 시작돼요.
          </ChatStepBubble>
        </div>

        {/* 2단계 툴팁 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity: currentStep === 2 && showStepTooltip ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents: currentStep === 2 && showStepTooltip ? 'auto' : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 두 번째 단계가 완료되었어요!
            <br />두 단계만 더 완료하면 포트폴리오 생성이 시작돼요.
          </ChatStepBubble>
        </div>

        {/* 3단계 툴팁 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity: currentStep === 3 && showStepTooltip ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents: currentStep === 3 && showStepTooltip ? 'auto' : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 세 번째 단계가 완료되었어요!
            <br />
            마지막 단계만 완료하면 포트폴리오 생성이 시작돼요.
          </ChatStepBubble>
        </div>
      </div>

      {/* 그리드 + ChatInput: 그리드만 페이드, ChatInput은 항상 유지 */}
      <div className='flex w-[66rem] items-center gap-[1.25rem]'>
        <div className='relative h-[2.5rem] w-[2.5rem] flex-shrink-0'>
          {/* 0단계 그리드 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 0 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 0 ? 'auto' : 'none',
            }}
          >
            <div className='flex gap-[0.25rem]'>
              <p
                className={`${gridCell} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
              <p
                className={`${gridCell} rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem]`}
              />
            </div>
            <div className='flex gap-[0.25rem]'>
              <p
                className={`${gridCell} rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem]`}
              />
              <p
                className={`${gridCell} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
            </div>
          </div>
          {/* 1단계 그리드 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 1 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 1 ? 'auto' : 'none',
            }}
          >
            <div className='flex gap-[0.25rem]'>
              <p
                className={`${gridCellGradient} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
              <p
                className={`${gridCell} rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem]`}
              />
            </div>
            <div className='flex gap-[0.25rem]'>
              <p
                className={`${gridCell} rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem]`}
              />
              <p
                className={`${gridCell} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
            </div>
          </div>
          {/* 2단계 그리드 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 2 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 2 ? 'auto' : 'none',
            }}
          >
            <div className='flex gap-[0.25rem]'>
              <p
                className={`${gridCellGradient} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
              <p
                className={`${gridCellGradient} rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem]`}
              />
            </div>
            <div className='flex gap-[0.25rem]'>
              <p
                className={`${gridCell} rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem]`}
              />
              <p
                className={`${gridCell} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
            </div>
          </div>
          {/* 3단계 그리드 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 3 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 3 ? 'auto' : 'none',
            }}
          >
            <div className='flex gap-[0.25rem]'>
              <p
                className={`${gridCellGradient} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
              <p className='h-[1.125rem] w-[1.125rem] rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem] border-transparent bg-gradient-to-bl from-[#93B3F4] to-[#5060C5]' />
            </div>
            <div className='flex gap-[0.25rem]'>
              <p className='h-[1.125rem] w-[1.125rem] rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem] border-transparent bg-gradient-to-tr from-[#93B3F4] to-[#5060C5]' />
              <p
                className={`${gridCell} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
            </div>
          </div>
          {/* 4단계 그리드 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 4 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 4 ? 'auto' : 'none',
            }}
          >
            <div className='flex gap-[0.25rem]'>
              <p
                className={`${gridCellGradient} rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem]`}
              />
              <p className='h-[1.125rem] w-[1.125rem] rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem] border-transparent bg-gradient-to-bl from-[#93B3F4] to-[#5060C5]' />
            </div>
            <div className='flex gap-[0.25rem]'>
              <p className='h-[1.125rem] w-[1.125rem] rounded-tl-[0.5rem] rounded-tr-[0.125rem] rounded-br-[0.5rem] rounded-bl-[0.125rem] border-transparent bg-gradient-to-tr from-[#93B3F4] to-[#5060C5]' />
              <p className='h-[1.125rem] w-[1.125rem] rounded-tl-[0.125rem] rounded-tr-[0.5rem] rounded-br-[0.125rem] rounded-bl-[0.5rem] border-transparent bg-gradient-to-tl from-[#93B3F4] to-[#5060C5]' />
            </div>
          </div>
        </div>
        <div className='min-w-0 flex-1'>
          <ChatInput
            value={inputValue}
            onChange={onInputChange}
            onSend={onSend}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
