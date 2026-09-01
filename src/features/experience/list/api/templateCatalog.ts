import { TemplateSectionResDTOSectionKind } from '@/api/models';
import type {
  TemplateCatalogResDTO,
  TemplateSectionResDTO,
} from '@/api/models';
import type { SectionKind } from '@/features/experience/list/types';

/**
 * GET /templates 로 받은 블록 템플릿 카탈로그.
 *
 * 드롭다운 라벨(담당업무·문제해결 하위 템플릿)과 블록 placeholder의 원본이다.
 * 아직 응답이 도착하지 않았거나 조회에 실패했을 때는 호출 측이 기존 상수로 되돌아가도록
 * undefined를 돌려준다. (문구가 잠깐 비어 보이는 것보다 낫다)
 */

const SECTION_KIND_BY_TEMPLATE: Record<string, SectionKind> = {
  [TemplateSectionResDTOSectionKind.DETAIL]: 'detail',
  [TemplateSectionResDTOSectionKind.ACHIEVEMENT]: 'achievement',
  [TemplateSectionResDTOSectionKind.TASK]: 'duty',
  [TemplateSectionResDTOSectionKind.PROBLEM_SOLVING]: 'problem',
  [TemplateSectionResDTOSectionKind.LEARNING]: 'learning',
};

let catalog: TemplateCatalogResDTO | null = null;

export function setTemplateCatalog(next: TemplateCatalogResDTO | undefined) {
  catalog = next ?? null;
}

function sectionOf(kind: SectionKind): TemplateSectionResDTO | undefined {
  return catalog?.sections?.find(
    (section) => SECTION_KIND_BY_TEMPLATE[section.sectionKind] === kind,
  );
}

/** 섹션의 level 4 슬롯 placeholder. (index번째 하위 블록에 쓴다) */
export function catalogSlotPlaceholder(
  kind: SectionKind,
  index: number,
): string | undefined {
  return sectionOf(kind)?.slots?.[index]?.placeholder;
}

/** 섹션의 level 4 슬롯 placeholder 전체. */
export function catalogSlotPlaceholders(
  kind: SectionKind,
): string[] | undefined {
  const slots = sectionOf(kind)?.slots;
  return slots && slots.length > 0
    ? slots.map((slot) => slot.placeholder)
    : undefined;
}

/** 담당업무·문제해결 하위 템플릿 목록. 드롭다운 옵션의 원본이다. */
export function catalogSubTemplateOptions(
  kind: SectionKind,
): Array<{ key: string; label: string }> | undefined {
  const subTemplates = sectionOf(kind)?.subTemplates;
  return subTemplates && subTemplates.length > 0
    ? subTemplates.map((template) => ({
        key: template.templateId,
        label: template.label,
      }))
    : undefined;
}

/** 선택한 하위 템플릿이 만들어 낼 level 5 블록들의 placeholder. */
export function catalogSubTemplateSlots(
  kind: SectionKind,
  templateId: string,
): string[] | undefined {
  const template = sectionOf(kind)?.subTemplates?.find(
    (item) => item.templateId === templateId,
  );
  return template && template.slots.length > 0
    ? template.slots.map((slot) => slot.placeholder)
    : undefined;
}
