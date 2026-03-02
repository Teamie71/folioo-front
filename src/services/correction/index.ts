import type { StructuredPortfolioResDTO } from '@/api/models';
import type { UpdatePortfolioBlockReqDTO } from '@/api/models';
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

function fromBullets(bullets: string[]): string {
  return bullets.filter(Boolean).join('\n') || '';
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
    label: dto.name,
    categories: CATEGORY_ORDER.map((name) => ({
      name,
      bullets: bulletsMap[name],
    })),
    portfolioId: dto.portfolioId,
  };
}
