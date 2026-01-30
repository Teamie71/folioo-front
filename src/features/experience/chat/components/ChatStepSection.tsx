'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatStepBubble } from './ChatStepBubble';
import { ChatInput } from './ChatInput';

const STEP_INTERVAL_MS = 2000;
const FADE_DURATION_MS = 500;

interface ChatStepSectionProps {
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onSend?: () => void;
}

export const ChatStepSection = ({
  inputValue = '',
  onInputChange,
  onSend,
}: ChatStepSectionProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 4) {
          if (timerRef.current) clearInterval(timerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const gridCell =
    'h-[1.125rem] w-[1.125rem] border-[0.09375rem] border-[#74777D]';
  const gridCellGradient =
    'h-[1.125rem] w-[1.125rem] bg-gradient-to-br from-[#93B3F4] to-[#5060C5] border-transparent';

  return (
    <div className='relative z-30 flex min-h-[14rem] w-full flex-col'>
      {/* ChatBubble만 페이드 (0~3단계) */}
      <div className='relative min-h-[10rem] flex-1'>
        {/* 0단계 디자인 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity: currentStep === 0 ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents: currentStep === 0 ? 'auto' : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 네 단계 중 첫 번째 단계를 진행 중이에요!
            <br />각 단계가 완료될때마다 알려드릴게요.
          </ChatStepBubble>
        </div>

        {/* 1단계 디자인 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity: currentStep === 1 ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents: currentStep === 1 ? 'auto' : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 첫 단계가 완료되었어요!
            <br />네 단계를 모두 완료하면 포트폴리오 생성이 시작돼요.
          </ChatStepBubble>
        </div>

        {/* 2단계 디자인 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity: currentStep === 2 ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents: currentStep === 2 ? 'auto' : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 두 번째 단계가 완료되었어요!
            <br />두 단계만 더 완료하면 포트폴리오 생성이 시작돼요.
          </ChatStepBubble>
        </div>

        {/* 3단계 디자인 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity: currentStep === 3 ? 1 : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents: currentStep === 3 ? 'auto' : 'none',
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
      <div className='flex items-center gap-[1.25rem]'>
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
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
        />
      </div>
    </div>
  );
};
