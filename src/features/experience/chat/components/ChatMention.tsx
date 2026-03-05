'use client';

import { useMemo, useState } from 'react';
import EtcIcon from '@/components/icons/EtcIcon';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import { useInsightControllerGetLogs } from '@/api/endpoints/insight/insight';
import { CardMentionDetailModal } from './CardMentionDetailModal';

interface MentionItem {
  id: number;
  title: string;
  date: string;
  content: string;
  activityName: string;
  category: string;
}

function formatLogDate(createdAt: string): string {
  try {
    const d = new Date(createdAt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  } catch {
    return '';
  }
}

interface ChatMentionProps {
  onSelect?: (title: string, insightId?: number) => void;
}

export const ChatMention = ({ onSelect }: ChatMentionProps) => {
  const [detailItem, setDetailItem] = useState<MentionItem | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('대인관계');

  const {
    data: logsResponse,
    isPending,
    isError,
  } = useInsightControllerGetLogs(undefined, { query: { staleTime: 30_000 } });

  const items = useMemo((): MentionItem[] => {
    const list = logsResponse?.result ?? [];
    return list.map((log) => ({
      id: log.id,
      title: log.title ?? '',
      date: formatLogDate(log.createdAt ?? ''),
      content: log.description ?? '',
      activityName: log.activityNames?.[0] ?? '미분류',
      category: log.category ?? '기타',
    }));
  }, [logsResponse?.result]);

  const handleDetailClick = (e: React.MouseEvent, item: MentionItem) => {
    e.stopPropagation();
    setDetailItem(item);
  };

  const handleMention = (title: string, insightId?: number) => {
    onSelect?.(title, insightId);
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

  const filteredItems = items.filter((item) => item.category === selectedTab);

  return (
    <>
      <div className='flex h-[15rem] w-[35.2rem] flex-col rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] shadow-[0px_0px_32px_0px_#00000040]'>
        <div className='flex items-center'>
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.label;
            const hasItems = items.some((item) => item.category === tab.label);
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
          {isPending ? (
            <div className='flex flex-1 items-center justify-center py-[2rem] text-[0.875rem] text-[#9EA4A9]'></div>
          ) : isError ? (
            <div className='flex flex-1 items-center justify-center py-[2rem] text-[0.875rem] text-[#9EA4A9]'></div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className='flex w-full cursor-pointer items-center justify-between rounded-[0.25rem] border border-[#CDD0D5] px-[1rem] py-[0.75rem] hover:bg-[#F6F8FA]'
                onClick={() => onSelect?.(item.title, item.id)}
              >
                <p className='text-[0.875rem] leading-[150%]'>{item.title}</p>
                <div className='flex items-center gap-[1rem]'>
                  <div className='h-[1.375rem] rounded-[3.75rem] border border-[#9EA4A9] px-[0.625rem] py-[0.125rem] text-[0.75rem]'>
                    {item.activityName}
                  </div>

                  <button
                    type='button'
                    className='h-[1.375rem] w-[4.125rem] cursor-pointer rounded-[0.25rem] bg-[#E9EAEC] text-center text-[0.75rem] hover:bg-[#ffffff] hover:font-bold'
                    onClick={(e) => handleDetailClick(e, item)}
                  >
                    내용보기
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-1 items-center justify-center text-center text-[0.875rem] leading-[150%] font-semibold text-[#9EA4A9]'>
              <p>
                아직 작성한 로그가 없어요.
                <br />이 경험에서 얻은 인사이트를 채팅으로 알려주세요!
              </p>
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
          insightId={detailItem.id}
        />
      )}
    </>
  );
};
