const COMPANY_ICON_BY_NAME: Record<string, string> = {
  '대기업': '/recommendation/company-large.svg',
  '01 대기업': '/recommendation/company-large.svg',
  '중견·중소기업': '/recommendation/company-sme.svg',
  '중견/중소기업': '/recommendation/company-sme.svg',
  '02 중견·중소기업': '/recommendation/company-sme.svg',
  '스타트업': '/recommendation/company-startup.svg',
  '03 스타트업': '/recommendation/company-startup.svg',
  '공기업·공공기관': '/recommendation/company-public.svg',
  '공기업/공공기관': '/recommendation/company-public.svg',
  '04 공기업·공공기관': '/recommendation/company-public.svg',
  '외국계': '/recommendation/company-foreign.svg',
  '05 외국계': '/recommendation/company-foreign.svg',
  '에이전시': '/recommendation/company-agency.svg',
  '06 에이전시': '/recommendation/company-agency.svg',
};

function normalizeCompanyName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}

export function getRecommendationCompanyIconSrc(
  companyName: string,
): string | null {
  const key = normalizeCompanyName(companyName);
  return COMPANY_ICON_BY_NAME[key] ?? null;
}
