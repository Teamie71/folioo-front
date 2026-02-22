import InterpersonIcon from '@/components/icons/InterpersonIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import EtcIcon from '@/components/icons/EtcIcon';

interface LogCardProps {
  title: string;
  date: string;
  content: string;
  activityName: string;
  category: string;
  onClick?: () => void;
}

export function LogCard({
  title,
  date,
  content,
  activityName,
  category,
  onClick,
}: LogCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '대인관계':
        return (
          <div className='scale-90'>
            <InterpersonIcon />
          </div>
        );
      case '문제해결':
        return (
          <div className='scale-90'>
            <ProblemSolveIcon />
          </div>
        );
      case '학습':
        return (
          <div className='scale-90'>
            <LearningIcon />
          </div>
        );
      case '레퍼런스':
        return (
          <div className='scale-90'>
            <ReferenceIcon />
          </div>
        );
      case '기타':
      default:
        return (
          <div className='scale-90'>
            <EtcIcon />
          </div>
        );
    }
  };

  return (
    <div
      className='flex cursor-pointer flex-col gap-[1.5rem] rounded-[1.25rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.5rem] shadow-[0px_4px_8px_0px_#00000033] transition-shadow hover:shadow-[0px_6px_12px_0px_#00000033]'
      onClick={onClick}
    >
      {/* 제목, 날짜 */}
      <div className='flex items-center justify-between'>
        <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
          {title}
        </span>
        <span className='text-[1rem] text-[#74777D]'>{date}</span>
      </div>

      {/* 내용 + 태그 */}
      <div className='flex flex-col gap-[1.25rem]'>
        {/* 내용: 3줄까지만 표시, 나머지 말줄임 */}
        <div className='line-height-[150%] line-clamp-3 text-[1rem] whitespace-pre-line text-[#1A1A1A]'>
          {content}
        </div>

        {/* 태그 */}
        <div className='flex items-center gap-[0.5rem]'>
          <div className='rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
            {activityName}
          </div>

          <div className='flex items-center gap-[0.5rem] rounded-[3.75rem] border border-[#CDD0D5] bg-[#FFFFFF] px-[0.625rem] py-[0.25rem] text-[0.875rem] text-[#1A1A1A]'>
            {getCategoryIcon(category)}
            <span>{category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
