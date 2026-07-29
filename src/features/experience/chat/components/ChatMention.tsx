'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import EtcIcon from '@/components/icons/EtcIcon';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import type { InsightLogResDTO } from '@/api/models';
import { useInsightControllerGetLogs } from '@/api/endpoints/insight/insight';
import { CardMentionDetailModal } from './CardMentionDetailModal';

interface MentionItem {
  id: string;
  title: string;
  date: string;
  content: string;
  activityName: string;
  category: string;
}

const CATEGORY_TAB_LABELS = [
  '대인관계',
  '문제해결',
  '학습',
  '레퍼런스',
  '기타',
] as const;

function formatDate(createdAt: string | undefined): string {
  if (!createdAt) return '';
  const [y, m, d] = createdAt.split('T')[0].split('-');
  return [y, m, d].join('.');
}

function toMentionItem(dto: InsightLogResDTO): MentionItem {
  return {
    id: String(dto.id),
    title: dto.title,
    date: formatDate(dto.createdAt),
    content: dto.description ?? '',
    activityName: dto.activityNames?.[0] ?? '미분류',
    category: dto.category,
  };
}

interface ChatMentionProps {
  onSelect?: (title: string) => void;
}

const TAB_ICONS: Record<string, React.ReactNode> = {
  대인관계: <InterpersonIcon />,
  문제해결: <ProblemSolveIcon />,
  학습: <LearningIcon />,
  레퍼런스: <ReferenceIcon />,
  기타: <EtcIcon />,
};

export const ChatMention = ({ onSelect }: ChatMentionProps) => {
  const [detailItem, setDetailItem] = useState<MentionItem | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('대인관계');

  const { data, isLoading, isError } = useInsightControllerGetLogs(undefined, {
    query: { enabled: true },
  });

  const items: MentionItem[] = useMemo(() => {
    const result = data?.result;
    if (!Array.isArray(result)) return [];
    return result.map(toMentionItem);
  }, [data?.result]);

  // 로그가 있으면 로그가 있는 카테고리 중 첫 번째로 탭 선택
  useEffect(() => {
    if (items.length === 0) return;
    const firstCategoryWithItems = CATEGORY_TAB_LABELS.find((label) =>
      items.some((i) => i.category === label),
    );
    if (firstCategoryWithItems != null) {
      setSelectedTab(firstCategoryWithItems);
    }
  }, [items]);

  const handleDetailClick = (e: React.MouseEvent, item: MentionItem) => {
    e.stopPropagation();
    setDetailItem(item);
  };

  const handleMention = (title: string) => {
    onSelect?.(title);
    setDetailItem(null);
  };

  const tabs = useMemo(
    () =>
      CATEGORY_TAB_LABELS.map((label, i) => ({
        label,
        icon: TAB_ICONS[label] ?? null,
        roundedClass:
          i === 0
            ? 'rounded-tl-[1rem]'
            : i === CATEGORY_TAB_LABELS.length - 1
              ? 'rounded-tr-[1rem]'
              : undefined,
      })),
    [],
  );

  const filteredItems = items.filter((item) => item.category === selectedTab);

  const hasItemsByCategory = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return (label: string) => set.has(label);
  }, [items]);

  return (
    <>
      <div className='flex h-[15rem] w-auto flex-col rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] shadow-[0px_0px_32px_0px_#00000040]'>
        <div className='flex items-center'>
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.label;
            const hasItems = hasItemsByCategory(tab.label);
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
                  } ${tab.roundedClass ?? ''}`}
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
          {isLoading ? (
            <div className='flex flex-1 items-center justify-center'>
              <Image
                src='/LoadingSpinnerIcon.svg'
                alt=''
                width={40}
                height={40}
                className='animate-spin'
              />
            </div>
          ) : isError ? (
            <div className='flex flex-1 items-center justify-center text-center text-[0.875rem] leading-[150%] font-semibold text-[#DC0000]'></div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className='flex w-full cursor-pointer items-center justify-between rounded-[0.25rem] border border-[#CDD0D5] px-[1rem] py-[0.75rem] hover:bg-[#F6F8FA]'
                onClick={() => onSelect?.(item.title)}
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
        />
      )}
    </>
  );
};
