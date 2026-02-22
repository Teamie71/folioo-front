'use client';

import { useEffect } from 'react';
import { cn } from '@/utils/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog';

interface CommonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // 텍스트 관련
  title?: React.ReactNode; // 제목
  description?: React.ReactNode; // 설명

  // 버튼 관련
  primaryBtnText?: string; // "진행", "결제", "사용" 등 메인 색상 버튼
  secondaryBtnText?: string; // "그만두기" 등 색상 없는 서브 버튼
  cancelBtnText?: string; // "취소" 등 취소 버튼
  onPrimaryClick?: () => void; // 메인 버튼 클릭 시 동작
  onSecondaryClick?: () => void; // 서브 버튼 클릭 시 동작
  onCancelClick?: () => void; // 취소 버튼 클릭 시 동작
  primaryBtnVariant?: 'default' | 'destructive' | 'outline' | 'secondary'; // 버튼 색상 조절

  // 버튼 배치 커스텀
  footer?: React.ReactNode;
  children?: React.ReactNode; // 본문에 추가 내용이 필요할 경우

  // 푸터 버튼 없이 닫기(X) 버튼만 사용할 때 true
  closeButtonOnly?: boolean;

  // 스타일
  className?: string; // 모달 크기 조절 등
  overlayClassName?: string; // 배경 오버레이 색상 조절
}

export function CommonModal({
  open,
  onOpenChange,
  title,
  description,
  primaryBtnText,
  secondaryBtnText,
  cancelBtnText,
  onPrimaryClick,
  onSecondaryClick,
  onCancelClick,
  primaryBtnVariant = 'default',
  footer,
  children,
  closeButtonOnly = false,
  className,
  overlayClassName,
}: CommonModalProps) {
  // 버튼이 없는지 확인 (secondaryBtnText, primaryBtnText, cancelBtnText가 모두 없을 때)
  const hasNoButtons = !primaryBtnText && !secondaryBtnText && !cancelBtnText;
  // 푸터 없이 닫기 버튼만 쓰는 경우 (X로만 닫기)
  const isCloseButtonOnly = hasNoButtons && closeButtonOnly;

  // 버튼이 전부 없고 closeButtonOnly가 아닐 때만 2초 후 자동으로 닫기
  useEffect(() => {
    if (open && hasNoButtons && !closeButtonOnly) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, hasNoButtons, closeButtonOnly, onOpenChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={
        isCloseButtonOnly ? onOpenChange : hasNoButtons ? () => {} : onOpenChange
      }
    >
      <DialogContent
        overlayClassName={overlayClassName}
        onInteractOutside={(e) => {
          if (hasNoButtons && !closeButtonOnly) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (hasNoButtons && !closeButtonOnly) {
            e.preventDefault();
          }
        }}
        className={cn(
          'items-center gap-[1.75rem] px-[5rem] py-[3.75rem] text-center',
          // 푸터 없이 자동 닫기 모드일 때만 닫기 버튼 숨기기
          hasNoButtons && !closeButtonOnly && '[&>button:last-child]:hidden',
          className,
        )}
      >
        {/* 헤더 영역 (제목 + 설명) */}
        {(title || description) && (
          <DialogHeader className='flex flex-col items-center justify-center gap-[0.25rem] space-y-0'>
            {title && (
              <DialogTitle className='line-height-[130%] text-center text-[1.125rem] font-bold'>
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className='line-height-[150%] text-center text-[0.875rem] text-[#74777D]'>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* 커스텀 컨텐츠 영역 (필요시) */}
        {children}

        {/* 푸터 영역 (버튼) */}
        {/* footer prop이 있으면 그걸 우선 쓰고, 없으면 기본 버튼 렌더링 */}
        {(footer || primaryBtnText || secondaryBtnText || cancelBtnText) && (
          <DialogFooter
            className={cn(
              'flex flex-row justify-center gap-[1.25rem] space-x-0 sm:space-x-0 [&>button]:m-0',
              // 버튼이 하나면 중앙 정렬
              !cancelBtnText &&
                !secondaryBtnText &&
                !primaryBtnText &&
                'justify-center',
            )}
          >
            {footer ? (
              footer
            ) : (
              <>
                {/* cancelBtnText 렌더링 */}
                {cancelBtnText && (
                  <button
                    className='w-[6.75rem] cursor-pointer rounded-[0.5rem] border-[0.1rem] border-[#74777D] py-[0.5rem] text-[1rem] transition-colors hover:bg-[#F6F8FA]'
                    onClick={onCancelClick || (() => onOpenChange(false))}
                  >
                    {cancelBtnText}
                  </button>
                )}
                {/* secondaryBtnText 렌더링 (cancelBtnText와 독립적으로 사용 가능) */}
                {secondaryBtnText && (
                  <button
                    className='w-[6.75rem] cursor-pointer rounded-[0.5rem] border-[0.1rem] border-[#74777D] py-[0.5rem] text-[1rem] transition-colors hover:bg-[#F6F8FA]'
                    onClick={onSecondaryClick || (() => onOpenChange(false))}
                  >
                    {secondaryBtnText}
                  </button>
                )}
                {/* primaryBtnText 렌더링 */}
                {primaryBtnText && (
                  <button
                    className='w-[6.75rem] cursor-pointer rounded-[0.5rem] bg-[#5060C5] py-[0.5rem] text-[1rem] font-semibold text-[#FFFFFF] transition-colors hover:bg-[#404D9E]'
                    onClick={onPrimaryClick}
                  >
                    {primaryBtnText}
                  </button>
                )}
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
