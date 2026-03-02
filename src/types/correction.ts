/** 첨삭 플로우 단계 */
export type Step = 'information' | 'portfolio' | 'analysis' | 'result';

/** 첨삭 상태 */
export type Status = 'DRAFT' | 'ANALYZING' | 'DONE';

/** 포트폴리오 종류 (텍스트형 / PDF) */
export type PortfolioType = 'text' | 'pdf';

/** PDF 활동 카테고리명 (상세정보, 담당업무, 문제해결, 배운 점) */
export type PdfCategoryName =
  | '상세정보'
  | '담당업무'
  | '문제해결'
  | '배운 점';

/** PDF 활동 내 한 카테고리 (이름 + 불릿 목록) */
export type PdfActivityCategory = {
  name: PdfCategoryName;
  bullets: string[];
};

/** PDF 활동 블록 (활동 A/B/C... 단위, 카테고리 배열) */
export type PdfActivityBlock = {
  id: string;
  label: string;
  categories: PdfActivityCategory[];
  /** API portfolioId (PATCH 시 필요) */
  portfolioId?: number;
};

/** JD(직무) 이미지 업로드 메타 (프론트 전용) */
export interface JdUploadedFile {
  name: string;
  size: number;
  previewUrl: string;
}

/** 파일 삭제 확인 모달 타겟 (프론트 전용) */
export type FileDeleteConfirmTarget =
  | { type: 'jd'; index: number }
  | { type: 'pdf' }
  | null;

/** 정보 입력 단계 검증 에러 (프론트 전용) */
export interface InformationErrors {
  companyName: boolean;
  jobTitle: boolean;
  jobDescription: boolean;
}
