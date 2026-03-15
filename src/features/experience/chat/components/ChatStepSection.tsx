'use client';

import { useState, useEffect } from 'react';
import { ChatStepBubble } from './ChatStepBubble';
import { ChatInput, type ContentPart, type FileItem } from './ChatInput';

const FADE_DURATION_MS = 500;
const TOOLTIP_DURATION_MS = 2000;

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
  /* 2·3·4단계(grid 1,2,3) 진입 시에만 해당 단계 툴팁 표시. 진입한 단계 번호 또는 null */
  showTooltipForStep?: number | null;
}

export const ChatStepSection = ({
  inputValue = '',
  onInputChange,
  onSend,
  disabled = false,
  currentStep = 0,
  showTooltipForStep = null,
}: ChatStepSectionProps) => {
  /* 그리드 호버 시 해당 단계 툴팁 표시 (0·1·2·3) */
  const [hoveringGridStep, setHoveringGridStep] = useState<number | null>(null);
  useEffect(() => {
    setHoveringGridStep((prev) => (prev === currentStep ? prev : null));
  }, [currentStep]);

  /* 진입 시 툴팁 2초 후 자동 숨김 */
  const [tooltipDismissed, setTooltipDismissed] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const showStep0ByEntry = currentStep === 0;
  const showStep1ByEntry = currentStep === 1 && showTooltipForStep === 1;
  const showStep2ByEntry = currentStep === 2 && showTooltipForStep === 2;
  const showStep3ByEntry = currentStep === 3 && showTooltipForStep === 3;

  useEffect(() => {
    if (currentStep !== 0) {
      setTooltipDismissed((prev) => ({ ...prev, 0: false }));
      return;
    }
    setTooltipDismissed((prev) => ({ ...prev, 0: false }));
    const t = setTimeout(() => setTooltipDismissed((prev) => ({ ...prev, 0: true })), TOOLTIP_DURATION_MS);
    return () => clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    if (!showStep1ByEntry) {
      setTooltipDismissed((prev) => ({ ...prev, 1: false }));
      return;
    }
    setTooltipDismissed((prev) => ({ ...prev, 1: false }));
    const t = setTimeout(() => setTooltipDismissed((prev) => ({ ...prev, 1: true })), TOOLTIP_DURATION_MS);
    return () => clearTimeout(t);
  }, [showStep1ByEntry]);

  useEffect(() => {
    if (!showStep2ByEntry) {
      setTooltipDismissed((prev) => ({ ...prev, 2: false }));
      return;
    }
    setTooltipDismissed((prev) => ({ ...prev, 2: false }));
    const t = setTimeout(() => setTooltipDismissed((prev) => ({ ...prev, 2: true })), TOOLTIP_DURATION_MS);
    return () => clearTimeout(t);
  }, [showStep2ByEntry]);

  useEffect(() => {
    if (!showStep3ByEntry) {
      setTooltipDismissed((prev) => ({ ...prev, 3: false }));
      return;
    }
    setTooltipDismissed((prev) => ({ ...prev, 3: false }));
    const t = setTimeout(() => setTooltipDismissed((prev) => ({ ...prev, 3: true })), TOOLTIP_DURATION_MS);
    return () => clearTimeout(t);
  }, [showStep3ByEntry]);

  const gridCell =
    'h-[1.125rem] w-[1.125rem] border-[0.09375rem] border-[#74777D]';
  const gridCellGradient =
    'h-[1.125rem] w-[1.125rem] bg-gradient-to-br from-[#93B3F4] to-[#5060C5] border-transparent';

  return (
    <div className='pointer-events-none relative z-30 flex min-h-[14rem] w-full flex-col'>
      {/* 툴팁: 매 단계 진입 시 2초만 표시, 그리드 호버 시에도 표시 */}
      <div className='pointer-events-none relative min-h-[10rem] flex-1'>
        {/* 0단계 툴팁: 진입 시 2초 또는 그리드 호버 시 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity:
              currentStep === 0 &&
              (!tooltipDismissed[0] || hoveringGridStep === 0)
                ? 1
                : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents:
              currentStep === 0 &&
              (!tooltipDismissed[0] || hoveringGridStep === 0)
                ? 'auto'
                : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 네 단계 중 첫 번째 단계를 진행 중이에요!
            <br />각 단계가 완료될때마다 알려드릴게요.
          </ChatStepBubble>
        </div>

        {/* 1단계 툴팁: 진입 시 2초 또는 그리드 호버 시 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity:
              currentStep === 1 &&
              ((showTooltipForStep === 1 && !tooltipDismissed[1]) ||
                hoveringGridStep === 1)
                ? 1
                : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents:
              currentStep === 1 &&
              ((showTooltipForStep === 1 && !tooltipDismissed[1]) ||
                hoveringGridStep === 1)
                ? 'auto'
                : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 첫 단계가 완료되었어요!
            <br />네 단계를 모두 완료하면 포트폴리오 생성이 시작돼요.
          </ChatStepBubble>
        </div>

        {/* 2단계 툴팁: 진입 시 2초 또는 그리드 호버 시 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity:
              currentStep === 2 &&
              ((showTooltipForStep === 2 && !tooltipDismissed[2]) ||
                hoveringGridStep === 2)
                ? 1
                : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents:
              currentStep === 2 &&
              ((showTooltipForStep === 2 && !tooltipDismissed[2]) ||
                hoveringGridStep === 2)
                ? 'auto'
                : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 두 번째 단계가 완료되었어요!
            <br />두 단계만 더 완료하면 포트폴리오 생성이 시작돼요.
          </ChatStepBubble>
        </div>

        {/* 3단계 툴팁: 진입 시 2초 또는 그리드 호버 시 */}
        <div
          className='absolute inset-x-0 top-0 flex flex-col transition-opacity'
          style={{
            opacity:
              currentStep === 3 &&
              ((showTooltipForStep === 3 && !tooltipDismissed[3]) ||
                hoveringGridStep === 3)
                ? 1
                : 0,
            transitionDuration: `${FADE_DURATION_MS}ms`,
            pointerEvents:
              currentStep === 3 &&
              ((showTooltipForStep === 3 && !tooltipDismissed[3]) ||
                hoveringGridStep === 3)
                ? 'auto'
                : 'none',
          }}
        >
          <ChatStepBubble>
            대화의 세 번째 단계가 완료되었어요!
            <br />
            마지막 단계만 완료하면 포트폴리오 생성이 시작돼요.
          </ChatStepBubble>
        </div>
      </div>

      {/* 그리드 + ChatInput */}
      <div className='pointer-events-auto flex w-[66rem] items-center gap-[1.25rem]'>
        <div className='relative h-[2.5rem] w-[2.5rem] flex-shrink-0'>
          {/* 0단계 그리드: 호버 시 툴팁 표시 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 0 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 0 ? 'auto' : 'none',
            }}
            onMouseEnter={() => setHoveringGridStep(0)}
            onMouseLeave={() => setHoveringGridStep(null)}
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
          {/* 1단계 그리드: 호버 시 툴팁 표시 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 1 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 1 ? 'auto' : 'none',
            }}
            onMouseEnter={() => setHoveringGridStep(1)}
            onMouseLeave={() => setHoveringGridStep(null)}
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
          {/* 2단계 그리드: 호버 시 툴팁 표시 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 2 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 2 ? 'auto' : 'none',
            }}
            onMouseEnter={() => setHoveringGridStep(2)}
            onMouseLeave={() => setHoveringGridStep(null)}
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
          {/* 3단계 그리드: 호버 시 툴팁 표시 */}
          <div
            className='absolute inset-0 flex flex-col gap-[0.25rem] transition-opacity'
            style={{
              opacity: currentStep === 3 ? 1 : 0,
              transitionDuration: `${FADE_DURATION_MS}ms`,
              pointerEvents: currentStep === 3 ? 'auto' : 'none',
            }}
            onMouseEnter={() => setHoveringGridStep(3)}
            onMouseLeave={() => setHoveringGridStep(null)}
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
