import { cn } from '@/utils/utils';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import EtcIcon from '@/components/icons/EtcIcon';

interface MobileLogCardProps {
  title: string;
  date: string;
  content: string;
  activityName: string;
  category: string;
  onClick?: () => void;
  className?: string;
}

export function MobileLogCard({
  title,
  date,
  content,
  activityName,
  category,
  onClick,
  className,
}: MobileLogCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '대인관계':
        return <InterpersonIcon />;
      case '문제해결':
        return <ProblemSolveIcon />;
      case '학습':
        return <LearningIcon />;
      case '레퍼런스':
        return <ReferenceIcon />;
      case '기타':
      default:
        return <EtcIcon />;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-[1rem] rounded-[1.25rem] border border-[#CDD0D5] bg-[#FDFDFD] p-[1.5rem] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] transition-transform active:scale-[0.98]',
        className,
      )}
      onClick={onClick}
    >
      {/* 제목, 날짜 */}
      <div className='flex items-center justify-between'>
        <span className='text-[1.125rem] font-bold text-[#1A1A1A] truncate max-w-[70%]'>
          {title}
        </span>
        <span className='text-[0.875rem] text-[#9EA4A9]'>{date}</span>
      </div>

      {/* 내용: 3줄까지만 표시, 나머지 말줄임 */}
      <div className='line-clamp-3 min-h-0 text-[1rem] leading-[1.5] text-[#1A1A1A] whitespace-pre-line'>
        {content}
      </div>

      {/* 태그 */}
      <div className='flex flex-wrap items-center gap-[0.5rem] mt-[0.5rem]'>
        <div className='rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
          {activityName}
        </div>

        <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
          <div className='scale-75 flex items-center justify-center w-5 h-5'>
            {getCategoryIcon(category)}
          </div>
          <span>{category}</span>
        </div>
      </div>
    </div>
  );
}
