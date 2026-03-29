import type {
  PdfActivityBlock,
  PdfActivityCategory,
  PdfCategoryName,
} from '@/types/correction';

/** PDF 활동 카테고리 목록 (사이드바/탭 순서) */
export const PDF_CATEGORY_NAMES: readonly PdfCategoryName[] = [
  '상세정보',
  '담당업무',
  '문제해결',
  '배운 점',
];

/** PDF 카테고리당 글자 수 제한 */
export const PDF_CATEGORY_CHAR_LIMIT = 400;

/** 기업 분석 정보 최대 길이 */
export const ANALYSIS_INFO_MAX_LENGTH = 1500;

/** 강조 포인트 최대 길이 */
export const EMPHASIS_POINTS_MAX_LENGTH = 200;

function createPdfCategory(name: PdfCategoryName): PdfActivityCategory {
  return { name, bullets: [''] };
}

export function createPdfActivityBlock(
  id: string,
  label: string,
): PdfActivityBlock {
  return {
    id,
    label,
    categories: PDF_CATEGORY_NAMES.map((name) => createPdfCategory(name)),
  };
}

/** `활동 A` ~ `활동 E` 형식만 슬롯 점유로 인식 (공백 생략·전각 A–E 허용) */
const PDF_PLACEHOLDER_LABEL_RE = /^활동\s*([A-EＡ-Ｅ])$/;

/** 활동 A~E 중 목록에 없는 가장 작은 인덱스(0=A). 모두 사용 중이면 null */
export function getNextPdfPlaceholderLabelIndex(
  activities: ReadonlyArray<{ label: string }>,
): number | null {
  const used = new Set<number>();
  for (const a of activities) {
    const m = a.label.trim().match(PDF_PLACEHOLDER_LABEL_RE);
    if (m) {
      const ch = m[1];
      const code = ch.charCodeAt(0);
      const i =
        code >= 0xff21 && code <= 0xff25
          ? code - 0xff21 /* Ａ–Ｅ */
          : code - 65;
      if (i >= 0 && i <= 4) used.add(i);
    }
  }
  for (let i = 0; i < 5; i++) {
    if (!used.has(i)) return i;
  }
  return null;
}

/** 활동 탭 기본 라벨 (순서대로 활동 A ~ 활동 E, 최대 5블록) */
export function getPdfActivityPlaceholderLabel(index: number): string {
  const i = Math.min(Math.max(index, 0), 4);
  return `활동 ${String.fromCharCode(65 + i)}`;
}

/** PDF 포트폴리오 초기 활동 블록 (활동 A, B, C) */
export const INITIAL_PDF_ACTIVITIES: PdfActivityBlock[] = [
  createPdfActivityBlock('pdf-act-0', getPdfActivityPlaceholderLabel(0)),
  createPdfActivityBlock('pdf-act-1', getPdfActivityPlaceholderLabel(1)),
  createPdfActivityBlock('pdf-act-2', getPdfActivityPlaceholderLabel(2)),
];
