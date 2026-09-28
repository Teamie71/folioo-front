'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { useAgentStatusStore } from '@/features/experience/list/model/agentStatusStore';
import { useExperienceListStore } from '@/store/useExperienceListStore';

type CompletionNotice = {
  experienceId: string;
  requestId: string;
  experienceName: string;
};

function AgentCompletionToast({
  notice,
  onConfirm,
  onDismiss,
}: {
  notice: CompletionNotice;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  useEffect(() => {
    let timer: number | undefined;
    const updateTimer = () => {
      window.clearTimeout(timer);
      if (document.visibilityState === 'visible' && document.hasFocus())
        timer = window.setTimeout(onDismiss, 6000);
    };
    updateTimer();
    document.addEventListener('visibilitychange', updateTimer);
    window.addEventListener('focus', updateTimer);
    window.addEventListener('blur', updateTimer);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', updateTimer);
      window.removeEventListener('focus', updateTimer);
      window.removeEventListener('blur', updateTimer);
    };
  }, [notice, onDismiss]);

  return createPortal(
    <div
      role='status'
      className='text-gray9 border-gray3 fixed right-[32px] bottom-[40px] z-[1000] flex max-w-[calc(100vw-64px)] items-center rounded-[12px] border bg-[#f5f4ff] px-[32px] py-[16px] font-sans text-[16px] leading-[24px] font-semibold tracking-normal shadow-[0_4px_8px_rgba(0,0,0,0.2)]'
    >
      <span className='min-w-0 break-keep'>
        {notice.experienceName} AI 에이전트가 작업을 완료했어요!
      </span>
      <button
        type='button'
        onClick={onConfirm}
        className='typo-b2-sb text-main ml-[28px] shrink-0 cursor-pointer whitespace-nowrap underline underline-offset-[3px]'
      >
        확인하기
      </button>
    </div>,
    document.body,
  );
}

/** 다른 활동이나 화면을 보는 동안 완료된 에이전트 응답을 알린다. */
export function AgentCompletionToastHost() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const [notices, setNotices] = useState<CompletionNotice[]>([]);
  const notice = notices[0];

  useEffect(() => {
    return useAgentStatusStore.subscribe((state, previous) => {
      for (const [experienceId, status] of Object.entries(
        state.byExperienceId,
      )) {
        const before = previous.byExperienceId[experienceId];
        if (
          status.kind !== 'success' ||
          before?.kind !== 'working' ||
          before.requestId !== status.requestId
        )
          continue;

        const list = useExperienceListStore.getState();
        const alreadyViewing =
          pathnameRef.current === '/experience/workspace' &&
          list.agentOpen &&
          list.selection?.kind === 'experience' &&
          list.selection.id === experienceId &&
          document.hasFocus();
        if (alreadyViewing) continue;

        const experience = list.experiences.find(
          (item) => item.id === experienceId,
        );
        setNotices((current) => [
          ...current,
          {
            experienceId,
            requestId: status.requestId,
            experienceName: experience?.name ?? '해당 활동',
          },
        ]);
      }
    });
  }, []);

  const dismiss = () => setNotices((current) => current.slice(1));
  const confirm = () => {
    if (!notice) return;
    const list = useExperienceListStore.getState();
    if (!list.agentOpen) list.toggleAgent();
    list.selectExperience(notice.experienceId);
    if (pathname !== '/experience/workspace') {
      router.push('/experience/workspace?view=list');
    } else {
      window.dispatchEvent(
        new CustomEvent('experience-agent:focus', {
          detail: notice.experienceId,
        }),
      );
    }
    dismiss();
  };

  return notice ? (
    <AgentCompletionToast
      key={`${notice.experienceId}:${notice.requestId}`}
      notice={notice}
      onConfirm={confirm}
      onDismiss={dismiss}
    />
  ) : null;
}
