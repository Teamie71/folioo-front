import {
  buildNormalizedIconMap,
  normalizeRecommendationIconKey,
} from '@/features/recommendation/lib/normalizeRecommendationIconKey';

const JOB_ICON_BY_NAME: Record<string, string> = {
  // 영업·고객관리
  'B2B/기술영업': '/recommendation/b2b-tech-sales.svg',
  '해외영업': '/recommendation/overseas-sales.svg',
  '영업기획/관리': '/recommendation/sales-planning.svg',
  '유통영업/지점관리': '/recommendation/retail-branch-sales.svg',
  'CS.운영': '/recommendation/cs-operations.svg',
  'CX기획': '/recommendation/cx-planning.svg',
  'B2C영업': '/recommendation/b2c-sales.svg',
  '무역': '/recommendation/trade.svg',
  // 경영지원·인사
  HRM: '/recommendation/hrm.svg',
  HRD: '/recommendation/hrd.svg',
  '재무/회계': '/recommendation/finance-accounting.svg',
  '구매/SCM': '/recommendation/procurement-scm.svg',
  '총무/사무지원': '/recommendation/general-affairs.svg',
  '공공기관 일반행정': '/recommendation/public-admin.svg',
  // 금융투자
  '자산운용': '/recommendation/asset-management.svg',
  '증권리서치': '/recommendation/securities-research.svg',
  // 전략·기획
  '전략기획': '/recommendation/strategy-planning.svg',
  '사업개발': '/recommendation/business-development.svg',
  '서비스기획': '/recommendation/service-planning.svg',
  '상품기획': '/recommendation/product-planning.svg',
  '게임기획': '/recommendation/game-planning.svg',
  // 마케팅·광고·PR
  '콘텐츠마케팅': '/recommendation/content-marketing.svg',
  '브랜드마케팅': '/recommendation/brand-marketing.svg',
  '퍼포먼스마케팅': '/recommendation/performance-marketing.svg',
  'CRM마케팅': '/recommendation/crm-marketing.svg',
  '광고AE': '/recommendation/ad-ae.svg',
  '홍보/PR': '/recommendation/pr.svg',
  // 콘텐츠·미디어
  'PD/영상제작': '/recommendation/pd-video.svg',
  '에디터/카피라이터': '/recommendation/editor-copywriter.svg',
  '콘텐츠IP/채널운영': '/recommendation/content-ip-channel.svg',
  '콘텐츠기획': '/recommendation/content-planning.svg',
  // 디자인
  'UX/UI디자인': '/recommendation/ux-ui-design.svg',
  'BX/그래픽디자인': '/recommendation/bx-graphic-design.svg',
  '영상/모션디자인': '/recommendation/motion-design.svg',
  '제품디자인': '/recommendation/product-design.svg',
  // 개발·IT
  '프론트엔드개발': '/recommendation/frontend-dev.svg',
  '백엔드개발': '/recommendation/backend-dev.svg',
  '데이터분석': '/recommendation/data-analysis.svg',
  'AI/ML엔지니어': '/recommendation/ai-ml-engineer.svg',
  'QA 엔지니어': '/recommendation/qa-engineer.svg',
  '게임개발': '/recommendation/game-dev.svg',
  'DevOps 엔지니어': '/recommendation/devops-engineer.svg',
  '정보보안/네트워크인프라': '/recommendation/security-network.svg',
  // 생산·품질·연구
  '생산/공정기술': '/recommendation/production-process.svg',
  '품질관리/보증': '/recommendation/quality-assurance.svg',
  'R&D/연구개발': '/recommendation/rnd-research.svg',
};

const JOB_ICON_BY_NORMALIZED_NAME = buildNormalizedIconMap(JOB_ICON_BY_NAME);

export function getRecommendationJobIconSrc(jobName: string): string | null {
  return (
    JOB_ICON_BY_NORMALIZED_NAME.get(normalizeRecommendationIconKey(jobName)) ??
    null
  );
}
