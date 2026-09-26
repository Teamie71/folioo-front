import {
  CANONICAL_WORKSPACE_HREF,
  EXPERIENCE_ACTIVE_PATH,
} from '@/features/experience/workspace/model/workspaceView';
import { FEEDBACK_PATH } from '@/constants/feedback';

export type SidebarMenuItem = {
  label: string;
  href: string;
  /** href에 query가 붙는 경우 활성 상태 판정에 쓸 경로 */
  activePath?: string;
  expandedIcon: string;
  collapsedIcon: string;
  collapsedActiveIcon?: string;
  disabled?: boolean;
};

/** 데스크톱 사이드바와 모바일 메뉴가 같은 항목과 순서를 사용한다. */
export const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  {
    label: '직무 추천',
    href: '/recommendation',
    expandedIcon: '/sidebar/job-recommendation.svg',
    collapsedIcon: '/sidebar/job-recommendation-hover.svg',
    collapsedActiveIcon: '/sidebar/job-recommendation-active.svg',
  },
  {
    label: '경험 정리',
    href: CANONICAL_WORKSPACE_HREF,
    activePath: EXPERIENCE_ACTIVE_PATH,
    expandedIcon: '/sidebar/experience.svg',
    collapsedIcon: '/sidebar/experience-collapsed.svg',
  },
  {
    label: '포트폴리오 첨삭',
    href: '/correction',
    expandedIcon: '/sidebar/correction.svg',
    collapsedIcon: '/sidebar/correction-collapsed.svg',
  },
  {
    label: '피드백',
    href: FEEDBACK_PATH,
    expandedIcon: '/sidebar/feedback.svg',
    collapsedIcon: '/sidebar/feedback-collapsed.svg',
  },
];

export function isSidebarItemActive(pathname: string, item: SidebarMenuItem) {
  const activePath = item.activePath ?? item.href;
  return pathname === activePath || pathname.startsWith(`${activePath}/`);
}
