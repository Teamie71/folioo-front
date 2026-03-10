'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown, MarkdownStorage } from 'tiptap-markdown';
import { useEffect } from 'react';
import { cn } from '@/utils/utils';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  minHeight = '17.125rem',
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || '내용을 입력해주세요...',
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
        breaks: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const storage = editor.storage as Record<string, any>;
      if (storage.markdown) {
        onChange((storage.markdown as MarkdownStorage).getMarkdown());
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'max-w-none text-[1rem] font-normal text-[#1A1A1A] leading-[1.6] focus:outline-none h-full',
          '[&_h1]:!text-[2rem] [&_h1]:!font-bold [&_h1]:!mt-[1.5em] [&_h1]:!mb-[0.5em] [&_h1]:!pb-2 [&_h1]:!leading-tight',
          '[&_h2]:!text-[1.5rem] [&_h2]:!font-bold [&_h2]:!mt-[1.5em] [&_h2]:!mb-[0.5em] [&_h2]:!pb-2 [&_h2]:!leading-tight',
          '[&_h3]:!text-[1.25rem] [&_h3]:!font-bold [&_h3]:!mt-[1.5em] [&_h3]:!mb-[0.5em] [&_h3]:!leading-snug',
          '[&_p]:my-[1em]',
          '[&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2',
          '[&_strong]:font-bold [&_strong]:text-black',
          '[&_ul]:list-disc [&_ul]:pl-[1.5em] [&_ul]:my-[1em]',
          '[&_ol]:list-decimal [&_ol]:pl-[1.5em] [&_ol]:my-[1em]',
          '[&_li]:my-[0.25em]',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-[1em]',
          '[&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-[2em]',
          '[&_table]:w-full [&_table]:border-collapse [&_table]:my-[1em]',
          '[&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2 [&_th]:font-bold [&_th]:text-left',
          '[&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2'
        ),
      },
    },
  });

  // Sync value from outside if it changes (e.g., initial load)
  useEffect(() => {
    if (editor) {
      const storage = editor.storage as Record<string, any>;
      if (storage.markdown) {
        const currentMarkdown = (storage.markdown as MarkdownStorage).getMarkdown();
        if (value !== currentMarkdown) {
          editor.commands.setContent(value);
        }
      }
    }
  }, [editor, value]);

  return (
    <div
      className={cn(
        'w-full rounded-[1.25rem] border border-[#74777D] bg-transparent px-[1.25rem] py-[0.75rem] cursor-text',
        className
      )}
      style={{ minHeight }}
      onClick={() => editor?.commands.focus()}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
