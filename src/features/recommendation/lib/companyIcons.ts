import {
  buildNormalizedIconMap,
  normalizeRecommendationIconKey,
} from '@/features/recommendation/lib/normalizeRecommendationIconKey';

const COMPANY_ICON_BY_NAME: Record<string, string> = {
  '대기업': '/recommendation/company-large.svg',
  '중견·중소기업': '/recommendation/company-sme.svg',
  '스타트업': '/recommendation/company-startup.svg',
  '공기업·공공기관': '/recommendation/company-public.svg',
  '외국계': '/recommendation/company-foreign.svg',
  '에이전시': '/recommendation/company-agency.svg',
};

const COMPANY_ICON_BY_NORMALIZED_NAME =
  buildNormalizedIconMap(COMPANY_ICON_BY_NAME);

export function getRecommendationCompanyIconSrc(
  companyName: string,
): string | null {
  return (
    COMPANY_ICON_BY_NORMALIZED_NAME.get(
      normalizeRecommendationIconKey(companyName),
    ) ?? null
  );
}
