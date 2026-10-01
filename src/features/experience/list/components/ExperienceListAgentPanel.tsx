'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/utils/utils';
import { ListChevronIcon } from '@/components/icons/ListChevronIcon';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { SidebarPanelIcon } from '@/components/icons/SidebarPanelIcon';
import type { AgentConversation } from './ExperienceAgentConversation';
import { ExperienceAgentMain } from './ExperienceAgentMain';
import { useExperienceAgent } from '@/features/experience/list/hooks/useExperienceAgent';
import type { WorkspaceView } from '@/features/experience/workspace/model/workspaceView';
import type { Experience } from '@/features/experience/list/types';
import { useAgentStatusStore } from '@/features/experience/list/model/agentStatusStore';
import { useAuthStore } from '@/store/useAuthStore';
import { markAgentStatusSeen } from '@/features/experience/list/api/experienceAgentStatus';
import { getExperienceMapAiControllerGetActivityStatusesQueryKey } from '@/api/endpoints/experiencemap-ai-integration/experiencemap-ai-integration';
import {
  AgentStatusIndicator,
  agentStatusLabel,
} from '@/features/experience/list/components/AgentStatusIndicator';

const PANEL_MIN_WIDTH = 400;
const PANEL_MAX_WIDTH = 900;
const PANEL_TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

function AgentListExperienceRow({
  item,
  onSelect,
}: {
  item: Experience;
  onSelect: (id: string) => void;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentStatus = useAgentStatusStore(
    (state) => state.byExperienceId[item.id],
  );
  const kind = accessToken ? currentStatus?.kind : undefined;
  const statusLabel = agentStatusLabel(kind);

  return (
    <li className='ml-[24px] w-[calc(100%-24px)]'>
      <button
        type='button'
        className='text-gray9 hover:bg-gray3 min-h-[32px] w-full cursor-pointer rounded-[8px] py-[4px] pr-[4px] pl-[12px] text-left text-[16px] leading-[24px]'
        aria-label={`${item.name}${statusLabel ? `, ${statusLabel}` : ''}`}
        onClick={() => onSelect(item.id)}
      >
        <span className='inline-flex max-w-full items-center'>
          <span className='min-w-0 break-words'>{item.name}</span>
          <AgentStatusIndicator kind={kind} />
        </span>
      </button>
    </li>
  );
}

function ConnectedAgent({
  experienceId,
  visible,
  view,
  conversationOverride,
  dailyChatCount,
  input,
  onInputChange,
  attachment,
  onAttachmentChange,
}: {
  experienceId: string;
  visible: boolean;
  view: WorkspaceView;
  conversationOverride?: AgentConversation;
  dailyChatCount: number;
  input: string;
  onInputChange: (value: string) => void;
  attachment: File | null;
  onAttachmentChange: (file: File | null) => void;
}) {
  const agent = useExperienceAgent(experienceId, view);
  const status = useAgentStatusStore(
    (state) => state.byExperienceId[experienceId],
  );
  const acknowledge = useAgentStatusStore((state) => state.acknowledge);
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const markedOpen = useRef(false);
  const markedRequestId = useRef<string | null>(null);

  useEffect(() => {
    if (!visible) {
      markedOpen.current = false;
      return;
    }
    if (!accessToken) return;
    const terminal = status && status.kind !== 'working';
    if (terminal) {
      if (markedRequestId.current === status.requestId) return;
      markedRequestId.current = status.requestId;
      markedOpen.current = true;
    } else {
      if (markedOpen.current) return;
      markedOpen.current = true;
    }
    void markAgentStatusSeen(experienceId)
      .then(() => {
        if (terminal) {
          acknowledge(experienceId, status.requestId);
          void queryClient.invalidateQueries({
            queryKey: getExperienceMapAiControllerGetActivityStatusesQueryKey(),
          });
        }
      })
      .catch(() => {
        if (terminal) markedRequestId.current = null;
        else markedOpen.current = false;
      });
  }, [visible, accessToken, status, acknowledge, experienceId, queryClient]);

  return (
    <ExperienceAgentMain
      conversation={conversationOverride ?? agent.conversation}
      dailyChatCount={
        agent.limitReached
          ? agent.dailyChatLimit
          : (agent.dailyChatCount ?? dailyChatCount)
      }
      dailyChatLimit={agent.dailyChatLimit}
      input={input}
      onInputChange={onInputChange}
      attachment={attachment}
      onAttachmentChange={onAttachmentChange}
      onSend={agent.send}
      onStop={agent.stop}
      ready={agent.ready}
      historyLoading={Boolean(accessToken) && !agent.historyLoaded}
      isWorking={agent.isWorking}
      error={agent.error}
    />
  );
}

export function ExperienceListAgentPanel({
  conversations = {},
  dailyChatCount = 0,
  view = 'list',
}: {
  conversations?: Readonly<Record<string, AgentConversation>>;
  /** 로그인 사용자 전체 활동의 서버 기준 일일 합산 횟수 */
  dailyChatCount?: number;
  view?: WorkspaceView;
}) {
  const open = useExperienceListStore((s) => s.agentOpen);
  const onToggle = useExperienceListStore((s) => s.toggleAgent);
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const selection = useExperienceListStore((s) => s.selection);
  const selectExperience = useExperienceListStore((s) => s.selectExperience);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const experience =
    selection?.kind === 'experience'
      ? experiences.find((item) => item.id === selection.id)
      : undefined;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<Record<string, File | null>>(
    {},
  );
  const [panelWidth, setPanelWidth] = useState(PANEL_MIN_WIDTH);
  const reduceMotion = useReducedMotion();
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef<{ x: number; width: number } | null>(null);
  const clampPanelWidth = (width: number) =>
    Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, width));

  return (
    <motion.aside
      initial={false}
      animate={{
        width: open ? panelWidth : 0,
        opacity: open ? 1 : 0,
      }}
      transition={isResizing ? { duration: 0 } : PANEL_TRANSITION}
      style={{ overflow: 'hidden', position: 'relative' }}
      className='border-gray3 flex h-full shrink-0 flex-col border-l bg-[#f7f7f8]'
      aria-hidden={!open}
    >
      {open && (
        <div
          role='separator'
          aria-label='AI 에이전트 패널 너비 조절'
          aria-orientation='vertical'
          aria-valuemin={PANEL_MIN_WIDTH}
          aria-valuemax={PANEL_MAX_WIDTH}
          aria-valuenow={panelWidth}
          tabIndex={0}
          className='absolute inset-y-0 left-0 z-20 w-[8px] cursor-col-resize touch-none select-none'
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            resizeStart.current = { x: event.clientX, width: panelWidth };
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsResizing(true);
            event.preventDefault();
          }}
          onPointerMove={(event) => {
            if (!resizeStart.current) return;
            setPanelWidth(
              clampPanelWidth(
                resizeStart.current.width +
                  resizeStart.current.x -
                  event.clientX,
              ),
            );
          }}
          onPointerUp={(event) => {
            resizeStart.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
            setIsResizing(false);
          }}
          onPointerCancel={() => {
            resizeStart.current = null;
            setIsResizing(false);
          }}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 50 : 10;
            if (event.key === 'ArrowLeft')
              setPanelWidth((width) => clampPanelWidth(width + step));
            else if (event.key === 'ArrowRight')
              setPanelWidth((width) => clampPanelWidth(width - step));
            else if (event.key === 'Home') setPanelWidth(PANEL_MIN_WIDTH);
            else if (event.key === 'End') setPanelWidth(PANEL_MAX_WIDTH);
            else return;
            event.preventDefault();
          }}
        />
      )}
      <div
        className='flex h-full min-h-0 min-w-0 flex-col'
        style={{ width: panelWidth - 1 }}
        inert={!open}
      >
        <header className='flex shrink-0 items-center gap-[6px] px-[20px] pt-[24px]'>
          <button
            type='button'
            onClick={onToggle}
            className='flex size-[32px] cursor-pointer items-center justify-center rounded-[8px]'
            aria-label='AI 에이전트 접기'
            tabIndex={open ? 0 : -1}
          >
            <SidebarPanelIcon className='size-[20px]' />
          </button>
          <h2 className='text-gray9 min-w-0 text-[16px] leading-[24px] font-semibold tracking-normal break-words'>
            {experience
              ? `${experience.name} AI 에이전트`
              : 'AI 에이전트를 선택해 주세요.'}
          </h2>
        </header>

        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={experience?.id ?? 'agent-list'}
            className='flex min-h-0 flex-1 flex-col'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.16 }}
          >
            {!experience ? (
              <nav
                aria-label='활동별 AI 에이전트'
                className='mt-[24px] min-h-0 flex-1 overflow-y-auto pr-[20px] pb-[24px] pl-[44px]'
              >
                {groups.map((group) => {
                  const isCollapsed = collapsed[group.id] ?? false;
                  const selectedGroup =
                    selection?.kind === 'group' && selection.id === group.id;
                  return (
                    <div
                      key={group.id}
                      className='mb-[4px] flex flex-col gap-[4px]'
                    >
                      <button
                        type='button'
                        aria-expanded={!isCollapsed}
                        aria-controls={`agent-group-${group.id}`}
                        onClick={() =>
                          setCollapsed((prev) => ({
                            ...prev,
                            [group.id]: !prev[group.id],
                          }))
                        }
                        className={cn(
                          'text-gray9 flex min-h-[32px] w-full cursor-pointer items-center gap-[8px] rounded-[8px] py-[4px] pr-[8px] pl-[8px] text-left text-[16px] leading-[24px]',
                          selectedGroup
                            ? 'bg-gray3'
                            : !group.isUnclassified && 'hover:bg-gray3',
                        )}
                      >
                        <ListChevronIcon
                          aria-hidden
                          className={cn(
                            'size-[16px] shrink-0 transition-transform',
                            isCollapsed ? 'rotate-90' : 'rotate-180',
                          )}
                        />
                        <span className='break-words'>{group.name}</span>
                      </button>
                      <ul
                        id={`agent-group-${group.id}`}
                        hidden={isCollapsed}
                        className={
                          isCollapsed ? 'hidden' : 'flex flex-col gap-[4px]'
                        }
                      >
                        {experiences
                          .filter((item) => item.groupId === group.id)
                          .map((item) => (
                            <AgentListExperienceRow
                              key={item.id}
                              item={item}
                              onSelect={(id) => {
                                selectExperience(id);
                                window.dispatchEvent(
                                  new CustomEvent('experience-agent:focus', {
                                    detail: id,
                                  }),
                                );
                              }}
                            />
                          ))}
                      </ul>
                    </div>
                  );
                })}
              </nav>
            ) : (
              <ConnectedAgent
                key={experience.id}
                experienceId={experience.id}
                visible={open}
                view={view}
                conversationOverride={conversations[experience.id]}
                dailyChatCount={dailyChatCount}
                input={drafts[experience.id] ?? ''}
                onInputChange={(value) =>
                  setDrafts((prev) => ({ ...prev, [experience.id]: value }))
                }
                attachment={attachments[experience.id] ?? null}
                onAttachmentChange={(file) =>
                  setAttachments((prev) => ({ ...prev, [experience.id]: file }))
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
