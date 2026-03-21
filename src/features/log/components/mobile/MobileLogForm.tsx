'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogStore } from '@/store/useLogStore';
import { useLogFormSubmit } from '@/features/log/hooks/useLogFormSubmit';
import { useActivityTags } from '@/features/log/hooks/useActivityTags';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogs } from '@/features/log/hooks/useLogs';
import InputArea from '@/components/InputArea';
import { ActivitySelect } from '@/features/log/components/ActivitySelect';
import { InsightTemplateSelector } from '@/features/log/components/CategorySector';
import { CommonButton } from '@/components/CommonButton';
import { ButtonSpinnerIcon } from '@/components/icons/ButtonSpinnerIcon';
import { LogCompleteModalMobile } from '@/features/log/components/mobile/LogCompleteModalMobile';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { px } from 'framer-motion';

const LOG_FORM_DRAFT_KEY = 'log-form-draft';
const LOGIN_REQUIRED_REDIRECT_MS = 2000;

export function MobileLogForm({ onLogCreated }: { onLogCreated: () => void }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );

  const { formData, setFormField, getFormDraft, restoreFormDraft, resetForm } =
    useLogStore();

  const { activities } = useActivityTags();
  const { logCards } = useLogs({});

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const loginRequiredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const { errors, isSubmitting, handleSubmit } = useLogFormSubmit(
    logCards.map((log) => log.title),
    {
      onLogCreated: () => {
        resetForm();
        setIsCompleteModalOpen(true);
      },
    },
  );

  const handleRegisterClick = () => {
    if (sessionRestoreAttempted && accessToken == null) {
      const draft = getFormDraft();
      try {
        sessionStorage.setItem(LOG_FORM_DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* ignore */
      }
      setIsLoginRequiredModalOpen(true);
      return;
    }
    handleSubmit();
  };

  useEffect(() => {
    if (!isLoginRequiredModalOpen) return;
    loginRequiredTimerRef.current = setTimeout(() => {
      loginRequiredTimerRef.current = null;
      setIsLoginRequiredModalOpen(false);
      router.push('/login?redirect_to=' + encodeURIComponent('/log'));
    }, LOGIN_REQUIRED_REDIRECT_MS);
    return () => {
      if (loginRequiredTimerRef.current)
        clearTimeout(loginRequiredTimerRef.current);
    };
  }, [isLoginRequiredModalOpen, router]);

  return (
    <div className='flex flex-col gap-[1.25rem] pb-8'>
      {/* 제목 */}
      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex items-center gap-[0.5rem]'>
          <label className='typo-b2'>
            제목 <span className='text-[#DC0000]'>*</span>
          </label>
          {errors.title && (
            <span className='text-[0.875rem] text-[#DC0000]'>
              {errors.title}
            </span>
          )}
        </div>
        <InputArea
          placeholder='제목 입력'
          value={formData.title}
          onChange={(e) => setFormField('title', e.target.value.slice(0, 20))}
          maxLength={20}
        />
      </div>

      {/* 활동명 */}
      <div className='flex flex-col gap-[0.5rem]'>
        <ActivitySelect
          value={formData.activityName}
          onChange={(value) => setFormField('activityName', value)}
          dropdownItems={activities}
          width='100%'
        />
      </div>

      {/* 카테고리 & 버튼 묶음 */}
      <div className='flex flex-col items-center gap-[0.75rem]'>
        <div className='flex flex-col gap-[0.625rem]'>
          <div className='flex items-center gap-[0.5rem]'>
            <label className='typo-b2'>
              카테고리 <span className='text-[#DC0000]'>*</span>
            </label>
            {errors.category && (
              <span className='text-[0.875rem] text-[#DC0000]'>
                {errors.category}
              </span>
            )}
          </div>
          <InsightTemplateSelector
            onCategoryChange={(val) => setFormField('category', val as string)}
            contentError={errors.content}
          />
        </div>

        <CommonButton
          variantType='Primary'
          style={{ width: '10rem' }}
          onClick={handleRegisterClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center'>
              <ButtonSpinnerIcon size={32} />
            </span>
          ) : (
            '로그 등록하기'
          )}
        </CommonButton>
      </div>

      <LogCompleteModalMobile
        open={isCompleteModalOpen}
        onOpenChange={(open) => {
          setIsCompleteModalOpen(open);
          if (!open) onLogCreated();
        }}
      />

      <LoginRequiredModal
        open={isLoginRequiredModalOpen}
        onOpenChange={setIsLoginRequiredModalOpen}
      />
    </div>
  );
}
