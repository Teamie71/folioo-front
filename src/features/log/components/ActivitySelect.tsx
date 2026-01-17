'use client';

import { useState } from 'react';
import { Dropdown } from '@/components/Dropdown';
import { CommonModal } from '@/components/CommonModal';

export function ActivitySelect() {
  const [activities, setActivities] = useState([
    {
      id: '1',
      label: '활동 A',
    },
    {
      id: '2',
      label: '활동 B',
    },
  ]);
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
      setActivities((prev) =>
        prev.filter((activity) => activity.id !== deleteTargetId),
      );
      // 삭제된 항목이 선택된 항목이면 선택 해제
      if (selectedActivityId === deleteTargetId) {
        setSelectedActivityId('');
      }
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const activitiesWithHandlers = activities.map((activity) => ({
    ...activity,
    onDelete: handleDelete,
  }));

  const deleteTargetActivity = activities.find(
    (activity) => activity.id === deleteTargetId,
  );

  return (
    <>
      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
          <span>활동명</span>
          <span className='text-[#DC0000]'>*</span>
        </div>
        <Dropdown
          items={activitiesWithHandlers}
          value={selectedActivityId}
          onChange={setSelectedActivityId}
          placeholder='활동을 선택하세요'
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
