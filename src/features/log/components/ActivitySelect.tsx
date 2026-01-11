'use client';

import { useState } from 'react';
import { Dropdown } from '@/components/Dropdown';

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

  const handleDelete = (id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
    // 삭제된 항목이 선택된 항목이면 선택 해제
    if (selectedActivityId === id) {
      setSelectedActivityId('');
    }
  };

  const activitiesWithHandlers = activities.map((activity) => ({
    ...activity,
    onDelete: handleDelete,
  }));

  return (
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
  );
}
