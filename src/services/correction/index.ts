import type { StructuredPortfolioResDTO } from '@/api/models';
import type { UpdatePortfolioBlockReqDTO } from '@/api/models';
import {
  getNextPdfPlaceholderLabelIndex,
  getPdfActivityPlaceholderLabel,
} from '@/features/correction/constants';
import type { PdfActivityBlock, PdfCategoryName } from '@/types/correction';

/** 줄바꿈으로 분리 후 빈 문자열이면 [''] */
function toBullets(text: string): string[] {
  const bullets = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return bullets.length > 0 ? bullets : [''];
}

const CATEGORY_ORDER: PdfCategoryName[] = [
  '상세정보',
  '담당업무',
  '문제해결',
  '배운 점',
];

/**
 * PATCH/DB 저장용: PDF 추출과 동일하게 줄마다 `- 내용` 형식으로 이어붙임.
 * 불릿 문자열 안의 줄바꿈도 각각 한 줄로 분리해 하이픈을 붙임.
 */
function fromBullets(bullets: string[]): string {
  const lines: string[] = [];
  for (const b of bullets) {
    for (const segment of b.split(/\r?\n/)) {
      const t = segment.trim();
      if (!t) continue;
      const body = t.replace(/^-\s*/, '');
      lines.push(`- ${body}`);
    }
  }
  return lines.join('\n');
}

/** PdfActivityBlock → PATCH body (Orval UpdatePortfolioBlockReqDTO) */
export function toPatchBody(block: PdfActivityBlock): UpdatePortfolioBlockReqDTO {
  const bulletsMap = Object.fromEntries(
    block.categories.map((c) => [c.name, c.bullets]),
  ) as Record<PdfCategoryName, string[]>;
  return {
    name: block.label,
    description: fromBullets(bulletsMap['상세정보'] ?? ['']),
    responsibilities: fromBullets(bulletsMap['담당업무'] ?? ['']),
    problemSolving: fromBullets(bulletsMap['문제해결'] ?? ['']),
    learnings: fromBullets(bulletsMap['배운 점'] ?? ['']),
  };
}

/** API StructuredPortfolioResDTO → PdfActivityBlock */
export function mapToPdfActivityBlock(
  dto: StructuredPortfolioResDTO,
  index: number,
): PdfActivityBlock {
  const id = `pdf-act-${dto.portfolioId ?? index}`;
  const bulletsMap: Record<PdfCategoryName, string[]> = {
    상세정보: toBullets(dto.description),
    담당업무: toBullets(dto.responsibilities),
    문제해결: toBullets(dto.problemSolving),
    '배운 점': toBullets(dto.learnings),
  };
  return {
    id,
    /** 비어 있으면 호출부에서 슬롯 기준으로 채움 (리스트 인덱스로 A/B 부여하지 않음) */
    label: dto.name?.trim() || '',
    categories: CATEGORY_ORDER.map((name) => ({
      name,
      bullets: bulletsMap[name],
    })),
    portfolioId: dto.portfolioId,
  };
}

/**
 * 서버에서 내려온 활동명이 비어 있을 때, 배열 순서가 아니라
 * 이미 쓰인 `활동 A`~`E`를 제외한 가장 작은 슬롯에 라벨을 붙임.
 * (예: 첫 줄이 `익명의 활동`이면 다음 빈 이름은 `활동 A`가 됨)
 */
export function assignPlaceholderLabelsForEmptyPdfNames(
  blocks: PdfActivityBlock[],
): PdfActivityBlock[] {
  const out: PdfActivityBlock[] = [];
  for (const b of blocks) {
    if (b.label.trim()) {
      out.push(b);
      continue;
    }
    const idx = getNextPdfPlaceholderLabelIndex(out);
    out.push({
      ...b,
      label: getPdfActivityPlaceholderLabel(idx ?? 0),
    });
  }
  return out;
}
