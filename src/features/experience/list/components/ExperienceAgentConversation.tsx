'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { PdfIcon } from '@/components/icons/PdfIcon';
import { FileText } from 'lucide-react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import styles from '@/styles/experience-agent.module.css';

export type AgentChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachment?: { name: string; size?: number };
  /** 성공 응답에만 제공. 실제 복원이 성공한 뒤 resolve해야 한다. */
  onRevert?: () => Promise<void>;
  reverted?: boolean;
};

export type AgentConversation = {
  messages: readonly AgentChatMessage[];
  isWorking?: boolean;
  workingText?: string;
  failure?: {
    nodeId: string;
    /** 실패한 노드를 전달받아 재실행하고 대화 상태를 갱신한다. */
    onRetry?: (nodeId: string) => Promise<void>;
  };
};

function AssistantResponse({
  message,
  canRevert,
}: {
  message: AgentChatMessage;
  canRevert: boolean;
}) {
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const [baseline] = useState(() => ({ groups, experiences }));
  const [reverted, setReverted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const isReverted = message.reverted || reverted;
  const unchanged =
    groups === baseline.groups && experiences === baseline.experiences;
  const revert = async () => {
    if (!message.onRevert || inFlight.current || !canRevert || !unchanged)
      return;
    inFlight.current = true;
    setPending(true);
    setError('');
    try {
      await message.onRevert();
      setReverted(true);
    } catch {
      setError('이전으로 되돌리지 못했어요. 다시 시도해 주세요.');
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };
  return (
    <div className={styles.assistantMessageRow}>
      <p
        className={`${styles.assistantMessage} ${isReverted ? styles.revertedResponse : ''}`}
      >
        {message.content}
      </p>
      {isReverted ? (
        <p role='status' className={styles.revertedNotice}>
          <Image
            src='/RevertCheckIcon.svg'
            alt=''
            width={18}
            height={18}
            className='shrink-0'
          />
          작업 내용을 이전으로 되돌렸어요.
        </p>
      ) : canRevert && unchanged && message.onRevert ? (
        <button
          type='button'
          onClick={revert}
          disabled={pending}
          aria-busy={pending}
          className={styles.revertButton}
        >
          <span aria-hidden className={styles.revertIcon} />
          이전으로 되돌리기
        </button>
      ) : null}
      {error && (
        <p role='alert' className={styles.revertError}>
          {error}
        </p>
      )}
    </div>
  );
}

function AgentFailure({
  failure,
}: {
  failure: NonNullable<AgentConversation['failure']>;
}) {
  const [pending, setPending] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);
  const inFlight = useRef(false);
  const retry = async () => {
    if (!failure.onRetry || inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setRetryFailed(false);
    try {
      await failure.onRetry(failure.nodeId);
    } catch {
      setRetryFailed(true);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };
  return (
    <div className={styles.failure}>
      <p className={styles.assistantMessage}>
        앗, 작업 중 오류가 발생했어요.
        <br />
        아래 버튼을 눌러 다시 시도해 주세요.
      </p>
      <button
        type='button'
        onClick={retry}
        disabled={pending || !failure.onRetry}
        aria-busy={pending}
        className={styles.retryButton}
      >
        다시 시도하기
      </button>
      {retryFailed && (
        <p role='alert' className={styles.revertError}>
          다시 시도하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}

export function ExperienceAgentConversation({
  messages,
  isWorking = false,
  workingText = '입력 내용을 확인하고 있어요.',
  failure,
}: AgentConversation) {
  return (
    <div className={styles.conversation}>
      <div
        role='log'
        aria-label='에이전트 대화'
        aria-relevant='additions text'
        className={styles.messages}
      >
        {messages.map((message, index) =>
          message.role === 'user' ? (
            <div key={message.id} className={styles.userMessageRow}>
              {message.attachment && (
                <div className={styles.sentAttachment}>
                  <span aria-hidden>
                    {/\.pdf$/i.test(message.attachment.name) ? (
                      <PdfIcon />
                    ) : (
                      <FileText size={32} />
                    )}
                  </span>
                  <div className={styles.sentAttachmentText}>
                    <p title={message.attachment.name}>
                      {message.attachment.name}
                    </p>
                    {message.attachment.size != null && (
                      <span>
                        {(message.attachment.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    )}
                  </div>
                </div>
              )}
              {message.content && (
                <p className={styles.userBubble}>{message.content}</p>
              )}
            </div>
          ) : (
            <AssistantResponse
              key={message.id}
              message={message}
              canRevert={
                !isWorking && !failure && index === messages.length - 1
              }
            />
          ),
        )}
      </div>
      {!isWorking && failure && (
        <AgentFailure key={failure.nodeId} failure={failure} />
      )}
      {isWorking && (
        <div role='status' aria-live='polite' className={styles.workingStatus}>
          <span aria-hidden className={styles.workingDotSlot}>
            <span className={styles.workingDot} />
          </span>
          <span className={styles.workingText}>{workingText}</span>
        </div>
      )}
    </div>
  );
}
