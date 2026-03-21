// 기기 판별 유틸리티 (User Agent 기반)

const MOBILE_PHONE_UA_PATTERN =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|CriOS|FxiOS/i;

const TABLET_UA_PATTERN = /iPad|Android/i;

export function isTablet(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  // iPad는 명시적 체크
  if (/iPad/i.test(userAgent)) return true;
  // Android 중 'Mobile'이 없으면 태블릿으로 간주
  if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) return true;
  return false;
}

export function isMobilePhone(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  if (isTablet(userAgent)) return false;
  return MOBILE_PHONE_UA_PATTERN.test(userAgent);
}

const TOPUP_MOBILE_UA_PATTERN =
  /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i;

export function isTopupMobileUserAgent(
  userAgent: string | null | undefined,
): boolean {
  return TOPUP_MOBILE_UA_PATTERN.test(userAgent ?? '');
}
