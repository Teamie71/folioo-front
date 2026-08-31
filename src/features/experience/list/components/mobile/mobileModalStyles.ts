import { cn } from '@/utils/utils';

/**
 * 모바일 모달 공통 스타일.
 *
 * 공용 CommonModal을 그대로 쓰되 모바일 폭·타이포·간격만 덮어쓴다.
 * (경험 정리 모바일 화면의 모달이 모두 같은 규격이라 한곳에 모아 둔다)
 */
export const MOBILE_MODAL_CLS = cn(
  'box-border w-[280px] max-w-[calc(100vw-2rem)] gap-[24px] overflow-hidden rounded-[16px] bg-gray1 px-[16px] py-[32px]',
  '[&>button:last-child]:hidden',
  '[&_h2]:!text-[16px] [&_h2]:!leading-[1.5] [&_h2]:!font-semibold [&_h2]:!tracking-normal',
  '[&_p]:!text-[14px] [&_p]:!leading-[1.5] [&_p]:!text-gray6',
  '[&>div.flex.flex-col]:gap-[8px]',
  '[&>div.flex.flex-row]:gap-[12px]',
);

export const MOBILE_MODAL_OVERLAY_CLS = 'z-[99]';
