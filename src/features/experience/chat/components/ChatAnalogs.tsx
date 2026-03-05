import { LogCard } from '@/features/log/components/LogCard';
import { ChevronColorLeftIcon } from '@/components/icons/ChevronColorLeftIcon';
import type { ChatAttachedLog } from './ChatMessageSection';

interface ChatAnalogsProps {
  /** 연관 인사이트 로그 목록 (자동 검색된 결과) */
  logs?: ChatAttachedLog[];
  /** 로그 카드 아래에 표시할 AI 질문/메시지 */
  questionText?: string;
}

export const ChatAnalogs = ({ logs = [], questionText }: ChatAnalogsProps) => {
  const hasLogs = logs.length > 0;

  return (
    <div className='flex flex-col gap-[1.75rem]'>
      <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>
        대화 내용을 바탕으로 유사도가 높은 인사이트 로그를 읽었어요.
      </p>

      {hasLogs && (
        <div className='flex w-full items-center gap-[1.25rem]'>
          <ChevronColorLeftIcon />
          <div className='w-full min-w-0 flex-1 space-y-[1rem]'>
            {logs.map((log) => (
              <LogCard
                key={log.id}
                title={log.title}
                date={log.date}
                content={log.content}
                activityName={log.activityName}
                category={log.category}
              />
            ))}
          </div>
          <div className='rotate-180'>
            <ChevronColorLeftIcon />
          </div>
        </div>
      )}

      {questionText && (
        <p className='whitespace-pre-wrap text-[1rem] leading-[160%] text-[#1A1A1A]'>
          {questionText}
        </p>
      )}
    </div>
  );
};
