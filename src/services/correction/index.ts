import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api/common';
import type {
  ExtractPdfResponse,
  GetExternalPortfoliosResponse,
  StructuredPortfolioResDTO,
} from '@/types/api/correction';
import type { PdfActivityBlock, PdfCategoryName } from '@/types/correction';

/** PDF 텍스트 추출 */
export async function extractPdfPortfolio(
  file: File,
): Promise<ExtractPdfResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiResponse<ExtractPdfResponse>>(
    '/external-portfolios/extract',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result;
  }

  throw new Error('텍스트 추출에 실패했습니다.');
}

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

/** API 응답 항목 → PdfActivityBlock (name→활동 탭 제목, description→상세정보, responsibilities→담당업무, problemSolving→문제해결, learnings→배운 점) */
function mapToPdfActivityBlock(
  dto: StructuredPortfolioResDTO,
  index: number,
): PdfActivityBlock {
  const id = `pdf-act-${index}`;
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
  };
}

/** PDF 포트폴리오 텍스트 정리 결과 조회 */
export async function getExternalPortfolios(
  correctionId: number,
): Promise<PdfActivityBlock[]> {
  const response = await apiClient.get<
    ApiResponse<GetExternalPortfoliosResponse>
  >('/external-portfolios', { params: { correctionId } });

  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result.map(mapToPdfActivityBlock);
  }

  throw new Error('포트폴리오 결과를 불러오는데 실패했습니다.');
}
