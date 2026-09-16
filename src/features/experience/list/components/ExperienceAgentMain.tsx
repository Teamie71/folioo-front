'use client';

import { useRef, useState } from 'react';
import { AgentIcon } from '@/components/icons/agent/AgentIcon';
import { AttachIcon } from '@/components/icons/AttachIcon';
import { SendArrowIcon } from '@/components/icons/SendArrowIcon';

const SCENARIOS = [
  {
    title: '채팅에 나의 경험 입력하기',
    file: false,
    prompts: [
      '고객 문의 200건을 살펴보니 비슷한 질문이 많아서 안내 문구를 바꿨고, 반복 문의가 30% 줄었어.',
      '팀원마다 자료 정리 방식이 달라서 보기 힘들었어. 그래서 공용 템플릿을 만들었더니, 쓰기도 편하고 보기도 편했어.',
    ],
  },
  {
    title: '파일로 나의 경험 업로드하기',
    file: true,
    prompts: [
      '이 자기소개서에서 사용한 소재를 경험으로 정리해줘.',
      '이 회의록을 바탕으로 문제 해결 경험을 정리해줘.',
    ],
  },
] as const;

type Props = {
  input: string;
  onInputChange: (value: string) => void;
  attachment: File | null;
  onAttachmentChange: (file: File | null) => void;
};

export function ExperienceAgentMain({
  input,
  onInputChange,
  attachment,
  onAttachmentChange,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [notice, setNotice] = useState('');

  return (
    <div
      className='min-h-0 flex-1 overflow-y-auto px-[20px] pb-[32px]'
      data-agent-main
    >
      <div className='flex flex-col items-center pt-[262px]'>
        <AgentIcon className='size-[48px] shrink-0' />
        <p className='text-gray9 mt-[20px] text-center text-[18px] leading-[130%] font-semibold tracking-normal'>
          편하게 활동 내용을 알려주시면,
          <br />
          활용 가능한 경험으로 정리할게요.
        </p>
      </div>

      <div className='mt-[100px]' data-agent-composer>
        {attachment && (
          <div className='border-gray3 mb-[8px] flex items-center gap-[8px] rounded-[12px] border bg-white p-[10px] text-[14px]'>
            <span className='min-w-0 flex-1 truncate'>{attachment.name}</span>
            <button
              type='button'
              onClick={() => onAttachmentChange(null)}
              aria-label='첨부 파일 삭제'
              className='text-gray6 shrink-0'
            >
              삭제
            </button>
          </div>
        )}
        <div className='relative flex min-h-[48px] w-full items-center rounded-[24px] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]'>
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 rounded-[24px] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.25)]'
          />
          <textarea
            ref={textarea}
            rows={1}
            value={input}
            aria-label='에이전트 채팅 입력'
            placeholder='내용을 입력하거나 파일을 첨부해 주세요.'
            onChange={(event) => {
              const value = event.target.value;
              if (value.length > 500) {
                setNotice('최대 500자까지 입력할 수 있어요.');
                return;
              }
              setNotice('');
              onInputChange(value);
            }}
            onKeyDown={(event) => {
              // 전송 API 연결 전에는 Enter로도 목업 대화를 생성하지 않는다.
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              )
                event.preventDefault();
            }}
            className='text-gray9 placeholder:text-gray5 relative z-10 [field-sizing:content] min-h-[48px] min-w-0 flex-1 resize-none bg-transparent py-[13px] pr-[8px] pl-[16px] text-[14px] leading-[22px] outline-none'
          />
          <input
            ref={fileInput}
            type='file'
            className='hidden'
            accept='.pdf,.png,.jpg,.jpeg,.docx,.pptx,.txt'
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file) return;
              if (!/\.(pdf|png|jpe?g|docx|pptx|txt)$/i.test(file.name)) {
                setNotice(
                  'PDF, PNG, JPG/JPEG, DOCX, PPTX, TXT 파일만 첨부할 수 있어요.',
                );
                return;
              }
              if (file.size > 5 * 1024 * 1024) {
                setNotice('파일은 5MB 이하로 첨부해 주세요.');
                return;
              }
              setNotice('');
              onAttachmentChange(file);
            }}
          />
          <button
            type='button'
            onClick={() => fileInput.current?.click()}
            aria-label='파일 첨부'
            className='relative z-10 mr-[8px] flex size-[28px] shrink-0 items-center justify-center'
          >
            <AttachIcon className='h-[23px] w-[20px]' />
          </button>
          <button
            type='button'
            disabled
            aria-label='전송'
            title='채팅 전송 기능은 준비 중이에요.'
            className='bg-main relative z-10 mr-[12px] flex size-[32px] shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40'
          >
            <SendArrowIcon className='h-[17px] w-[14px]' />
          </button>
        </div>
      </div>

      <div className='mt-[20px] flex flex-col gap-[8px]'>
        {SCENARIOS.map((scenario) => (
          <section key={scenario.title} aria-label={scenario.title}>
            <h3 className='text-main flex items-center gap-[6px] text-[14px] leading-[24px] font-normal'>
              <span
                aria-hidden
                className='size-[9px] shrink-0 rounded-full bg-gradient-to-b from-[#93B3F4]/75 to-[#5060C5]/75'
              />
              {scenario.title}
            </h3>
            <div className='border-gray4 ml-[4px] flex flex-col gap-[8px] border-l pl-[7px]'>
              {scenario.prompts.map((prompt, index) => (
                <button
                  key={prompt}
                  type='button'
                  onClick={() => {
                    onInputChange(prompt);
                    setNotice('');
                    textarea.current?.focus({ preventScroll: true });
                    if (scenario.file) fileInput.current?.click();
                  }}
                  className={`border-gray3 text-gray7 rounded-[12px] border p-[10px] text-left text-[14px] leading-[150%] font-normal tracking-normal ${!scenario.file && index === 0 ? 'bg-white' : 'bg-gray2'} focus-visible:outline-main focus-visible:outline-2`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      {notice && (
        <p role='status' className='text-gray7 mt-[8px] text-[14px]'>
          {notice}
        </p>
      )}
    </div>
  );
}
