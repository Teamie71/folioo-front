'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CommonButton } from '@/components/CommonButton';
import EtcIcon from '@/components/icons/EtcIcon';
import { InsightLogIcon } from '@/components/icons/InsightLogIcon';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import InputArea from '@/components/InputArea';
import { SearchButton } from '@/components/SearchButton';
import { SingleButtonGroup } from '@/components/SingleButtonGroup';
import { Checkbox } from '@/components/ui/CheckBox';
import { ActivitySelect } from '@/features/log/components/ActivitySelect';
import {
  InsightTemplateSelector,
  type TemplateType,
} from '@/features/log/components/CategorySector';
import { LogCard } from '@/features/log/components/LogCard';
import { LogDetailModal } from '@/features/log/components/LogCardDetailModal';
import { LogCompleteModal } from '@/features/log/components/LogCompleteModal';
import { LogDeleteModal } from '@/features/log/components/LogDeleteModal';
import { DropdownButton } from '@/components/DropdownButton';
import { INSIGHTS_QUERY_KEY } from '@/features/log/constants';
import { useActivityTags } from '@/features/log/hooks/useActivityTags';
import { useLogFormSubmit } from '@/features/log/hooks/useLogFormSubmit';
import { useLogs } from '@/features/log/hooks/useLogs';
import { deleteInsightLog, updateInsightLog } from '@/services/insight';
import {
  useLogStore,
  type TemplateType as StoreTemplateType,
  type LogCardData,
} from '@/store/useLogStore';

export default function LogPage() {

  const {
    selectedCategoryId,
    selectedActivityId,
    formData,
    setSelectedCategoryId,
    setSelectedActivityId,
    setFormField,
  } = useLogStore();

  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const { activities } = useActivityTags();
  const { logCards, isLoading } = useLogs({
    keyword: submittedKeyword,
    categoryId: selectedCategoryId,
    activityId: selectedActivityId,
  });

  const applySearch = () => {
    setSubmittedKeyword(searchInput.trim());
  };
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const { errors, isSubmitting, handleSubmit } = useLogFormSubmit(
    logCards.map((log) => log.title),
    {
      onLogCreated: () => {
        useLogStore.getState().resetForm();
        setIsCompleteModalOpen(true);
      },
    },
  );

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

  // 로그 수정 핸들러 (수정 API 호출 후 목록 무효화)
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

  // 로그 삭제 모달 열기 핸들러: 상세 모달은 먼저 닫기
  const handleOpenDeleteModal = () => {
    setIsModalOpen(false);
    setDeleteLogError(null);
    setIsDeleteModalOpen(true);
  };

  // 로그 삭제 확인 핸들러
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
    { id: 'interperson', label: '대인관계', icon: <InterpersonIcon /> },
    { id: 'problem-solve', label: '문제해결', icon: <ProblemSolveIcon /> },
    { id: 'learning', label: '학습', icon: <LearningIcon /> },
    { id: 'reference', label: '레퍼런스', icon: <ReferenceIcon /> },
    { id: 'etc', label: '기타', icon: <EtcIcon /> },
  ];

  return (
    <div className='flex flex-col gap-[4.5rem] pb-[15rem]'>
      {/* 인사이트 로그 헤더 */}
      <div className='mx-auto flex h-[15.625rem] w-full min-w-[66rem] flex-col justify-center bg-[#F6F5FF]'>
        <div className='mx-auto flex min-w-[66rem] flex-col items-start gap-[1rem]'>
          <div className='flex items-center gap-[1rem]'>
            <InsightLogIcon />
            <span className='text-[1.5rem] font-bold text-[#1A1A1A]'>
              인사이트 로그
            </span>
          </div>
          <span className='font-regular text-[1.125rem] leading-[150%] text-[#464B53]'>
            오늘 얻은 인사이트를 기록해보세요.
            <br />
            작은 인사이트가 모여 큰 성장이 됩니다.
          </span>
        </div>
      </div>

      {/* 새로운 로그 작성 영역 */}
      <div className='mx-auto flex w-[66rem] flex-col rounded-[1.25rem] bg-[#ffffff] p-[2rem] shadow-[0px_4px_8px_0px_#00000033]'>
        {/* 로그 작성 헤더 */}
        <div className='flex w-full items-center justify-between px-[0.5rem]'>
          <span className='text-[1.25rem] font-bold'>새로운 로그 작성</span>
          <CommonButton
            variantType='Primary'
            px='2.25rem'
            py='0.75rem'
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '로그 등록하기'}
          </CommonButton>
        </div>

        {/* 구분선 */}
        <div className='mt-[1.25rem] mb-[2.5rem] w-full border border-[#9EA4A9]' />

        {/* 로그 작성 내용 */}
        <div className='flex flex-col gap-[3.75rem] px-[1.5rem]'>
          {/* 제목, 활동명 */}
          <div className='grid grid-cols-2 justify-between gap-[1.5rem]'>
            <div className='flex flex-col gap-[0.5rem]'>
              <div className='flex items-center gap-[0.5rem] text-[1.125rem]'>
                <div className='flex items-center gap-[0.25rem]'>
                  <span className='font-bold'>제목</span>
                  <span className='tex font-bold text-[#DC0000]'>*</span>
                </div>
                {errors.title && (
                  <p className='font-regular text-[0.875rem] text-[#DC0000]'>
                    {errors.title}
                  </p>
                )}
              </div>
              <InputArea
                placeholder='제목 입력'
                value={formData.title}
                onChange={(e) => setFormField('title', e.target.value)}
                maxLength={20}
              />
            </div>

            {/* 활동명 선택 */}
            <ActivitySelect
              value={formData.activityName}
              onChange={(value) => setFormField('activityName', value)}
              dropdownItems={activities}
              activityCountError={
                activities.length > 10 ? '최대 10개까지만 등록 가능해요.' : null
              }
            />
          </div>

          {/* 카테고리 선택 */}
          <div className='flex flex-col gap-[0.625rem]'>
            <div className='flex flex-col gap-[0.25rem]'>
              <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
                <span>카테고리</span>
                <span className='text-[#DC0000]'>*</span>
              </div>
              {errors.category && (
                <p className='font-regular text-[0.875rem] text-[#DC0000]'>
                  {errors.category}
                </p>
              )}
            </div>

            <InsightTemplateSelector
              onCategoryChange={(category: TemplateType) =>
                setFormField('category', category as string)
              }
              contentError={errors.content}
            />
          </div>
        </div>
      </div>

      {/* 나의 로그 영역 */}
      <div className='mx-auto flex w-[66rem] flex-col gap-[2.75rem]'>
        {/* 검색, 선택 */}
        <div className='flex flex-col gap-[2.25rem]'>
          <span className='text-[1.25rem] font-bold'>나의 로그</span>
          <div className='flex items-center gap-[1.5rem]'>
            {/* 검색: Enter 또는 검색 아이콘 클릭 시 제목/내용 기준 검색, 공란 시 전체 표시 */}
            <div className='relative flex items-center'>
              <input
                className='w-[32.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                placeholder='검색어를 입력하세요.'
                maxLength={100}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applySearch();
                  }
                }}
              />
              <div className='absolute right-[1.25rem]'>
                <SearchButton onClick={applySearch} />
              </div>
            </div>

            {/* 카테고리 선택 */}
            <div className='relative flex items-center'>
              <div className='w-[15.375rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
                <span
                  className={`text-[1rem] ${categories.find((cat) => cat.id === selectedCategoryId) ? 'text-[#000000]' : 'text-[#74777D]'}`}
                >
                  {categories.find((cat) => cat.id === selectedCategoryId)
                    ?.label || '카테고리 선택'}
                </span>
              </div>
              <div className='absolute right-[1.25rem]'>
                <DropdownButton
                  items={categories}
                  value={selectedCategoryId}
                  onChange={setSelectedCategoryId}
                  menuWidth='15.375rem'
                />
              </div>
            </div>

            {/* 활동 분류 선택 */}
            <div className='relative flex items-center'>
              <div className='w-[15.375rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'>
                <span
                  className={`text-[1rem] ${activities.find((act) => act.id === selectedActivityId) ? 'text-[#000000]' : 'text-[#74777D]'}`}
                >
                  {activities.find((act) => act.id === selectedActivityId)
                    ?.label || '활동 분류 선택'}
                </span>
              </div>
              <div className='absolute right-[1.25rem]'>
                <DropdownButton
                  items={activities}
                  value={selectedActivityId}
                  onChange={setSelectedActivityId}
                  menuWidth='15.375rem'
                />
              </div>
            </div>
          </div>
        </div>

        {/* 카드 */}
        <div className='grid grid-cols-2 gap-[1.5rem]'>
          {logCards.length === 0 ? (
            <div className='col-span-2 mt-[5rem] flex items-center justify-center text-center text-[1.125rem] leading-[130%] font-bold text-[#9EA4A9]'>
              {submittedKeyword.trim() || selectedCategoryId || selectedActivityId ? (
                <>앗, 일치하는 결과가 없어요.</>
              ) : (
                <>
                  아직 작성한 로그가 없어요 <br />
                  로그를 작성하고 인사이트를 기록해보세요!
                </>
              )}
            </div>
          ) : (
            logCards.map((log) => (
              <LogCard
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

      {/* 로그 상세 모달 */}
      {selectedLog && (
        <LogDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setSaveLogError(null);
            handleCloseModal();
          }}
          onDelete={handleOpenDeleteModal}
          onSave={handleSaveLog}
          isSaving={isSavingLog}
          saveError={saveLogError}
          title={selectedLog.title}
          date={selectedLog.date}
          content={selectedLog.content}
          activityName={selectedLog.activityName}
          category={selectedLog.category}
        />
      )}

      {/* 로그 등록 완료 모달 */}
      <LogCompleteModal
        open={isCompleteModalOpen}
        onOpenChange={setIsCompleteModalOpen}
      />

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
