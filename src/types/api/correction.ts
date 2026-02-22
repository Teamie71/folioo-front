/** PDF 텍스트 추출 API - result 타입 (백엔드 규격에 맞게 수정) */
export type ExtractPdfResponse = string;

/** GET /external-portfolios - 포트폴리오 텍스트 정리 결과 항목 */
export interface StructuredPortfolioResDTO {
  portfolioId: number;
  name: string;
  description: string;
  responsibilities: string;
  problemSolving: string;
  learnings: string;
}

/** GET /external-portfolios - result 타입 */
export type GetExternalPortfoliosResponse = StructuredPortfolioResDTO[];

/** POST /portfolio-corrections - request body */
export type JobDescriptionType = 'TEXT' | 'IMAGE';

export interface CreateCorrectionReqDTO {
  jobDescriptionType: JobDescriptionType;
  companyName: string;
  positionName: string;
  jobDescription?: string;
}

/** POST /portfolio-corrections - result 타입 */
export type CreateCorrectionResponse = string;

/** PATCH /external-portfolios/{portfolioId} - request body */
export interface PatchExternalPortfolioRequest {
  name: string;
  description: string;
  responsibilities: string;
  problemSolving: string;
  learnings: string;
}
