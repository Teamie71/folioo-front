import { LogCard } from '@/features/log/components/LogCard';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { ChevronColorLeftIcon } from '@/components/icons/ChevronColorLeftIcon';

export const ChatAnalogs = () => {
  return (
    <div className='flex flex-col gap-[1.75rem]'>
      <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>
        대화 내용을 바탕으로 유사도가 높은 인사이트 로그를 읽었어요.
      </p>

      {/* 인사이트 로그 카드 */}
      <div className='flex w-full items-center gap-[1.25rem]'>
        <ChevronColorLeftIcon />
        <div className='w-full min-w-0 flex-1'>
          <LogCard
            className='w-full'
            title='인사이트 로그 제목'
            date='2026-02-15'
            content='인사이트 로그 내용'
            activityName='인사이트 로그 활동 이름'
            category='인사이트 로그 카테고리'
          />
        </div>
        <div className='rotate-180'>
          <ChevronColorLeftIcon />
        </div>
      </div>

      <p className='text-[1rem] leading-[160%] text-[#1A1A1A]'>
        질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문질문
      </p>
    </div>
  );
};
