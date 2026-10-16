'use client';

import { useEffect, useState } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { clearRecoveryDraft, readRecoveryDraft } from '../api/recoveryDraft';

export function ExperienceSaveNotice() {
  const error = useExperienceListStore((s) => s.syncError);
  const [hasBackup, setHasBackup] = useState(false);
  useEffect(() => {
    setHasBackup(readRecoveryDraft() != null);
  }, [error]);
  if (!error && !hasBackup) return null;
  return (
    <div
      role='alert'
      className='fixed inset-x-4 bottom-4 z-[190] mx-auto max-w-lg rounded-xl border border-gray-300 bg-white p-4 shadow-lg'
    >
      <p>
        {error
          ? '변경 사항을 저장하지 못했습니다.'
          : '이전에 저장하지 못한 편집 사본이 있습니다.'}{' '}
        편집 사본을 내려받아 내용을 확인해 주세요.
      </p>
      <button
        type='button'
        className='mt-2 underline'
        onClick={() => {
          const draft = readRecoveryDraft();
          if (!draft) return;
          const url = URL.createObjectURL(
            new Blob([JSON.stringify(draft, null, 2)], {
              type: 'application/json',
            }),
          );
          const link = document.createElement('a');
          link.href = url;
          link.download = 'folioo-experience-recovery.json';
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}
      >
        편집 사본 다운로드
      </button>
      <button
        type='button'
        className='ml-4 underline'
        onClick={() => {
          clearRecoveryDraft();
          useExperienceListStore.getState().setSyncError(null);
          setHasBackup(false);
        }}
      >
        사본 삭제 및 닫기
      </button>
    </div>
  );
}
