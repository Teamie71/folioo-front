'use client';

import { cn } from '@/utils/utils';
import type { Block } from '@/features/experience/list/types';

/** 텍스트가 공란인 블록은 미리보기에 표시하지 않는다. 하위에 내용이 있으면 살아남는다. */
function hasVisibleContent(block: Block): boolean {
  if (block.text.trim()) return true;
  return block.children.some(hasVisibleContent);
}

function PreviewChildren({ blocks }: { blocks: Block[] }) {
  const visible = blocks.filter(hasVisibleContent);
  if (visible.length === 0) return null;

  return (
    <ul className='ml-[20px] flex flex-col gap-[16px]'>
      {visible.map((block) => (
        <li key={block.id} className='flex flex-col gap-[16px]'>
          {block.text.trim() && (
            <div className='flex items-start gap-[8px]'>
              <span
                aria-hidden
                className='bg-gray9 mt-[8px] size-[4px] shrink-0 rounded-full'
              />
              <span className='typo-c1 text-gray9 whitespace-pre-wrap'>
                {block.text}
              </span>
            </div>
          )}
          <PreviewChildren blocks={block.children} />
        </li>
      ))}
    </ul>
  );
}

/**
 * 활동 미리보기 모달의 본문. 리스트 뷰와 같은 구조(섹션 제목 + 불릿 목록)를
 * 읽기 전용으로 렌더링한다. 편집·드래그 관련 로직은 전혀 없다 — 텍스트는
 * 네이티브 선택으로 드래그해 복사할 수 있으면 그걸로 충분하다.
 */
export function MapActivityPreviewContent({ blocks }: { blocks: Block[] }) {
  const sections = blocks.filter(hasVisibleContent);

  if (sections.length === 0) {
    return <p className='typo-c1 text-gray6'></p>;
  }

  return (
    <div className='flex flex-col gap-[16px]'>
      {sections.map((section) => (
        <div key={section.id} className='flex flex-col gap-[16px]'>
          <h3 className={cn('typo-c1-sb text-gray9')}>{section.text}</h3>
          <PreviewChildren blocks={section.children} />
        </div>
      ))}
    </div>
  );
}
