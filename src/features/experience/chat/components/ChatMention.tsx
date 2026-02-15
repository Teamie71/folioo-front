'use client';

import { useState } from 'react';
import EtcIcon from '@/components/icons/EtcIcon';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import { CardMentionDetailModal } from './CardMentionDetailModal';

interface MentionItem {
  id: string;
  title: string;
  date: string;
  content: string;
  activityName: string;
  category: string;
}

// 더미 데이터
const DUMMY_ITEMS: MentionItem[] = [
  {
    id: '1',
    title: '제목',
    date: '2025.01.10',
    content: '내용내용',
    activityName: '미분류',
    category: '대인관계',
  },
  {
    id: '2',
    title: '제목제목',
    date: '2025.01.11',
    content: '내용내용내용내용내용내용',
    activityName: '활동 A',
    category: '문제해결',
  },
  {
    id: '3',
    title: '제목제목제목',
    date: '2025.01.12',
    content: '내용내용내용내용내용내용내용내용',
    activityName: '활동 BB',
    category: '학습',
  },
  {
    id: '4',
    title: '제목제목제목제목',
    date: '2025.01.13',
    content: '내용내용내용내용내용내용내용내용내용내용',
    activityName: '미분류',
    category: '레퍼런스',
  },
  {
    id: '5',
    title: '제목제목제목제목제목',
    date: '2025.01.14',
    content: '내용내용내용내용내용내용내용내용내용내용내용내용',
    activityName: '미분류',
    category: '기타',
  },
];

interface ChatMentionProps {
  onSelect?: (title: string) => void;
}

export const ChatMention = ({ onSelect }: ChatMentionProps) => {
  const [detailItem, setDetailItem] = useState<MentionItem | null>(null);

  const handleDetailClick = (e: React.MouseEvent, item: MentionItem) => {
    e.stopPropagation(); // 부모 button의 onClick 방지
    setDetailItem(item);
  };

  const handleMention = (title: string) => {
    onSelect?.(title);
    setDetailItem(null);
  };

  return (
    <>
      <div className='flex h-[15rem] w-[35.2rem] flex-col rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] shadow-[0px_0px_32px_0px_#00000040]'>
        <div className='flex items-center'>
          <div className='flex items-center justify-center'>
            <div className='flex cursor-pointer items-center gap-[0.5rem] border-b-[0.125rem] border-[#9EA4A9] px-[1.25rem] py-[0.75rem] text-[#1A1A1A] hover:rounded-tl-[1rem] hover:border-b-[#5060C5] hover:bg-[#F6F5FF] hover:font-bold hover:text-[#5060C5]'>
              <InterpersonIcon />
              <p>대인관계</p>
            </div>
          </div>

          <div className='flex items-center justify-center'>
            <div className='flex cursor-pointer items-center gap-[0.5rem] border-b-[0.125rem] border-[#9EA4A9] px-[1.25rem] py-[0.75rem] text-[#1A1A1A] hover:rounded-tr-[1rem] hover:border-b-[#5060C5] hover:bg-[#F6F5FF] hover:font-bold hover:text-[#5060C5]'>
              <ProblemSolveIcon />
              <p>문제해결</p>
            </div>
          </div>

          <div className='flex items-center justify-center'>
            <div className='flex cursor-pointer items-center gap-[0.5rem] border-b-[0.125rem] border-[#9EA4A9] px-[1.25rem] py-[0.75rem] text-[#1A1A1A] hover:rounded-tr-[1rem] hover:border-b-[#5060C5] hover:bg-[#F6F5FF] hover:font-bold hover:text-[#5060C5]'>
              <LearningIcon />
              <p>학습</p>
            </div>
          </div>

          <div className='flex items-center justify-center'>
            <div className='flex cursor-pointer items-center gap-[0.5rem] border-b-[0.125rem] border-[#9EA4A9] px-[1.25rem] py-[0.75rem] text-[#1A1A1A] hover:rounded-tr-[1rem] hover:border-b-[#5060C5] hover:bg-[#F6F5FF] hover:font-bold hover:text-[#5060C5]'>
              <ReferenceIcon />
              <p>레퍼런스</p>
            </div>
          </div>

          <div className='flex items-center justify-center'>
            <div className='flex cursor-pointer items-center gap-[0.5rem] border-b-[0.125rem] border-[#9EA4A9] px-[1.25rem] py-[0.75rem] text-[#1A1A1A] hover:rounded-tr-[1rem] hover:border-b-[#5060C5] hover:bg-[#F6F5FF] hover:font-bold hover:text-[#5060C5]'>
              <EtcIcon />
              <p>기타</p>
            </div>
          </div>
        </div>

        <div className='mention-scroll mr-[0.5rem] flex min-h-0 flex-1 flex-col gap-[0.25rem] overflow-y-auto px-[1.25rem] py-[1.125rem] pr-[0.5rem]'>
          {DUMMY_ITEMS.map((item) => (
            <button
              key={item.id}
              type='button'
              className='flex w-full cursor-pointer items-center justify-between rounded-[0.25rem] border border-[#CDD0D5] px-[1rem] py-[0.75rem] hover:bg-[#F6F5FF]'
              onClick={() => onSelect?.(item.title)}
            >
              <p className='text-[0.875rem] leading-[150%]'>{item.title}</p>
              <div className='flex items-center gap-[1rem]'>
                <div className='h-[1.375rem] rounded-[3.75rem] border border-[#9EA4A9] px-[0.625rem] py-[0.125rem] text-[0.75rem]'>
                  {item.activityName}
                </div>

                <button
                  type='button'
                  className='h-[1.375rem] w-[4.125rem] cursor-pointer rounded-[0.25rem] bg-[#E9EAEC] text-center text-[0.75rem]'
                  onClick={(e) => handleDetailClick(e, item)}
                >
                  내용보기
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 내용보기 모달 */}
      {detailItem && (
        <CardMentionDetailModal
          isOpen={!!detailItem}
          onClose={() => setDetailItem(null)}
          onMention={handleMention}
          title={detailItem.title}
          date={detailItem.date}
          content={detailItem.content}
          activityName={detailItem.activityName}
          category={detailItem.category}
        />
      )}
    </>
  );
};
