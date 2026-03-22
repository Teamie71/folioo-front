'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { InsightLogIcon } from '@/components/icons/InsightLogIcon';
import { MobileLogCard } from '@/features/log/components/mobile/MobileLogCard';
import { useLogs } from '@/features/log/hooks/useLogs';
import { useActivityTags } from '@/features/log/hooks/useActivityTags';
import { MobileLogDetailView } from '@/features/log/components/mobile/MobileLogDetailView';
import { type LogCardData } from '@/store/useLogStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { updateInsightLog, deleteInsightLog } from '@/services/insight';
import { INSIGHTS_QUERY_KEY } from '@/features/log/constants';
import { LogDeleteModal } from '@/features/log/components/LogDeleteModal';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import EtcIcon from '@/components/icons/EtcIcon';
import {
  LogContentToggle,
  type LogContentType,
} from '@/features/log/components/mobile/LogContentToggle';
import { DropdownButton } from '@/components/DropdownButton';
import { DropdownIcon } from '@/components/icons/DropdownIcon';
import { SearchButton } from '@/components/SearchButton';
import { MobileLogForm } from '@/features/log/components/mobile/MobileLogForm';

export default function LogClientMobile() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLoggedIn = accessToken != null;
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [activeTab, setActiveTab] = useState<LogContentType>('create');

  const { activities } = useActivityTags();
  const { logCards, isLoading } = useLogs({
    keyword: submittedKeyword,
    categoryId: selectedCategoryId,
    activityId: selectedActivityId,
  });

  const applySearch = () => {
    setSubmittedKeyword(searchInput.trim());
  };

  // 모달 상태
  const [selectedLog, setSelectedLog] = useState<LogCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingLog, setIsDeletingLog] = useState(false);
  const [deleteLogError, setDeleteLogError] = useState<string | null>(null);
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [saveLogError, setSaveLogError] = useState<string | null>(null);

  // 카드 클릭 핸들러
  const handleCardClick = (log: LogCardData) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  // 로그 수정 핸들러
  const handleSaveLog = async (data: { title: string; content: string }) => {
    if (!selectedLog) return;
    const insightId = Number(selectedLog.id);
    if (Number.isNaN(insightId)) return;
    setIsSavingLog(true);
    setSaveLogError(null);
    try {
      await updateInsightLog(insightId, {
        title: data.title,
        description: data.content,
      });
      await queryClient.invalidateQueries({ queryKey: INSIGHTS_QUERY_KEY });
      setSelectedLog({
        ...selectedLog,
        title: data.title,
        content: data.content,
      });
    } catch (err) {
      setSaveLogError(
        err instanceof Error ? err.message : '로그 수정에 실패했습니다.',
      );
      throw err;
    } finally {
      setIsSavingLog(false);
    }
  };

  // 로그 삭제
  const handleOpenDeleteModal = () => {
    setDeleteLogError(null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteLog = async () => {
    if (!selectedLog) return;
    const insightId = Number(selectedLog.id);
    if (Number.isNaN(insightId)) return;
    setIsDeletingLog(true);
    setDeleteLogError(null);
    try {
      await deleteInsightLog(insightId);
      await queryClient.invalidateQueries({ queryKey: INSIGHTS_QUERY_KEY });
      handleCloseModal();
      setIsDeleteModalOpen(false);
    } catch (err) {
      setDeleteLogError(
        err instanceof Error ? err.message : '로그 삭제에 실패했습니다.',
      );
    } finally {
      setIsDeletingLog(false);
    }
  };

  const categories = [
    { id: '', label: '카테고리 선택' },
    { id: 'interperson', label: '대인관계', icon: <InterpersonIcon /> },
    { id: 'problem-solve', label: '문제해결', icon: <ProblemSolveIcon /> },
    { id: 'learning', label: '학습', icon: <LearningIcon /> },
    { id: 'reference', label: '레퍼런스', icon: <ReferenceIcon /> },
    { id: 'etc', label: '기타', icon: <EtcIcon /> },
  ];

  const activityFilterItems = [
    { id: '', label: '활동 분류 선택' },
    ...activities,
  ];

  return (
    <div className='flex min-h-screen w-full flex-col overflow-x-hidden bg-white pb-[5rem]'>
      {/* 배너 */}
      <div className='bg-sub1 flex flex-col px-[1rem] py-[1.25rem]'>
        <p className='typo-c1 text-gray7'>
          오늘 얻은 인사이트를 기록해보세요.
          <br />
          작은 인사이트가 모여 큰 성장이 됩니다.
        </p>
      </div>

      {/* 로그 작성 OR 나의 로그 토글 */}
      <LogContentToggle value={activeTab} onValueChange={setActiveTab} />

      {/* Content Area */}
      {activeTab === 'create' ? (
        <div className='flex flex-col px-4 pt-8'>
          <MobileLogForm onLogCreated={() => setActiveTab('list')} />
        </div>
      ) : (
        <div className='flex flex-col px-4 pt-8'>
          {/* Search Input */}
          <div className='relative mb-4 flex items-center rounded-[0.5rem] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.05)]'>
            <input
              className='w-full rounded-[0.5rem] border border-[#74777D] bg-white px-[1.25rem] py-[0.75rem] text-[1rem] outline-none focus:border-[#5060C5]'
              placeholder='검색어를 입력하세요.'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applySearch();
              }}
            />
            <div
              className='absolute right-[1.25rem] cursor-pointer'
              onClick={applySearch}
            >
              <SearchButton />
            </div>
          </div>

          {/* Filters */}
          <div className='mb-8 flex items-stretch gap-2'>
            {/* 카테고리 선택 */}
            <DropdownButton
              items={categories}
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
              className='flex flex-1 flex-col rounded-[0.5rem] border border-[#74777D] bg-white'
              menuWidth='100%'
            >
              <div className='flex h-full w-full items-center justify-between px-[1rem] py-[0.75rem]'>
                <span
                  className={`block text-[1rem] ${selectedCategoryId ? 'text-[#000000]' : 'text-[#74777D]'}`}
                >
                  {categories.find((cat) => cat.id === selectedCategoryId)
                    ?.label || '카테고리 선택'}
                </span>
                <DropdownIcon className='shrink-0 text-[#1A1A1A]' />
              </div>
            </DropdownButton>

            {/* 활동 분류 선택 */}
            <DropdownButton
              items={activityFilterItems}
              value={selectedActivityId}
              onChange={setSelectedActivityId}
              className='flex flex-1 flex-col rounded-[0.5rem] border border-[#74777D] bg-white'
              menuWidth='100%'
            >
              <div className='flex h-full w-full items-center justify-between px-[1rem] py-[0.75rem]'>
                <span
                  className={`block text-[1rem] ${selectedActivityId ? 'text-[#000000]' : 'text-[#74777D]'}`}
                >
                  {activityFilterItems.find(
                    (act) => act.id === selectedActivityId,
                  )?.label || '활동 분류 선택'}
                </span>
                <DropdownIcon className='shrink-0 text-[#1A1A1A]' />
              </div>
            </DropdownButton>
          </div>

          {/* List */}
          <div className='flex flex-col gap-4'>
            {isLoggedIn && isLoading ? (
              <div className='mt-8 flex justify-center'>
                <motion.div
                  animate={{ rotate: 720 }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeOut',
                  }}
                >
                  <img
                    src='/LoadingSpinnerIcon.svg'
                    alt=''
                    width={48}
                    height={48}
                  />
                </motion.div>
              </div>
            ) : logCards.length === 0 ? (
              <p className='mt-[3.25rem] text-center text-[1rem] font-bold whitespace-pre-line text-[#9EA4A9]'>
                {submittedKeyword.trim()
                  ? '앗, 일치하는 결과가 없어요.'
                  : '아직 작성한 로그가 없어요.\n로그를 작성하고 인사이트를 기록해보세요!'}
              </p>
            ) : (
              logCards.map((log) => (
                <MobileLogCard
                  key={log.id}
                  title={log.title}
                  date={log.date}
                  content={log.content}
                  activityName={log.activityName}
                  category={log.category}
                  onClick={() => handleCardClick(log)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* 로그 상세 (모바일용 페이지 형태) */}
      {selectedLog && (
        <MobileLogDetailView
          isOpen={isModalOpen}
          onClose={() => {
            setSaveLogError(null);
            handleCloseModal();
          }}
          onDelete={handleOpenDeleteModal}
          onSave={handleSaveLog}
          isSaving={isSavingLog}
          saveError={saveLogError}
          otherLogTitles={logCards
            .filter((log) => log.id !== selectedLog.id)
            .map((log) => log.title)}
          title={selectedLog.title}
          date={selectedLog.date}
          content={selectedLog.content}
          activityName={selectedLog.activityName}
          category={selectedLog.category}
        />
      )}

      {/* 로그 삭제 확인 모달 */}
      <LogDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteLogError(null);
          setIsDeleteModalOpen(open);
        }}
        onConfirm={handleConfirmDeleteLog}
        isDeleting={isDeletingLog}
        errorMessage={deleteLogError}
      />
    </div>
  );
}
