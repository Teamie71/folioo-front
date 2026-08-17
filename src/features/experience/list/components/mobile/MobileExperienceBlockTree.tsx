'use client';

import { useEffect, useState } from 'react';
import { BlockDndContext } from '@/features/experience/list/hooks/useBlockDnd';
import { useBlockTreeDnd } from '@/features/experience/list/hooks/useBlockTreeDnd';
import { MobileExperienceSection } from '@/features/experience/list/components/mobile/MobileExperienceSection';
import type { Block } from '@/features/experience/list/types';

type Props = {
  experienceId: string;
  blocks: Block[];
};

export function MobileExperienceBlockTree({ experienceId, blocks }: Props) {
  const { value, onRootDragOver, onRootDrop } = useBlockTreeDnd(
    experienceId,
    blocks,
  );

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCollapsed((prev) => {
      const hadState = Object.keys(prev).length > 0;
      const next: Record<string, boolean> = {};
      blocks.forEach((block, index) => {
        if (Object.prototype.hasOwnProperty.call(prev, block.id)) {
          next[block.id] = prev[block.id]!;
          return;
        }
        next[block.id] = hadState ? false : index !== 0;
      });
      return next;
    });
  }, [blocks]);

  return (
    <BlockDndContext.Provider value={value}>
      <div
        className='flex flex-col gap-[8px]'
        onDragOver={onRootDragOver}
        onDrop={onRootDrop}
      >
        {blocks.map((section, index) => (
          <MobileExperienceSection
            key={section.id}
            block={section}
            index={index}
            collapsed={collapsed[section.id] ?? false}
            onToggle={() =>
              setCollapsed((prev) => ({
                ...prev,
                [section.id]: !(prev[section.id] ?? false),
              }))
            }
          />
        ))}
      </div>
    </BlockDndContext.Provider>
  );
}
