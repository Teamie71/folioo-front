'use client';

import {
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
        'relative flex size-[16px] items-center justify-center overflow-hidden',
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

function MenuPanel({
  items,
  onClose,
  className,
  variant = 'sidebar',
  title,
}: {
  items: MenuItem[];
  onClose: () => void;
  className?: string;
  variant?: MenuVariant;
  title?: string;
}) {
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [subPos, setSubPos] = useState<MenuPosition | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isBlock = variant === 'block';

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
        {title ? <p className='typo-c1 text-gray6'>{title}</p> : null}
        <div
          className={cn(
            'shadow-chat-card overflow-hidden rounded-[8px] bg-white',
            className,
          )}
          role='menu'
        >
          {items.map((item, index) => (
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
                index === items.length - 1 && 'rounded-b-[8px]',
                isBlock && item.danger && 'text-error',
                openSub === item.key && 'bg-gray2',
              )}
              style={{
                height: MENU_ITEM_HEIGHT,
                padding: '4px 8px',
                boxSizing: 'border-box',
              }}
              onMouseEnter={() => {
                if (item.submenu) openSubmenuAt(item.key);
                else setOpenSub(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (item.submenu) {
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
              {index < items.length - 1 && (
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pos: MenuPosition;
  items: MenuItem[];
  variant: MenuVariant;
  menuClassName?: string;
  menuTitle?: string;
  contentRef?: RefObject<HTMLDivElement | null>;
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
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type Placement = 'left' | 'right' | 'bottom';

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
  menuAlign?: 'start' | 'center';
  menuTitle?: string;
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
}: MenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPos(null);
      return;
    }
    const update = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const menuWidth = MENU_WIDTH;
      const gap = MENU_GAP;
      const estimatedHeight = estimateMenuHeight(
        items.length,
        Boolean(menuTitle),
      );

      if (menuPlacement === 'bottom') {
        let left =
          menuAlign === 'start'
            ? rect.left
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
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, items.length, menuPlacement, menuAlign, menuTitle]);

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

  return (
    <div
      className={cn(
        'relative inline-flex cursor-grab',
        !open && 'pointer-events-none',
      )}
      data-no-dnd
    >
      <HoverTooltip
        label='드래그해서 옮기기'
        align={tooltipAlign}
        disabled={open || dragging}
        wrapperClassName={cn('cursor-grab', !open && 'pointer-events-none')}
      >
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

            const root =
              (e.currentTarget as HTMLElement).closest(measureSelector) ??
              (e.currentTarget as HTMLElement);
            const rect = root.getBoundingClientRect();
            const size = { width: rect.width, height: rect.height };

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
