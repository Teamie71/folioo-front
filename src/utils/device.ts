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

/**
 * 경험 워크스페이스에서 "모바일 레이아웃"을 렌더링할지 판단하는 단일 기준.
 *
 * proxy(뷰 정규화)와 workspace/page.tsx(실제 렌더링)가 반드시 같은 함수를 써야
 * URL의 view 값과 화면에 그려지는 뷰가 어긋나지 않는다.
 * (안드로이드 태블릿에서 ?view=map 이 통과하면서 모바일 리스트가 렌더링되던 문제)
 */
export function isMobileLayoutUserAgent(
  userAgent: string | null | undefined,
): boolean {
  return isTopupMobileUserAgent(userAgent) || isTablet(userAgent);
}
