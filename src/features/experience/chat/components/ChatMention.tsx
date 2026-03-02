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
  const [selectedTab, setSelectedTab] = useState<string>('대인관계');

  const handleDetailClick = (e: React.MouseEvent, item: MentionItem) => {
    e.stopPropagation();
    setDetailItem(item);
  };

  const handleMention = (title: string) => {
    onSelect?.(title);
    setDetailItem(null);
  };

  const tabs = [
    {
      label: '대인관계',
      icon: <InterpersonIcon />,
      roundedClass: 'rounded-tl-[1rem]',
    },
    {
      label: '문제해결',
      icon: <ProblemSolveIcon />,
    },
    {
      label: '학습',
      icon: <LearningIcon />,
    },
    {
      label: '레퍼런스',
      icon: <ReferenceIcon />,
    },
    {
      label: '기타',
      icon: <EtcIcon />,
      roundedClass: 'hover:rounded-tr-[1rem]',
    },
  ];

  const filteredItems = DUMMY_ITEMS.filter(
    (item) => item.category === selectedTab,
  );

  return (
    <>
      <div className='flex h-[15rem] w-[35.2rem] flex-col rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] shadow-[0px_0px_32px_0px_#00000040]'>
        <div className='flex items-center'>
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.label;
            const hasItems = DUMMY_ITEMS.some(
              (item) => item.category === tab.label,
            );
            return (
              <div key={tab.label} className='flex items-center justify-center'>
                <button
                  type='button'
                  onClick={() => hasItems && setSelectedTab(tab.label)}
                  className={`group flex items-center gap-[0.5rem] border-b-[0.125rem] px-[1.25rem] py-[0.75rem] ${
                    !hasItems
                      ? 'cursor-default border-b-[#CDD0D5] text-[#CDD0D5]'
                      : isActive
                        ? 'cursor-pointer border-b-[#5060C5] bg-[#F6F5FF] font-bold text-[#5060C5]'
                        : 'cursor-pointer border-[#9EA4A9] text-[#1A1A1A] hover:border-b-[#5060C5] hover:bg-[#F6F5FF] hover:font-bold hover:text-[#5060C5]'
                  } ${tab.roundedClass}`}
                >
                  <span
                    className={
                      !hasItems
                        ? 'text-[#CDD0D5]'
                        : isActive
                          ? 'text-[#5060C5]'
                          : 'text-[#9EA4A9] group-hover:text-[#5060C5]'
                    }
                  >
                    {tab.icon}
                  </span>
                  <p>{tab.label}</p>
                </button>
              </div>
            );
          })}
        </div>

        <div className='mention-scroll mr-[0.5rem] flex min-h-0 flex-1 flex-col gap-[0.25rem] overflow-y-auto px-[1.25rem] py-[1.125rem] pr-[0.5rem]'>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
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
              </div>
            ))
          ) : (
            <div className='flex flex-1 items-center justify-center text-[0.875rem] text-[#9EA4A9]'>
              해당 카테고리의 인사이트 로그가 없습니다.
            </div>
          )}
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
