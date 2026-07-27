'use client';

import { ExperienceListBlockNode } from '@/features/experience/list/components/ExperienceListBlockNode';
import {
  BlockDndContext,
} from '@/features/experience/list/hooks/useBlockDnd';
import { useBlockTreeDnd } from '@/features/experience/list/hooks/useBlockTreeDnd';
import type { Block } from '@/features/experience/list/types';

export function ExperienceListBlockTree({
  experienceId,
  blocks,
}: {
  experienceId: string;
  blocks: Block[];
}) {
  const { value, onRootDragOver, onRootDrop } = useBlockTreeDnd(
    experienceId,
    blocks,
  );

  return (
    <BlockDndContext.Provider value={value}>
      <div
        className='flex flex-col gap-[20px]'
        onDragOver={onRootDragOver}
        onDrop={onRootDrop}
      >
        {blocks.map((section) => (
          <ExperienceListBlockNode
            key={section.id}
            block={section}
            level={3}
            parentKind={null}
          />
        ))}
      </div>
    </BlockDndContext.Provider>
  );
}
