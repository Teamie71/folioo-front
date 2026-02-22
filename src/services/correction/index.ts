import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api/common';
import type {
  CreateCorrectionReqDTO,
  CreateCorrectionResponse,
  ExtractPdfResponse,
  GetExternalPortfoliosResponse,
  PatchExternalPortfolioRequest,
  StructuredPortfolioResDTO,
} from '@/types/api/correction';
import type { PdfActivityBlock, PdfCategoryName } from '@/types/correction';

/** 첨삭 의뢰하기 (티켓 1장 사용) */
export async function createPortfolioCorrection(
  body: CreateCorrectionReqDTO,
): Promise<CreateCorrectionResponse> {
  const response = await apiClient.post<
    ApiResponse<CreateCorrectionResponse>
  >('/portfolio-corrections', body);

  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result;
  }

  throw new Error('첨삭 의뢰에 실패했습니다.');
}

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

/** bullets → API 필드 (줄바꿈으로 join) */
function fromBullets(bullets: string[]): string {
  return bullets.filter(Boolean).join('\n') || '';
}

/** PdfActivityBlock → PATCH body */
export function toPatchBody(block: PdfActivityBlock): PatchExternalPortfolioRequest {
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

/** API 응답 항목 → PdfActivityBlock (name→활동 탭 제목, description→상세정보, responsibilities→담당업무, problemSolving→문제해결, learnings→배운 점) */
function mapToPdfActivityBlock(
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

/** PDF 포트폴리오 활동 블록 추가 */
export async function postExternalPortfolio(
  correctionId: number,
  index: number,
): Promise<PdfActivityBlock> {
  const response = await apiClient.post<
    ApiResponse<StructuredPortfolioResDTO>
  >('/external-portfolios', { correctionId });

  if (response.data.isSuccess && response.data.result != null) {
    return mapToPdfActivityBlock(response.data.result, index);
  }

  throw new Error('활동 블록 추가에 실패했습니다.');
}

/** PDF 포트폴리오 텍스트 정리 결과 수정 */
export async function patchExternalPortfolio(
  portfolioId: number,
  body: PatchExternalPortfolioRequest,
): Promise<void> {
  const response = await apiClient.patch<
    ApiResponse<StructuredPortfolioResDTO>
  >(`/external-portfolios/${portfolioId}`, body);

  if (!response.data.isSuccess) {
    throw new Error('포트폴리오 수정에 실패했습니다.');
  }
}

/** PDF 포트폴리오 텍스트 정리 결과 삭제 */
export async function deleteExternalPortfolio(
  portfolioId: number,
): Promise<void> {
  const response = await apiClient.delete<ApiResponse<string>>(
    `/external-portfolios/${portfolioId}`,
  );

  if (!response.data.isSuccess) {
    throw new Error('포트폴리오 삭제에 실패했습니다.');
  }
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
