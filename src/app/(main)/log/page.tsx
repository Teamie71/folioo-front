'use client';

import { useState } from 'react';
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
import { DropdownButton } from '@/components/DropdownButton';
import { useActivityTags } from '@/features/log/hooks/useActivityTags';
import { useLogFormSubmit } from '@/features/log/hooks/useLogFormSubmit';
import { useLogs } from '@/features/log/hooks/useLogs';
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
    updateLog,
    removeLog,
    setSelectedCategoryId,
    setSelectedActivityId,
    setFormField,
  } = useLogStore();

  const [keyword, setKeyword] = useState('');
  const { activities } = useActivityTags();
  const { errors, isSubmitting, handleSubmit } = useLogFormSubmit();
  const { logCards, isLoading } = useLogs({
    keyword,
    categoryId: selectedCategoryId,
    activityId: selectedActivityId,
  });

  // 모달 상태
  const [selectedLog, setSelectedLog] = useState<LogCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDeleteLog = () => {
    if (selectedLog) {
      removeLog(selectedLog.id);
      handleCloseModal();
    }
  };

  const handleSaveLog = (data: { title: string; content: string }) => {
    if (selectedLog) {
      updateLog(selectedLog.id, {
        title: data.title,
        content: data.content,
      });
      setSelectedLog({
        ...selectedLog,
        title: data.title,
        content: data.content,
      });
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
            {/* 검색 */}
            <div className='relative flex items-center'>
              <input
                className='w-[32.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
                placeholder='검색어를 입력하세요.'
                maxLength={100}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <div className='absolute right-[1.25rem]'>
                <SearchButton />
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
          {isLoading ? (
            <div className='col-span-2 mt-[5rem] text-center text-[1.125rem] text-[#9EA4A9]'>
              로딩 중...
            </div>
          ) : logCards.length === 0 ? (
            <div className='col-span-2 mt-[5rem] flex items-center justify-center text-center text-[1.125rem] leading-[130%] font-bold text-[#9EA4A9]'>
              아직 작성한 로그가 없어요 <br />
              로그를 작성하고 인사이트를 기록해보세요!
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
          onClose={handleCloseModal}
          onDelete={handleDeleteLog}
          onSave={handleSaveLog}
          title={selectedLog.title}
          date={selectedLog.date}
          content={selectedLog.content}
          activityName={selectedLog.activityName}
          category={selectedLog.category}
        />
      )}
    </div>
  );
}
