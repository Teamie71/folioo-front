'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HoverTooltip } from '@/components/HoverTooltip';
import {
  type DragPayload,
  type DragSize,
  setDragPayload,
} from '@/features/experience/list/components/DropIndicator';
import { KebabIcon } from '@/components/icons/KebabIcon';
import { ListChevronIcon } from '@/components/icons/ListChevronIcon';

const MENU_GAP = 4;
/** 맵 뷰 블록 추가 버튼 오른쪽에 붙는 템플릿 드롭다운의 간격 */
const RIGHT_BOTTOM_GAP = 6;
const MENU_WIDTH = 120;
const MENU_ITEM_HEIGHT = 32;
const MENU_TITLE_HEIGHT = 18;
const VIEWPORT_PAD = 8;

const menuContentCls = cn(
  'z-[200] overflow-visible rounded-none border-0 bg-transparent p-0 shadow-none outline-none',
  'min-w-0 data-[state=open]:animate-none data-[state=closed]:animate-none',
);

type MenuPosition = { top: number; left: number; maxHeight?: number };

function estimateMenuHeight(itemCount: number, hasTitle = false) {
  const titleBlock = hasTitle ? MENU_TITLE_HEIGHT + MENU_GAP : 0;
  return titleBlock + itemCount * MENU_ITEM_HEIGHT;
}

function fitMenuInViewport(
  preferredTop: number,
  preferredLeft: number,
  height: number,
): MenuPosition {
  const available = window.innerHeight - VIEWPORT_PAD * 2;
  if (height > available) {
    return {
      top: VIEWPORT_PAD,
      left: preferredLeft,
      maxHeight: available,
    };
  }
  let top = preferredTop;
  if (top + height > window.innerHeight - VIEWPORT_PAD) {
    top = window.innerHeight - VIEWPORT_PAD - height;
  }
  if (top < VIEWPORT_PAD) top = VIEWPORT_PAD;
  return { top, left: preferredLeft };
}

function KebabTriggerIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'text-gray9 relative flex size-[16px] items-center justify-center overflow-hidden',
        className,
      )}
    >
      <KebabIcon className='h-[10px] w-[2px]' />
    </span>
  );
}

function MenuChevron({ className }: { className?: string }) {
  return (
    <span
      className={cn('relative size-[16px] shrink-0 overflow-hidden', className)}
      aria-hidden
    >
      <ListChevronIcon className='absolute inset-0 rotate-90' />
    </span>
  );
}

export type MenuItem = {
  key: string;
  label: string;
  danger?: boolean;
  onSelect?: () => void;
  submenu?: MenuItem[];
  submenuTitle?: string;
};

export type MenuVariant = 'sidebar' | 'block';

export type SubmenuMode = 'cascade' | 'inline';

function MenuPanel({
  items,
  onClose,
  className,
  variant = 'sidebar',
  title,
  submenuMode = 'cascade',
  onInlineOpen,
}: {
  items: MenuItem[];
  onClose: () => void;
  className?: string;
  variant?: MenuVariant;
  title?: string;
  submenuMode?: SubmenuMode;
  onInlineOpen?: (itemCount: number, hasTitle: boolean) => void;
}) {
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [subPos, setSubPos] = useState<MenuPosition | null>(null);
  const [inlineKey, setInlineKey] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isBlock = variant === 'block';
  const isInline = submenuMode === 'inline';

  const inlineParent = inlineKey
    ? items.find((i) => i.key === inlineKey && i.submenu)
    : undefined;
  const visibleItems = inlineParent?.submenu ?? items;
  const visibleTitle = inlineParent ? inlineParent.submenuTitle : title;

  const openSubmenuAt = (key: string) => {
    const el = itemRefs.current[key];
    const item = items.find((i) => i.key === key);
    if (el && item?.submenu) {
      const rect = el.getBoundingClientRect();
      const left =
        rect.right + MENU_GAP + MENU_WIDTH > window.innerWidth - VIEWPORT_PAD
          ? rect.left - MENU_WIDTH - MENU_GAP
          : rect.right + MENU_GAP;
      const height = estimateMenuHeight(
        item.submenu.length,
        Boolean(item.submenuTitle),
      );
      setSubPos(fitMenuInViewport(rect.top, left, height));
    }
    setOpenSub(key);
  };

  return (
    <>
      <div className='flex flex-col gap-[4px]' style={{ width: MENU_WIDTH }}>
        {visibleTitle ? (
          <p className='typo-c1 text-gray6'>{visibleTitle}</p>
        ) : null}
        <div
          className={cn(
            'shadow-chat-card overflow-hidden rounded-[8px] bg-white',
            className,
          )}
          role='menu'
        >
          {visibleItems.map((item, index) => (
            <button
              key={item.key}
              ref={(el) => {
                itemRefs.current[item.key] = el;
              }}
              type='button'
              role='menuitem'
              className={cn(
                'typo-b2 text-gray9 hover:bg-gray2 relative flex w-full cursor-pointer items-center text-left whitespace-nowrap',
                index === 0 && 'rounded-t-[8px]',
                index === visibleItems.length - 1 && 'rounded-b-[8px]',
                isBlock && item.danger && 'text-error',
                openSub === item.key && 'bg-gray2',
              )}
              style={{
                height: MENU_ITEM_HEIGHT,
                padding: '4px 8px',
                boxSizing: 'border-box',
              }}
              onMouseEnter={() => {
                if (isInline) return;
                if (item.submenu) openSubmenuAt(item.key);
                else setOpenSub(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (item.submenu) {
                  if (isInline) {
                    setInlineKey(item.key);
                    onInlineOpen?.(
                      item.submenu.length,
                      Boolean(item.submenuTitle),
                    );
                    return;
                  }
                  if (openSub === item.key) setOpenSub(null);
                  else openSubmenuAt(item.key);
                  return;
                }
                item.onSelect?.();
                onClose();
              }}
            >
              <span className='flex w-full items-center justify-between gap-[8px]'>
                <span>{item.label}</span>
                {item.submenu && <MenuChevron />}
              </span>
              {index < visibleItems.length - 1 && (
                <span
                  aria-hidden
                  className='bg-gray3 pointer-events-none absolute right-0 bottom-0 left-0 h-px'
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {openSub &&
        subPos &&
        typeof document !== 'undefined' &&
        createPortal(
          items
            .filter((i) => i.key === openSub && i.submenu)
            .map((item) => (
              <div
                key={`sub-${item.key}`}
                data-experience-list-submenu=''
                className='fixed z-[201]'
                style={{
                  top: subPos.top,
                  left: subPos.left,
                  ...(subPos.maxHeight != null
                    ? {
                        maxHeight: subPos.maxHeight,
                        overflowY: 'auto' as const,
                      }
                    : {}),
                }}
                onMouseEnter={() => setOpenSub(item.key)}
              >
                <MenuPanel
                  items={item.submenu!}
                  onClose={onClose}
                  variant={variant}
                  title={item.submenuTitle}
                />
              </div>
            )),
          document.body,
        )}
    </>
  );
}

function isListSubmenuTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest('[data-experience-list-submenu]'))
  );
}

function PositionedMenu({
  open,
  onOpenChange,
  pos,
  items,
  variant,
  menuClassName,
  menuTitle,
  contentRef,
  submenuMode,
  onInlineOpen,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pos: MenuPosition;
  items: MenuItem[];
  variant: MenuVariant;
  menuClassName?: string;
  menuTitle?: string;
  contentRef?: RefObject<HTMLDivElement | null>;
  submenuMode?: SubmenuMode;
  onInlineOpen?: (itemCount: number, hasTitle: boolean) => void;
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          tabIndex={-1}
          aria-hidden
          className='pointer-events-none fixed opacity-0'
          style={{
            top: pos.top,
            left: pos.left,
            width: 1,
            height: 1,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        ref={contentRef}
        side='bottom'
        align='start'
        sideOffset={0}
        avoidCollisions={false}
        className={menuContentCls}
        style={{
          width: MENU_WIDTH,
          minWidth: MENU_WIDTH,
          maxWidth: MENU_WIDTH,
          ...(pos.maxHeight != null
            ? { maxHeight: pos.maxHeight, overflowY: 'auto' as const }
            : {}),
        }}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          if (isListSubmenuTarget(e.target)) e.preventDefault();
        }}
        onFocusOutside={(e) => {
          if (isListSubmenuTarget(e.target)) e.preventDefault();
        }}
      >
        <MenuPanel
          items={items}
          onClose={() => onOpenChange(false)}
          className={menuClassName}
          variant={variant}
          title={menuTitle}
          submenuMode={submenuMode}
          onInlineOpen={onInlineOpen}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type Placement = 'left' | 'right' | 'right-bottom' | 'bottom' | 'inside-end';

type MenuButtonProps = {
  items: MenuItem[];
  ariaLabel: string;
  className?: string;
  menuClassName?: string;
  wrapClassName?: string;
  variant?: MenuVariant;
  children: ReactNode;
  tooltip?: string;
  menuPlacement?: Placement;
  menuAlign?: 'start' | 'center' | 'end';
  menuTitle?: string;
  submenuMode?: SubmenuMode;
  /**
   * 'right-bottom' 배치에서 세로 위치의 기준이 되는 요소.
   * 생략하면 트리거 버튼 자신을 기준으로 삼는다.
   * 메뉴의 아래쪽 끝을 이 요소의 아래쪽 끝에 맞추고 위로 펼친다.
   */
  anchorRef?: RefObject<HTMLElement | null>;
  /** 값이 바뀔 때마다 열려 있는 메뉴를 닫는다. (예: 맵 캔버스를 움직이기 시작했을 때) */
  closeSignal?: number;
};

export function MenuButton({
  items,
  ariaLabel,
  className,
  menuClassName,
  wrapClassName,
  variant = 'sidebar',
  children,
  tooltip,
  menuPlacement = 'left',
  menuAlign = 'center',
  menuTitle,
  submenuMode = 'cascade',
  anchorRef,
  closeSignal,
}: MenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const [inlineShape, setInlineShape] = useState<{
    itemCount: number;
    hasTitle: boolean;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open) setInlineShape(null);
  }, [open]);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- closeSignal 변경 자체가 트리거다.
  useEffect(() => {
    if (closeSignal == null) return;
    setOpen(false);
  }, [closeSignal]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPos(null);
      return;
    }
    const update = () => {
      const trigger = triggerRef.current!;
      const rect = trigger.getBoundingClientRect();
      const menuWidth = MENU_WIDTH;
      const gap = MENU_GAP;
      const estimatedHeight = estimateMenuHeight(
        inlineShape?.itemCount ?? items.length,
        inlineShape ? inlineShape.hasTitle : Boolean(menuTitle),
      );

      if (menuPlacement === 'inside-end') {
        const style = window.getComputedStyle(trigger);
        const padRight = parseFloat(style.paddingRight) || 0;
        const padTop = parseFloat(style.paddingTop) || 0;
        let left = rect.right - padRight - menuWidth;
        if (left < VIEWPORT_PAD) left = VIEWPORT_PAD;
        if (left + menuWidth > window.innerWidth - VIEWPORT_PAD) {
          left = window.innerWidth - VIEWPORT_PAD - menuWidth;
        }
        setPos(fitMenuInViewport(rect.top + padTop, left, estimatedHeight));
        return;
      }

      if (menuPlacement === 'right-bottom') {
        const anchorRect = (
          anchorRef?.current ?? trigger
        ).getBoundingClientRect();
        let left = rect.right + RIGHT_BOTTOM_GAP;
        if (left + menuWidth > window.innerWidth - VIEWPORT_PAD) {
          left = Math.max(
            VIEWPORT_PAD,
            rect.left - menuWidth - RIGHT_BOTTOM_GAP,
          );
        }
        const top = anchorRect.bottom - estimatedHeight;
        setPos(fitMenuInViewport(top, left, estimatedHeight));
        return;
      }

      if (menuPlacement === 'bottom') {
        let left =
          menuAlign === 'start'
            ? rect.left
            : menuAlign === 'end'
              ? rect.right - menuWidth
              : rect.left + (rect.width - menuWidth) / 2;
        if (left < VIEWPORT_PAD) left = VIEWPORT_PAD;
        if (left + menuWidth > window.innerWidth - VIEWPORT_PAD) {
          left = window.innerWidth - VIEWPORT_PAD - menuWidth;
        }
        let top = rect.bottom + gap;
        if (top + estimatedHeight > window.innerHeight - VIEWPORT_PAD) {
          top = Math.max(VIEWPORT_PAD, rect.top - gap - estimatedHeight);
        }
        setPos(fitMenuInViewport(top, left, estimatedHeight));
        return;
      }

      let left =
        menuPlacement === 'right'
          ? rect.right + gap
          : rect.left - menuWidth - gap;
      if (menuPlacement === 'right') {
        if (left + menuWidth > window.innerWidth - VIEWPORT_PAD) {
          left = Math.max(VIEWPORT_PAD, rect.left - menuWidth - gap);
        }
      } else if (left < VIEWPORT_PAD) {
        left = Math.min(
          rect.right + gap,
          window.innerWidth - menuWidth - VIEWPORT_PAD,
        );
      }
      setPos(fitMenuInViewport(rect.top, left, estimatedHeight));
    };
    update();

    /*
     * 'right-bottom'(맵 뷰 블록 추가 템플릿 드롭다운)은 트리거가 xyflow 캔버스 위에 있다.
     * 캔버스를 드래그/휠로 이동해도 실제 window 'scroll' 이벤트가 발생하는데,
     * 이때마다 트리거의 새 화면 좌표로 다시 계산하면 드롭다운이 캔버스를 따라
     * 계속 움직이는 것처럼 보인다. 열린 시점의 위치에 고정해 따라오지 않게 한다.
     */
    if (menuPlacement === 'right-bottom') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, items.length, menuPlacement, menuAlign, menuTitle, inlineShape]);

  const button = (
    <button
      ref={triggerRef}
      type='button'
      aria-label={ariaLabel}
      aria-expanded={open}
      className={cn(
        'cursor-pointer',
        className,
        open && '!pointer-events-auto !opacity-100',
      )}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
      }}
    >
      {children}
    </button>
  );

  return (
    <div className={cn('relative inline-flex', wrapClassName)}>
      {tooltip ? (
        <HoverTooltip label={tooltip} disabled={open}>
          {button}
        </HoverTooltip>
      ) : (
        button
      )}
      {open &&
        pos &&
        typeof document !== 'undefined' &&
        createPortal(
          <PositionedMenu
            open={open}
            onOpenChange={setOpen}
            pos={pos}
            items={items}
            variant={variant}
            menuClassName={menuClassName}
            menuTitle={menuTitle}
            submenuMode={submenuMode}
            onInlineOpen={(itemCount, hasTitle) =>
              setInlineShape({ itemCount, hasTitle })
            }
          />,
          document.body,
        )}
    </div>
  );
}

type DragMenuButtonProps = {
  items: MenuItem[];
  ariaLabel: string;
  className?: string;
  menuClassName?: string;
  variant?: MenuVariant;
  children?: ReactNode;
  payload: DragPayload;
  measureSelector?: string;
  onDragBegin?: (size: DragSize) => void;
  onDragFinish?: () => void;
  tooltipAlign?: 'center' | 'start';
};

export function DragMenuButton({
  items,
  ariaLabel,
  className,
  menuClassName,
  variant = 'sidebar',
  children = <KebabTriggerIcon />,
  payload,
  measureSelector = '[data-dnd-measure]',
  onDragBegin,
  onDragFinish,
  tooltipAlign = 'center',
}: DragMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const [dragging, setDragging] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const didDragRef = useRef(false);

  const handleOpenChange = (next: boolean) => {
    if (didDragRef.current || dragging) {
      setOpen(false);
      return;
    }
    setOpen(next);
  };

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPos(null);
      return;
    }
    const update = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const row = trigger.closest('[data-dnd-measure]') as HTMLElement | null;
      const rowRect = row?.getBoundingClientRect() ?? rect;
      const gap = MENU_GAP;
      const edge = VIEWPORT_PAD;
      const menuBox = contentRef.current?.getBoundingClientRect();
      const menuWidth = menuBox?.width || MENU_WIDTH;
      const menuHeight = menuBox?.height || items.length * MENU_ITEM_HEIGHT;

      const leftCandidate = rect.left - menuWidth - gap;
      if (leftCandidate >= edge) {
        let top = rect.top + rect.height / 2 - menuHeight / 2;
        if (top < edge) top = edge;
        if (top + menuHeight > window.innerHeight - edge) {
          top = Math.max(edge, window.innerHeight - edge - menuHeight);
        }
        setPos({ top, left: leftCandidate });
        return;
      }

      let left = rect.left;
      if (left + menuWidth > window.innerWidth - edge) {
        left = Math.max(edge, rect.right - menuWidth);
      }
      let top = rowRect.bottom + gap;
      if (top + menuHeight > window.innerHeight - edge) {
        top = Math.max(edge, rowRect.top - menuHeight - gap);
      }
      setPos({ top, left });
    };

    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, items.length]);

  const measureSize = () => {
    const root =
      triggerRef.current?.closest(measureSelector) ?? triggerRef.current;
    if (!root) return { width: 0, height: 0 };
    const rect = root.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  };

  const gatePointer = !open;

  const button = (
    <button
      ref={triggerRef}
      type='button'
      draggable
      aria-label={ariaLabel}
      aria-expanded={open}
      className={cn(
        className,
        '!cursor-grab select-none active:!cursor-grabbing',
        open && '!pointer-events-auto !opacity-100',
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (didDragRef.current) {
          didDragRef.current = false;
          return;
        }
        setOpen((prev) => !prev);
      }}
      onDragStart={(e) => {
        didDragRef.current = true;
        setDragging(true);
        setOpen(false);
        e.dataTransfer.effectAllowed = 'move';

        const size = measureSize();

        const empty = document.createElement('div');
        empty.style.width = '1px';
        empty.style.height = '1px';
        empty.style.opacity = '0';
        empty.style.position = 'fixed';
        empty.style.top = '-9999px';
        document.body.appendChild(empty);
        e.dataTransfer.setDragImage(empty, 0, 0);
        requestAnimationFrame(() => {
          empty.remove();
        });

        setDragPayload(e, payload);
        onDragBegin?.(size);
      }}
      onDragEnd={() => {
        setDragging(false);
        onDragFinish?.();
        window.setTimeout(() => {
          didDragRef.current = false;
        }, 50);
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      className={cn(
        'relative inline-flex cursor-grab',
        gatePointer && 'pointer-events-none',
      )}
      data-no-dnd
    >
      <HoverTooltip
        label='드래그해서 옮기기'
        align={tooltipAlign}
        disabled={open || dragging}
        wrapperClassName={cn('cursor-grab', gatePointer && 'pointer-events-none')}
      >
        {button}
      </HoverTooltip>
      {open &&
        pos &&
        typeof document !== 'undefined' &&
        createPortal(
          <PositionedMenu
            open={open}
            onOpenChange={handleOpenChange}
            pos={pos}
            items={items}
            variant={variant}
            menuClassName={menuClassName}
            contentRef={contentRef}
          />,
          document.body,
        )}
    </div>
  );
}
