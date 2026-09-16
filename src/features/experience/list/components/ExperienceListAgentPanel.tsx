'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { SidebarPanelIcon } from '@/components/icons/SidebarPanelIcon';
import { ExperienceAgentMain } from './ExperienceAgentMain';

const PANEL_WIDTH = '400px';
const PANEL_TRANSITION = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

export function ExperienceListAgentPanel() {
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

  return (
    <motion.aside
      initial={false}
      animate={{
        width: open ? PANEL_WIDTH : 0,
        opacity: open ? 1 : 0,
      }}
      transition={PANEL_TRANSITION}
      style={{ overflow: 'hidden' }}
      className='border-gray3 flex h-full shrink-0 flex-col border-l bg-[#f7f7f8]'
      aria-hidden={!open}
    >
      <div className='flex h-full min-h-0 w-[400px] flex-col' inert={!open}>
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

        {!experience ? (
          <nav
            aria-label='활동별 AI 에이전트'
            className='mt-[24px] min-h-0 flex-1 overflow-y-auto pr-[20px] pb-[24px] pl-[52px]'
          >
            {groups.map((group) => {
              const isCollapsed = collapsed[group.id] ?? false;
              const Chevron = isCollapsed ? ChevronRight : ChevronDown;
              return (
                <div key={group.id} className='mb-[8px]'>
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
                    className='text-gray9 flex min-h-[36px] w-full cursor-pointer items-center gap-[8px] text-left text-[16px] leading-[24px]'
                  >
                    <Chevron
                      aria-hidden
                      className='text-gray5 size-[16px] shrink-0'
                    />
                    <span className='break-words'>{group.name}</span>
                  </button>
                  <ul id={`agent-group-${group.id}`} hidden={isCollapsed}>
                    {experiences
                      .filter((item) => item.groupId === group.id)
                      .map((item) => (
                        <li key={item.id}>
                          <button
                            type='button'
                            className='text-gray9 hover:bg-gray2 min-h-[36px] w-full cursor-pointer rounded-[4px] py-[6px] pl-[24px] text-left text-[16px] leading-[24px] break-words'
                            onClick={() => {
                              selectExperience(item.id);
                              window.dispatchEvent(
                                new CustomEvent('experience-agent:focus', {
                                  detail: item.id,
                                }),
                              );
                            }}
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        ) : (
          <ExperienceAgentMain
            key={experience.id}
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
      </div>
    </motion.aside>
  );
}
