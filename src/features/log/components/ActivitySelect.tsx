'use client';

import { useState } from 'react';
import { DropdownButton } from '@/components/DropdownButton';
import { CommonModal } from '@/components/CommonModal';
import InputArea from '@/components/InputArea';
import { useLogStore } from '@/store/useLogStore';

interface ActivitySelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function ActivitySelect({
  value = '',
  onChange,
}: ActivitySelectProps = {}) {
  const { activities, removeActivity } = useLogStore();
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 삭제 버튼 클릭 시 모달 열기
  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  // 실제 삭제 실행
  const confirmDelete = () => {
    if (deleteTargetId) {
      removeActivity(deleteTargetId);
      // 삭제된 항목이 선택된 항목이면 선택 해제
      if (selectedActivityId === deleteTargetId) {
        setSelectedActivityId('');
        onChange?.('');
      }
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const activitiesWithHandlers = activities.map((activity) => ({
    ...activity,
    onDelete: handleDelete,
  }));

  // 드롭다운에서 항목 선택 시
  const handleActivitySelect = (id: string) => {
    setSelectedActivityId(id);
    const selectedActivity = activities.find((activity) => activity.id === id);
    if (selectedActivity) {
      onChange?.(selectedActivity.label);
    }
  };

  // 입력값 변경 시
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const deleteTargetActivity = activities.find(
    (activity) => activity.id === deleteTargetId,
  );

  return (
    <>
      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
          <span>활동명</span>
        </div>
        <InputArea
          placeholder='활동명 입력 또는 선택'
          width='28.5rem'
          value={value}
          onChange={handleInputChange}
          maxLength={20}
          rightElement={
            <DropdownButton
              items={activitiesWithHandlers}
              menuWidth='28.5rem'
              value={selectedActivityId}
              onChange={handleActivitySelect}
            />
          }
        />
      </div>

      {/* 삭제 확인 모달 */}
      <CommonModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title='이 활동 분류를 정말 삭제하시겠습니까?'
        description='해당 태그로 등록된 인사이트 로그가 미분류로 변경돼요.'
        secondaryBtnText='삭제'
        cancelBtnText='취소'
        onSecondaryClick={confirmDelete}
        onCancelClick={() => {
          setIsDeleteModalOpen(false);
          setDeleteTargetId(null);
        }}
      />
    </>
  );
}
