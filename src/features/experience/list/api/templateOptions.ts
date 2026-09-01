import {
  DUTY_TEMPLATE_OPTIONS,
  FREE_BLOCK_OPTION,
  PROBLEM_TEMPLATE_OPTIONS,
} from '@/features/experience/list/constants';
import { catalogSubTemplateOptions } from '@/features/experience/list/api/templateCatalog';
import type { TemplateKey } from '@/features/experience/list/types';

export type TemplateOption = { key: TemplateKey; label: string };

/**
 * 담당업무 템플릿 드롭다운 (3-2-2 / 5-2-3) 옵션.
 * 서버 카탈로그가 있으면 그 목록을, 없으면 기본 목록을 쓴다. 자유 블록은 항상 마지막에 붙는다.
 */
export function getDutyTemplateOptions(): TemplateOption[] {
  const fromCatalog = catalogSubTemplateOptions('duty');
  return fromCatalog
    ? [...fromCatalog, FREE_BLOCK_OPTION]
    : DUTY_TEMPLATE_OPTIONS;
}

/** 문제해결 템플릿 드롭다운 (3-2-3 / 5-2-4) 옵션. */
export function getProblemTemplateOptions(): TemplateOption[] {
  const fromCatalog = catalogSubTemplateOptions('problem');
  return fromCatalog
    ? [...fromCatalog, FREE_BLOCK_OPTION]
    : PROBLEM_TEMPLATE_OPTIONS;
}
