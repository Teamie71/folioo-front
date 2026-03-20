'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DropdownButton } from '@/components/DropdownButton';
import { CommonModal } from '@/components/CommonModal';
import InputArea from '@/components/InputArea';
import { useLogStore } from '@/store/useLogStore';
import { deleteActivityTag } from '@/services/insight';
import {
  ACTIVITY_TAGS_QUERY_KEY,
  INSIGHTS_QUERY_KEY,
} from '@/features/log/constants';

const INPUT_OPTION_ID = '__input__';

interface ActivitySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  /** 드롭다운에 쓸 목록 (API 활동 태그). 없으면 스토어 activities 사용 */
  dropdownItems?: { id: string; label: string }[];
  /** 활동 개수 초과 시 표시할 메시지 (예: 10개 초과 시) */
  activityCountError?: string | null;
  /** 입력 영역 너비 */
  width?: string;
  /** 드롭다운 메뉴 너비 */
  menuWidth?: string;
}

export function ActivitySelect({
  value = '',
  onChange,
  dropdownItems,
  activityCountError,
  width,
  menuWidth,
}: ActivitySelectProps = {}) {
  const { activities: storeActivities, removeActivity } = useLogStore();
  const queryClient = useQueryClient();
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const baseItems = dropdownItems ?? storeActivities;

  const hasInputAsOption =
    value?.trim() && !baseItems.some((a) => a.label === value.trim());
  const dropdownList = useMemo(() => {
    const inputOption = hasInputAsOption
      ? [{ id: INPUT_OPTION_ID, label: value.trim() as string }]
      : [];
    return [...inputOption, ...baseItems];
  }, [hasInputAsOption, value, baseItems]);

  const activitiesWithHandlers = useMemo(
    () =>
      dropdownList.map((a) => ({
        ...a,
        onDelete: a.id !== INPUT_OPTION_ID ? handleDelete : undefined,
      })),
    [dropdownList],
  );

  function handleDelete(id: string) {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const tagIdNum = Number(deleteTargetId);
    if (Number.isNaN(tagIdNum)) {
      removeActivity(deleteTargetId);
      if (selectedActivityId === deleteTargetId) {
        setSelectedActivityId('');
        onChange?.('');
      }
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteActivityTag(tagIdNum);
      const deletedLabel =
        dropdownList.find((a) => a.id === deleteTargetId)?.label ?? '';
      if (selectedActivityId === deleteTargetId || value === deletedLabel) {
        setSelectedActivityId('');
        onChange?.('');
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ACTIVITY_TAGS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: INSIGHTS_QUERY_KEY }),
      ]);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : '활동 태그 삭제에 실패했습니다.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleActivitySelect = (id: string) => {
    setSelectedActivityId(id);
    const selected = dropdownList.find((a) => a.id === id);
    if (selected) {
      onChange?.(selected.label);
    }
  };

  // 입력값 변경 시
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value.slice(0, 20));
  };

  return (
    <>
      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex items-center gap-[0.5rem] text-[1rem] md:text-[1.125rem] md:font-bold'>
          <span>활동명</span>
          {activityCountError && (
            <p className='font-regular text-[0.875rem] text-[#DC0000]'>
              {activityCountError}
            </p>
          )}
        </div>
        <InputArea
          placeholder='활동명 입력 또는 선택'
          width={width ?? '28.5rem'}
          value={value}
          onChange={handleInputChange}
          maxLength={20}
          rightElement={
            <DropdownButton
              items={activitiesWithHandlers}
              menuWidth={
                width === '100%'
                  ? 'calc(100vw - 2rem)'
                  : (menuWidth ?? width ?? '28.5rem')
              }
              value={selectedActivityId}
              onChange={handleActivitySelect}
            />
          }
        />
      </div>

      {/* 삭제 확인 모달 */}
      <CommonModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteError(null);
            setDeleteTargetId(null);
          }
          setIsDeleteModalOpen(open);
        }}
        title='이 활동 분류를 정말 삭제하시겠습니까?'
        description='해당 태그로 등록된 인사이트 로그가 미분류로 변경돼요.'
        secondaryBtnText='삭제'
        cancelBtnText='취소'
        onSecondaryClick={isDeleting ? () => {} : confirmDelete}
        onCancelClick={() => {
          setIsDeleteModalOpen(false);
          setDeleteTargetId(null);
          setDeleteError(null);
        }}
      >
        {deleteError && (
          <p className='mt-2 text-sm text-[#DC0000]'>{deleteError}</p>
        )}
      </CommonModal>
    </>
  );
}
