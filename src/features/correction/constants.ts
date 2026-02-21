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

/** PDF 포트폴리오 초기 활동 블록 (활동 A, B, C) */
export const INITIAL_PDF_ACTIVITIES: PdfActivityBlock[] = [
  createPdfActivityBlock('pdf-act-0', '활동 A'),
  createPdfActivityBlock('pdf-act-1', '활동 B'),
  createPdfActivityBlock('pdf-act-2', '활동 C'),
];
